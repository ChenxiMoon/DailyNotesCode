export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/lala.html", { loader: () => import(/* webpackChunkName: "lala.html" */"F:/Zmk/DailyNotesCode/docs/.vuepress/.temp/pages/lala.html.js"), meta: {"title":""} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"F:/Zmk/DailyNotesCode/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);
