import query from './query'

export const login = (data, cb, errcb) => {
  // 获取存储信息
  return query('user/loginByEmployee', data, cb, errcb)
}

// 根据userCode 获取详情
export const getUserByCode = (data, cb) => {
  query('user/getUserByCode', data, cb)
}
