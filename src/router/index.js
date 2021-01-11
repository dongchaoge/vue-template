/*
 * @Author: monster
 * @Date: 2020-12-07 14:14:11
 * @LastEditors: monster
 * @LastEditTime: 2021-01-06 13:36:30
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 一些不变的路由
const constantRouterMap = [
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@views/externalPage/404'),
    meta: {
      whiteBg: true
    }
  },
  {
    // 登录
    path: '/login',
    name: 'Login',
    component: () => import('@views/externalPage/login')
  }
]
// 一些独立的页面
const externalPage = []
const complexRouter = [...constantRouterMap, ...externalPage]
const createRouter = () =>
  new VueRouter({
    routes: complexRouter
  })

const router = createRouter()
router.beforeEach((to, from, next) => {
  if (to.meta.whiteBg) {
    // 一些独立的打印页面，需要去掉body的底色
    document.body.classList.remove('dark-bg')
  }
  next()
})
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
