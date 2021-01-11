/*
 * @Author: monster
 * @Date: 2020-12-24 09:43:57
 * @LastEditors: monster
 * @LastEditTime: 2020-12-24 09:58:18
 */
import Storage from 'good-storage'
import Cookies from 'js-cookie'
import { login } from '@api/login'
import { resetRouter } from '@/router'
const state = {
  token: Cookies.get('token'),
  info: Storage.get('userInfo') || {},
  roles: {}
}

const mutations = {
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  }
}
const actions = {
  // 登录
  login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(({ data }) => {
          Cookies.set('token', data.token, { expires: 30 })
          Cookies.set('x-token', data.token, { domain: '.huangjinx.com', expires: 30 })
          Storage.set('userInfo', data.user)
          Storage.set('userRoleList', data.roleList) // 这个是用来判断客户权益里面的搜索的
          commit('SET_TOKEN', data.token)
          commit('SET_INFO', data.user)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 登出
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      Cookies.remove('token')
      Storage.remove('userInfo')
      Storage.remove('userRoleList')
      commit('SET_TOKEN', '')
      commit('SET_INFO', {})
      commit('SET_ROLES', [])
      // 清空路由信息
      commit('permission/SET_ROUTERS', [], { root: true })
      resetRouter()
      resolve()
    })
  },
  // 生成权限列表
  generatorRoleList ({ commit, state }, data) {
    const roleMap = {}
    generator(data)
    function generator (list) {
      list.map(item => {
        if (item.router) {
          // 有路由的-是具体的(最低级)(现在是指二级)页面
          roleMap[item.router] = item
        } else {
          generator(item.children)
        }
      })
    }
    // console.log(roleMap)
    commit('SET_ROLES', roleMap)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
