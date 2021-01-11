<template>
  <a-config-provider :locale="zhCN">
    <div id="app" class="color_text">
      <router-view v-if="ready"></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import bus from '@bus'
export default {
  name: 'App',
  components: {
    [ConfigProvider.name]: ConfigProvider
  },
  data () {
    return {
      zhCN,
      // 等公司配置信息拉取完后再渲染
      ready: false,
      isWindows: !/macintosh|mac os x/i.test(window.navigator.userAgent)
    }
  },
  created () {
    if (this.isWindows) {
      document.body.classList.add('is_windows')
    }
    bus.$off('initApp')
    bus.$on('initApp', () => {
      this.ready = true
    })
  }
}
</script>
<style lang="less">
@scrollBarBg: #212124;
@scrollBarThumbBg: #3d3d42;
.reset-scrollbar() {
  &::-webkit-scrollbar {
    background-color: @scrollBarBg;
  }
  &::-webkit-scrollbar-thumb {
    background-color: @scrollBarThumbBg;
  }
}
.is_windows {
  .dark-ant-wrap {
    ul {
      .reset-scrollbar();
    }
  }
  .ant-layout-sider {
    .reset-scrollbar();
  }
  .ant-layout-content.fullpage {
    .reset-scrollbar();
  }
  .dark-page {
    .reset-scrollbar();
    .over_auto {
      .reset-scrollbar();
    }
    .ant-table-body {
      .reset-scrollbar();
    }
    .ant-table-body-inner {
      .reset-scrollbar();
    }
  }
}
#app {
  min-height: 100vh;
  .trigger {
    color: #fff;
    font-size: 24px;
  }
  .ant-layout-header {
    padding-left: 16px;
  }
  .ant-menu-item {
    margin: 0;
    background: #363638;
  }
  .ant-menu-item-active {
    box-shadow: inset 4px 0 0 0 #363638;
  }
  .ant-menu-item-selected {
    box-shadow: inset 4px 0 0 0 var(--dark-color-primary);
  }
  .header-avatar {
    .ant-avatar {
      background: #000;
    }
  }
  .fav-wrap {
    &.ant-menu-horizontal {
      line-height: 22px;
    }
    .ant-menu-item {
      background: transparent;
      border-color: transparent;
      padding-left: 8px;
      padding-right: 8px;
      margin-right: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      line-height: 22px;
      font-size: 12px;
    }
    .ant-menu-item-selected {
      box-shadow: none;
    }
  }
}
</style>
