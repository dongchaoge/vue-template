<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  setup (props) {
    const title = ref('title')
    return {
      title
    }
  }
}
</script>

<style></style>
