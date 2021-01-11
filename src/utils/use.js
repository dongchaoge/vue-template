/*
 * @Author: monster
 * @Date: 2020-12-17 11:14:34
 * @LastEditors: monster
 * @LastEditTime: 2020-12-18 17:56:11
 */
import Vue from 'vue'

import { Message, Notification } from 'ant-design-vue'
import { antPortal } from 'ant-design-vue/es/_util/portalDirective'
import antInput from 'ant-design-vue/es/_util/antInputDirective'
import VueViewer from 'v-viewer'

// 权限判断
import { auth, authDirective } from '@utils/permission'
import Upload from '@components/Upload'
import PageContainer from '@components/PageContainer'

// 全局提示
Vue.prototype.$message = Message
// 全局通知
Vue.prototype.$notification = Notification
// 按钮权限判断
Vue.prototype.$auth = auth
Vue.directive('auth', authDirective)
// 全局注册upload组件
Vue.component('Upload', Upload)
// 全局注册layout组件
Vue.component('PageContainer', PageContainer)

antPortal(Vue)
Vue.use(antInput)
// 图片预览插件
Vue.use(VueViewer)
