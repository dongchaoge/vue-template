export function go2 (src, params = {}, checkLogin) {
  if (checkLogin) {
    const token = uni.getStorageSync('X-JWT')
    if (!token) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
  }

  let paramsStr = ''
  const keys = Object.keys(params)
  const { length } = keys
  if (length) {
    paramsStr = '?'
    keys.forEach((key, index) => {
      paramsStr += `${key}=${params[key]}${index < length ? '&' : ''}`
    })
  }
  uni.navigateTo({
    url: `/${src}/index${paramsStr}`
  })
}

// 处理路由传参
export function transformQuery (data) {
  // 转换Boolean
  const transformTrue = str => {
    if (str === 'true') {
      return true
    }
    if (str === 'false') {
      return false
    }
    return str
  }
  const result = {}

  Object.keys(data).forEach(key => {
    result[key] = transformTrue(data[key])
  })
  return result
}

export function callPhone (phone) {
  uni.makePhoneCall({
    phoneNumber: phone // 仅为示例
  })
}

// 导航
export function openLocation ({ latitude, longitude, name }) {
  uni.openLocation({
    name,
    latitude: +latitude,
    longitude: +longitude,
    success: function () {
      console.log('success')
    },
    fail (err) {
      console.log(err)
    }
  })
}
// 图片预览
export function previewImage (current, urls = [current]) {
  uni.previewImage({
    urls,
    current,
    longPressActions: {
      itemList: ['发送给朋友', '保存图片', '收藏']
    }
  })
}
