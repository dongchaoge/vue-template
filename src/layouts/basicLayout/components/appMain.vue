<!--
 * @Author: monster
 * @Date: 2020-12-07 14:14:11
 * @LastEditors: monster
 * @LastEditTime: 2020-12-18 18:04:06
-->
<template>
  <div class="index_content" :class="{ fullpage: isFullPage }" flex>
    <a-layout-content
      v-if="$store.state.app.isRouterAlive"
      flex="dir:top"
      flex-box="1"
      :class="{
        fullpage: isFullPage,
        over_hide: isSecondPage
      }"
    >
      <router-view />
    </a-layout-content>
  </div>
</template>

<script>
import { Layout, Button } from 'ant-design-vue'
import bus from '@bus'

export default {
  name: 'BasicLayoutAppMain',
  components: {
    [Button.name]: Button,
    [Layout.name]: Layout,
    [Layout.Content.name]: Layout.Content
  },
  data () {
    return {
      // 是否展示了二级页面
      isSecondPage: false
    }
  },
  computed: {
    isFullPage () {
      // 全页面-独立的layout-content
      return this.$route.meta.fullPage
    }
  },
  created () {
    this.init()
    bus.$off('changeSecondPage')
    bus.$on('changeSecondPage', show => {
      this.isSecondPage = show
    })
  },
  methods: {
    init () {}
  }
}
</script>
<style lang="less">
.index_content {
  position: relative;
  &.fullpage {
    margin: 0;
    .dui-slide-wrap {
      // 统计页面下的slide-wrap样式
      background-color: var(--disabled-color-bg);
    }
  }
}
</style>
