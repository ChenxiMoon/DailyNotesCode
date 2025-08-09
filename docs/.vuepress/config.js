import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'  // 导入 vite 打包器

export default defineUserConfig({
  lang: 'zh-CN',
  title: '我的笔记',
  description: '每日学习记录',
  base: '/DailyNotesCode/',

  theme: defaultTheme({
    navbar: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about/' },
    ],
    sidebar: 'auto',
  }),

  bundler: viteBundler(),  // 指定使用 vite 作为打包器
})
