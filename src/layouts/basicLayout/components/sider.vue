<template>
  <a-layout-sider class="a-sider" :trigger="null" :collapsed="collapsed" collapsible>
    <img
      @click="gohome"
      class="cursor_p logo-image"
      :src="
        collapsed
          ? $root.companyConfig.FE_M_HOME_LOGO_CLOSE
          : $root.companyConfig.FE_M_HOME_LOGO_OPEN
      "
    />
    <section class="position_r pb52">
      <a-menu
        mode="inline"
        theme="dark"
        v-model="selectedKeys"
        :inline-collapsed="collapsed"
        @click="handleMenuClick"
      >
        <template v-for="(item, index) in menus">
          <a-menu-item v-if="!item.children.length" :key="`/${item.router}`">
            <a-icon :type="item.icon" />
            <span>{{ item.name }}</span>
          </a-menu-item>
          <a-sub-menu v-else :key="'sub' + index">
            <span slot="title">
              <a-icon :type="item.icon" />
              <span>{{ item.name }}</span>
            </span>
            <a-menu-item v-for="subItem in item.children" :key="`/${subItem.router}`">
              {{ subItem.name }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </section>
  </a-layout-sider>
</template>

<script>
import { Layout, Menu, Icon } from 'ant-design-vue'
import bus from '@bus'
export default {
  name: 'BasicLayoutSider',
  components: {
    [Layout.Sider.name]: Layout.Sider,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Icon.name]: Icon
  },
  computed: {
    collapsed () {
      return this.$store.state.app.sideCollapsed
    },
    menus () {
      return this.$store.getters.mainMenu
    }
  },
  data () {
    return {
      selectedKeys: []
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (to) {
        this.selectedKeys = [to.path]
      }
    }
  },
  methods: {
    gohome () {
      bus.$emit('closeAllSlideWrap')
      if (this.$route.name !== 'customerTradeSummary') {
        this.$router.replace('/')
      }
    },
    handleMenuClick ({ key }) {
      // 切换路由时，关闭所有弹层
      bus.$emit('closeAllSlideWrap')
      if (this.$route.path === key) {
        // 这坨是，点击当前路由时，刷新当前页面
        this.$store.state.app.isRouterAlive = false
        this.$nextTick(() => {
          this.$store.state.app.isRouterAlive = true
        })
      } else {
        this.$router.push(key)
      }
    }
  }
}
</script>
<style lang="less">
.logo-image {
  display: block;
  margin: 8px 0 8px 24px;
  height: 48px;
}
</style>
