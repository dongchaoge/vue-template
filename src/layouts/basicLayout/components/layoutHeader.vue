<template>
  <a-layout-header>
    <div flex="cross:center">
      <div flex-box="1" flex="cross:center">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="toggleSide"
        />
      </div>
      <div class="header-avatar">
        <a-avatar size="large" icon="user" />
        <span class="color-white fs14 ml8">{{ userInfo.name }}</span>
        <a-icon @click="$emit('logout')" type="logout" class="color-white ml24 cursor_p fs18" />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { Icon, Menu, Avatar, Layout, Button } from 'ant-design-vue'
import bus from '@bus'
export default {
  name: 'BasicLayoutHeader',
  components: {
    [Layout.Header.name]: Layout.Header,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Avatar.name]: Avatar
  },
  data () {
    return {}
  },
  computed: {
    collapsed () {
      return this.$store.state.app.sideCollapsed
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {},
  methods: {
    toggleSide () {
      this.$store.commit('app/setSideCollapsed', !this.collapsed)
    },
    go2customDetail (e) {
      bus.$emit('showCustomDetail', e.key)
    }
  }
}
</script>
<style lang="less"></style>
