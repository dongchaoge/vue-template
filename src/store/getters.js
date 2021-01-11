const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.info,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  mainMenu: state => state.permission.mainMenu
}

export default getters
