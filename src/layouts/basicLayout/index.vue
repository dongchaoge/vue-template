<template>
  <div class="layout_page">
    <a-layout>
      <Sider :collapsed="collapsed" />
      <a-layout style="overflow: hidden; position: relative;height:100vh;">
        <Header @logout="logout" />
        <AppMain flex-box="1" />
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { Layout } from 'ant-design-vue'
import bus from '@bus'
import { getTempCredential } from '@api/base'

import Sider from './components/sider'
import Header from './components/layoutHeader'
import AppMain from './components/appMain'
import Storage from 'good-storage'
export default {
  name: 'BasicLayout',
  components: {
    Sider,
    Header,
    AppMain,
    [Layout.name]: Layout,
    [Layout.Content.name]: Layout.Content
  },
  data () {
    return {
      collapsed: false
    }
  },

  created () {
    this.initBus()
    this.init()
  },
  methods: {
    init () {
      // 获取储存桶
      this.getTempCredential()
    },
    initBus () {
      bus.$on('loginOut', () => {
        this.logout()
      })
    },
    getTempCredential () {
      // 拿储桶信息
      getTempCredential({}, res => {
        Storage.set('bucketInfo', res.data)
      })
    },
    logout () {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
<style lang="less"></style>
