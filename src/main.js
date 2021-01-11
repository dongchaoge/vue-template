import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Storage from 'good-storage'
import '@/styles/app.less'
// 图片预览用到的css
import 'viewerjs/dist/viewer.css'
// 权限
import './permission'
// 一些需要挂在实例上的方法注册
import '@utils/use'
import Cookies from 'js-cookie'

import { err } from '@util'
import { getCompanyConfig } from '@api/base'
import bus from '@bus'
const isDev = process.env.VUE_APP_NODE_ENV === 'dev'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    this.initConfig()
  },
  data () {
    return {
      companyCode: '',
      companyConfig: Storage.get('companyConfig') || {}
    }
  },
  methods: {
    initConfig () {
      getCompanyConfig({
        domainFlag: isDev ? '2278936549995520' : location.host.split('-')[0]
      })
        .then(({ data }) => {
          this.companyCode = data[0]?.merchantCompanyCode
          const transformTrue = str => {
            if (str === 'true') {
              return true
            }
            if (str === 'false') {
              return false
            }
            return str
          }
          const config = {}
          data.forEach(item => {
            config[item.configKey] = transformTrue(item.configValue)
          })
          this.companyConfig = config
          window.companyConfig = Object.freeze(config)
          Storage.set('companyConfig', config)
          Cookies.set('merchantCompanyCode', this.companyCode, { expires: 30 })
          bus.$emit('initApp')
          // 去掉Loading
          document.querySelector('.app-loading').classList.add('close')
          this.initTitle()
        })
        .catch(() => {
          err('公司信息获取失败，请稍后再试')
          setTimeout(() => {
            location.reload()
          }, 10000)
        })
    },
    initTitle () {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = this.companyConfig.FE_H_BASE_TITLE_LOGO
      document.head.appendChild(link)
      document.title = this.companyConfig.FE_H_BASE_NAME
    }
  }
}).$mount('#app')
