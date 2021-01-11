import query from './query'

export const getTempCredential = (data, cb, errcb) => {
  // 获取存储信息
  data.isBase = true
  data.appCode = 'GM_ITRADE'
  data.contentType = 'form'
  query('objectStorage/getTempCredential', data, cb, errcb)
}

export const tradeTypeEnum = (data, cb) => {
  query('enum/tradeTypeEnum', data, cb)
}
// 获取公司配置
export const getCompanyConfig = (data, cb) => {
  return query('cmConfig/list', data, cb)
}
