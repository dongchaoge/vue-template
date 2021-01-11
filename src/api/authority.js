import query from './query'
// 权限管理

// 角色管理--start
export const createRole = (data, cb) => {
  return query('role/add', data, cb)
}

export const updateRole = (data, cb) => {
  return query('role/update', data, cb)
}

export const listRole = (data, cb) => {
  return query('role/list', data, cb)
}

export const removeRole = (data, cb) => {
  return query('role/remove', data, cb)
}

// 获取角色选中的权限列表
export const getRoleDetail = (data, cb) => {
  return query('role/get', data, cb)
}

export const listRoleUsers = (data, cb) => {
  return query('role/listRoleUsers', data, cb)
}

// 获取全量权限列表
export const getAllPermissionList = (data, cb) => {
  return query('role/listPermissionTree', data, cb)
}
// 获取角色类型列表
export const listRoleSn = (data, cb) => {
  return query('role/listRoleSn', data, cb)
}

export const listMyPermission = (data, cb) => {
  return query('role/listMyPermission', data, cb)
}
export const listMyPermissionTree = (data, cb) => {
  return query('role/listMyPermissionTree', data, cb)
}
// 角色管理--end

// 成员管理--start
export const addEmployee = (data, cb) => {
  return query('employee/add', data, cb)
}

export const updateEmployee = (data, cb) => {
  return query('employee/update', data, cb)
}

export const listEmployee = (data, cb) => {
  return query('employee/list', data, cb)
}

export const changeEmployeeState = (data, cb) => {
  return query('employee/changeState', data, cb)
}

export const employeeDetail = (data, cb) => {
  return query('employee/get', data, cb)
}
// 成员管理--end

// 店铺管理--start

export const getShopAllInfo = (data, cb) => { // 获取店铺的所有信息
  return query('sp/shop/getAllInfo', data, cb)
}

export const setShopInfo = (data, cb) => { // 设置店铺基础信息
  return query('sp/shop/set', data, cb)
}

export const getShopDeliveryAddress = (data, cb) => { // 获取店铺的所有信息
  return query('sp/shop-address/list', data, cb)
}

export const listContactByAdmin = (data, cb) => { // 店铺联系人
  return query('sp/shop-contact/listByAdmin', data, cb)
}

export const addContact = (data, cb) => { // 店铺联系人
  return query('sp/shop-contact/add', data, cb)
}

export const removeContact = (data, cb) => { // 删除店铺联系人
  return query('sp/shop-contact/remove', data, cb)
}

export const listAddress = (data, cb) => { // 获取商铺交割地址列表
  return query('sp/shop-address/list', data, cb)
}

export const addAddress = (data, cb) => { // 添加交割地址
  return query('sp/shop-address/add', data, cb)
}

export const removeAddress = (data, cb) => { // 删除交割地址
  return query('sp/shop-address/remove', data, cb)
}

export const getTime = (data, cb) => { // 查询店铺营业时间列表
  return query('sp/business-time/list', data, cb)
}

export const addTime = (data, cb) => { // 添加营业时间
  return query('sp/business-time/add', data, cb)
}

export const removeTime = (data, cb) => { // 删除营业时间
  return query('sp/business-time/remove', data, cb)
}

export const changeTradeState = (data, cb) => { // 改变市场交易状态
  return query('sp/shop/changeTradeState', data, cb)
}
// 店铺管理--end
