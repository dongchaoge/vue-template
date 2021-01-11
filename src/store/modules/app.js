const state = {
  // 用于刷新当前页面
  isRouterAlive: true,
  // 左侧导航栏
  sideCollapsed: false
}
const mutations = {
  SET_SIDE_COLLAPSED: (state, sideCollapsed) => {
    state.sideCollapsed = sideCollapsed
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
