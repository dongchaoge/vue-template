import COS from 'cos-js-sdk-v5'
import { getTempCredential } from '@api/base'
import Storage from 'good-storage'
import {
  Message
} from 'ant-design-vue'
/* eslint-disable */

const cos = new COS({
  getAuthorization: (options, callback) => {
    getTempCredential({}, res => {
      const credentials = res.data.credentials
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        XCosSecurityToken: credentials.sessionToken,
        ExpiredTime: res.data.expiredTime
      })
    })
  }
})

async function upload (file, key, errCallback) {

  const {bucket,region,urlPrefix} = Storage.get('bucketInfo')

  if(!bucket){
    Message.error('登录已过期，请重新登录。')

    setTimeout(() => {
      bus.$emit('loginOut')
    }, 1500)
    return
  }

  return new Promise((resovle, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: file,
        onProgress: function (data) {

        }
      },
      (err, data) => {
        if (err) {
          reject(err)
        } else {
          resovle(`${urlPrefix}${key}`)
        }
      }
    )
  })
}





export default upload
