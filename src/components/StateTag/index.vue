<!--
 * @Author: monster
 * @Date: 2020-09-14 09:39:57
 * @LastEditors: monster
 * @LastEditTime: 2020-12-21 17:38:01
-->
<template>
  <div class="state_tag_container">
    <div flex="cross:center" :class="size">
      <div class="circle mr8" :style="{ background: colorMap[type] }"></div>
      <div :style="{ color: colorMap[type] }">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StateTag',
  props: {
    type: {
      type: String,
      default: 'success'
    },
    text: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      colorMap: {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.state_tag_container {
  .large{
    font-size: 20px;
  }
}
.circle {
  height: 8px;
  width: 8px;
  border-radius: 50%;
}
</style>
