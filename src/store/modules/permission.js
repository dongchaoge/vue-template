/**
 * 向后端请求用户的菜单，动态生成路由
 */
import router, { resetRouter } from '@/router'
import { err } from '@util'
import { listMyPermissionTree } from '@api/authority'
import { generatorDynamicRouter } from '@/router/generator-routers'
const state = {
  addRouters: [],
  mainMenu: [],
  currentPathName: ''
}
const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRouters = routes
  },
  SET_MAIN_MENU: (state, mainMenu) => {
    state.mainMenu = mainMenu
  },
  SET_CURRENT_PATH_NAME: (state, name) => {
    state.currentPathName = name
  }
}
const actions = {
  generateRoutes ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      listMyPermissionTree({})
        .then(({ data }) => {
          if (!data || !data.length) {
            err('暂无权限，请联系管理员')
            return
          }
          // 生成权限列表
          dispatch('user/generatorRoleList', data, { root: true })
          // 设置菜单
          commit('SET_MAIN_MENU', data)
          // 生成路由
          const routers = generatorDynamicRouter(data)
          commit('SET_ROUTERS', routers)
          // 保证路由是重置后的--正常会在登出时重置
          resetRouter()
          router.addRoutes(routers)
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
