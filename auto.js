/*
 * @Author: ChenxiMoon 2403133073@qq.com
 * @Date: 2025-08-08 23:15:16
 * @LastEditors: ChenxiMoon 2403133073@qq.com
 * @LastEditTime: 2025-08-09 18:22:28
 * @Description: 自动监听 DailyNotesCode 项目文件变动并 git add/commit/push
 */

const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// 监听 DailyNotesCode 目录，改成你的项目实际路径
const projectRoot = path.resolve('F:\\Zmk\\DailyNotesCode');

const watcher = chokidar.watch(projectRoot, {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件夹和文件
  persistent: true,
});

let timeout = null;

watcher.on('all', (event, filePath) => {
  console.log(`文件变化: ${event} -> ${filePath}`);

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('开始执行 git add、commit 和 push ...');

    const execOptions = { cwd: projectRoot };

    exec('git add -A', execOptions, (err, stdout, stderr) => {
      if (err) {
        console.error('git add 失败:', err);
        if (stderr) console.error(stderr);
        return;
      }
      console.log('git add 成功');
      if (stdout) console.log('git add 输出:', stdout);
      if (stderr) console.log('git add 错误输出:', stderr);

      exec('git commit -m "auto commit by watcher"', execOptions, (err2, stdout2, stderr2) => {
        if (err2) {
          const noChange = (stderr2 && (stderr2.includes('nothing to commit') || stderr2.includes('没有要提交的更改'))) ||
                           (stdout2 && (stdout2.includes('nothing to commit') || stdout2.includes('没有要提交的更改')));
          if (noChange) {
            console.log('无新的变动，跳过提交');
          } else {
            console.error('git commit 失败:', err2);
            console.error('git commit stdout:', stdout2);
            console.error('git commit stderr:', stderr2);
          }
          return;
        }
        console.log('git commit 成功:', stdout2);

        exec('git push origin main', execOptions, (err3, stdout3, stderr3) => {
          if (err3) {
            console.error('git push 失败:', err3);
            console.error('git push stdout:', stdout3);
            console.error('git push stderr:', stderr3);
            return;
          }
          console.log('git push 成功！');
          if (stdout3) console.log('git push 输出:', stdout3);
          if (stderr3) console.log('git push 错误输出:', stderr3);
        });
      });
    });
  }, 2000);
});

console.log('自动提交推送监听已启动，正在监控目录:', projectRoot);


// const chokidar = require('chokidar');
// const { exec } = require('child_process');
// const path = require('path');

// const projectRoot = path.resolve('F:\\Zmk\\DailyNotesCode');
// console.log('监听项目目录:', projectRoot);

// const watcher = chokidar.watch(projectRoot, {
//   ignored: /(^|[\/\\])\../, // 忽略隐藏文件
//   persistent: true,
//   ignoreInitial: true,      // 启动时不触发事件
//   awaitWriteFinish: {
//     stabilityThreshold: 1000,
//     pollInterval: 100,
//   },
// });

// let timeout = null;

// function runGitCommands() {
//   console.log('开始执行 git add、commit 和 push ...');

//   const execOptions = { cwd: projectRoot };

//   exec('git status --porcelain', execOptions, (err, stdout, stderr) => {
//     if (err) {
//       console.error('git status 失败:', err);
//       return;
//     }
//     if (!stdout.trim()) {
//       console.log('无文件变动，跳过提交');
//       return;
//     }

//     exec('git add -A', execOptions, (errAdd, stdoutAdd, stderrAdd) => {
//       if (errAdd) {
//         console.error('git add 失败:', errAdd);
//         return;
//       }
//       console.log('git add 成功');

//       exec('git commit -m "auto commit by watcher"', execOptions, (errCommit, stdoutCommit, stderrCommit) => {
//         if (errCommit) {
//           // 判断是不是没改动而报错
//           if ((stderrCommit && stderrCommit.includes('nothing to commit')) ||
//               (stdoutCommit && stdoutCommit.includes('nothing to commit'))) {
//             console.log('无新的变动，跳过提交');
//             return;
//           }
//           console.error('git commit 失败:', errCommit);
//           return;
//         }
//         console.log('git commit 成功:', stdoutCommit);

//         exec('git push origin main', execOptions, (errPush, stdoutPush, stderrPush) => {
//           if (errPush) {
//             console.error('git push 失败:', errPush);
//             return;
//           }
//           console.log('git push 成功！');
//         });
//       });
//     });
//   });
// }

// function scheduleGitOps() {
//   if (timeout) clearTimeout(timeout);
//   timeout = setTimeout(runGitCommands, 2000);
// }

// watcher
//   .on('add', filePath => {
//     console.log(`新增文件: ${filePath}`);
//     scheduleGitOps();
//   })
//   .on('change', filePath => {
//     console.log(`修改文件: ${filePath}`);
//     scheduleGitOps();
//   })
//   .on('unlink', filePath => {
//     console.log(`删除文件: ${filePath}`);
//     scheduleGitOps();
//   })
//   .on('addDir', dirPath => {
//     console.log(`新增目录: ${dirPath}`);
//     scheduleGitOps();
//   })
//   .on('unlinkDir', dirPath => {
//     console.log(`删除目录: ${dirPath}`);
//     scheduleGitOps();
//   });

// console.log('监听已启动，等待所有文件和目录的变动...');
