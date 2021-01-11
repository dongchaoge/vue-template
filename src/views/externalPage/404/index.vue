<template>
  <a-result status="404" title="未找到页面" sub-title="无权限访问该页面，请返回首页或联系管理员">
    <template #extra>
      <a-button @click="$router.replace('/')" type="primary">
        回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
import { Result, Button } from 'ant-design-vue'
export default {
  name: 'BasicLayoutAppMain',
  components: {
    [Button.name]: Button,
    [Result.name]: Result
  }
}
</script>
