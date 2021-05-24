import { API_URL, BASE_URL } from '@/utils/config'
import { json2str, str2json, err } from '@/utils/util'
import Store from '@/store'
let timer = ''
const timeOut = 1000 * 25
let loading = false
function query (functionName, data = {}, options = {}) {
  options = {
    ...{
      json2str: [], // 存储数据时字段转换
      str2json: [], // 获取数据时字段转换
      isBase: false, // 请求base的接口
      noLoading: false, // 取消loading
      noToken: false,
      noError: false,
      _queryUrl: false,
      setHeaders: false,
      httpType: 'post'
    },
    ...options
  }

  if (options.json2str.length) {
    options.json2str.forEach(key => {
      data[key] = json2str(data[key])
    })
  }

  let queryUrl = `${API_URL}/${functionName}`
  if (options.isBase) {
    queryUrl = `${BASE_URL}/${functionName}`
  }
  if (options._queryUrl) {
    // 如果是外部接口
    queryUrl = options._queryUrl
  }

  if (!options.noLoading) {
    uni.showLoading({
      mask: true
    })
    loading = true
  }
  const fetchOption = {
    data,
    method: options.httpType,
    url: queryUrl,
    timeout: timeOut,
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
  if (uni.getStorageSync('merchantCompanyCode') && !options.isBase) {
    fetchOption.header.merchantCompanyCode = uni.getStorageSync('merchantCompanyCode')
  }
  if (uni.getStorageSync('X-JWT') && !options.noToken) {
    fetchOption.header['X-JWT'] = uni.getStorageSync('X-JWT')
  }
  if (options.setHeaders) {
    fetchOption.header = Object.assign(fetchOption.header, data.setHeaders)
  }

  if (options.httpType === 'get') {
    // get和head方法不能有body
    const body = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&')
    fetchOption.url = `${queryUrl}?${body}`
  }
  return uni
    .request(fetchOption)
    .then(data => {
      uni.hideLoading()
      loading = false

      const res = data.length >= 2 ? data[1] : {}

      if (!res || !res.data || res.data.code !== 200) {
        // 登出
        if ([-10001, 80000001].includes(res.data?.code)) {
          err('为了您的账户安全，请重新登录！')

          // 多个接口重新登录导致 重复跳转
          if (timer) {
            clearTimeout(timer)
          }

          timer = setTimeout(() => {
            Store.dispatch('user/userLoginOut')

            uni.navigateTo({
              url: '/pages/login/index'
            })
          }, 1500)
          return Promise.reject(res.data)
        }
        if (res.data.state === '501') {
          err('服务器重启中，请稍后')
          return Promise.reject(res.data)
        }
        if (!options.noError) {
          err(res.data.code === 500 ? '服务器维护中...' : res.data.msg)
        }
        return Promise.reject(res.data)
      } else {
        const result = res.data
        if (options.str2json.length) {
          options.str2json.forEach(key => {
            result[key] = str2json(result[key])
          })
        }
        return Promise.resolve(result)
      }
    })
    .catch(res => {
      if (loading) {
        uni.hideLoading()
      }
      console.log('queryCatch::', res)
      // err('服务器未响应，请稍后再试。')
      return Promise.reject(res)
    })
}

export default query
