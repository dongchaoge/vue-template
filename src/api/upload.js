import { getTempCredential } from './public'
import { uploadConfig } from '@/utils/config'
import { formatDate, json2str } from '@/utils/util'
const CosAuth = require('@/utils/libs/cos-auth')

const { projectName } = uploadConfig

let bucket = ''
let urlPrefix = ''

export default async function upload (
  res,
  callback,
  errCallback,
  featureName = 'tool-mini'
) {
  // 对更多字符编码的 url encode 格式
  const camSafeUrlEncode = function (str) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
  }

  const getAuthorization = function (options, authCallBack) {
    getTempCredential().then(({ data }) => {
      const { credentials } = data

      bucket = data.bucket
      urlPrefix = data.urlPrefix

      authCallBack({
        XCosSecurityToken: credentials.sessionToken,
        Authorization: CosAuth({
          SecretId: credentials.tmpSecretId,
          SecretKey: credentials.tmpSecretKey,
          Method: options.Method,
          Pathname: options.Pathname
        })
      })
    })
  }

  if (!bucket) {
    await getBucket(errCallback)
  }

  // 当前日期，formatDate函数请自行创建
  const [date, time] = formatDate(new Date(), 'yyyyMMdd hhmmss').split(' ')
  // 6位随机字符串
  const randomStr = Math.random()
    .toString(36)
    .substr(2, 6)

  // 文件后缀名称 文件名不需要encode 因为腾讯会帮你encode一次
  let fileNameArr = ''
  let filePath = ''

  // #ifdef MP-WEIXIN
  filePath = res.tempFiles ? res.tempFiles[0].path : res
  fileNameArr = filePath.split('.')
  // #endif

  const suffix = fileNameArr[fileNameArr.length - 1]
  // 这里指定上传的文件名
  const key = `${projectName}/${featureName}/${date}/${time}${randomStr}.${suffix}`
  // #ifdef MP-WEIXIN
  getAuthorization({ Method: 'POST', Pathname: '/' }, function (AuthData) {
    uni.uploadFile({
      url: urlPrefix,
      name: 'file',
      filePath: filePath,
      formData: {
        key: key,
        success_action_status: 200,
        Signature: AuthData.Authorization,
        'x-cos-security-token': AuthData.XCosSecurityToken,
        'Content-Type': ''
      },
      success: function (res) {
        const url = urlPrefix + camSafeUrlEncode(key).replace(/%2F/g, '/')
        if (res.statusCode === 200) {
          callback(url)
        } else {
          uni.showModal({
            title: '上传失败',
            content: json2str(res),
            showCancel: false
          })
        }
      },
      fail: function (res) {
        uni.showModal({
          title: '上传失败',
          content: json2str(res),
          showCancel: false
        })
      }
    })
  })
  // #endif
}

function getBucket (errCallback) {
  return new Promise((resolve, reject) => {
    getTempCredential()
      .then(({ data }) => {
        bucket = data.bucket
        urlPrefix = data.urlPrefix

        resolve()
      })
      .catch(err => {
        if (errCallback) errCallback(err)
      })
  })
}
