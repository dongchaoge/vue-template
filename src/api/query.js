import axios from 'axios'
import qs from 'qs'
import { API_URL, BASE_URL } from '@utils/config'
import { err } from '@util'
import Cookies from 'js-cookie'
import bus from '@bus'
export default async function (functionName, params = {}, cb, errcb, method = 'post') {
  let contentType = 'json'
  let url = `${API_URL}/${functionName}`
  const isBase = params.isBase
  if (isBase) {
    url = `${BASE_URL}/${functionName}`
    delete params.isBase
  }
  if (params.apiUrl) {
    url = params.apiUrl
    delete params.apiUrl
  }
  const errorBack = !!params.errorBack
  delete params.errorBack
  const noErrorTip = !!params.noErrorTip
  delete params.noErrorTip

  const config = {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }

  if (params.contentType === 'form') {
    config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    contentType = 'form'
    delete params.contentType
  }

  if (Cookies.get('token')) {
    config.headers['X-JWT'] = Cookies.get('token')
  }
  if (Cookies.get('merchantCompanyCode') && !isBase) {
    config.headers.merchantCompanyCode = Cookies.get('merchantCompanyCode')
  }
  if (method === 'get') {
    const body = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    url = `${url}?${body}`
  }

  try {
    let res
    if (method === 'post') {
      if (contentType === 'form') {
        params = qs.stringify(params)
      }
      res = await axios[method](url, params, config)
    } else {
      res = await axios[method](url, config)
    }
    const data = res.data
    if (data.code === 200) {
      if (typeof cb === 'function') {
        cb(data)
      } else {
        return Promise.resolve(data)
      }
    } else {
      // 登出
      if ([-10001, 80000001].includes(res.data.code)) {
        console.log('api loginOut')
        err('为了您的账户安全，请重新登录！')
        setTimeout(() => {
          bus.$emit('loginOut')
        }, 1500)
        return
      }
      if (res.data.state === '501') {
        err('服务器重启中，请稍后')
        return
      }
      if (errorBack) {
        if (typeof cb === 'function') {
          cb(data)
        } else {
          return Promise.resolve(data)
        }
      } else {
        if (!noErrorTip) {
          err(data.msg || '操作失败')
        }
        if (typeof errcb === 'function') {
          errcb(data)
        } else {
          return Promise.reject(data)
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
