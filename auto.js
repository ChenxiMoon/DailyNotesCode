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
