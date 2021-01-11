import Cookies from 'js-cookie'
import { err } from '@util'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  // console.log('to::', to)
  if (whiteList.includes(to.path)) {
    // 白名单路径，免登录,直接进入
    next()
  } else {
    if (Cookies.get('token')) {
      if (store.getters.addRouters.length === 0) {
        store
          .dispatch('permission/generateRoutes')
          .then(() => {
            // 使用replace，保证router已经加载完成
            next({ ...to, replace: true })
          })
          .catch((e) => {
            console.log(e)
            err('请求用户权限信息失败，请重试')
            NProgress.done()
            setTimeout(() => {
              next('/login')
            }, 2000)
          })
      } else {
        // console.log('to::', to)
        store.commit('permission/SET_CURRENT_PATH_NAME', to.meta.title)
        next()
      }
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
