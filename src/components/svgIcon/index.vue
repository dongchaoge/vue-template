<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
import '@assets/svgs'
export default {
  name: 'svg-icon',
  props: {
    color: {
      // 此属性为更改svg颜色属性设置
      default: 'var(--text-color-headline)',
      type: String,
      required: false
    },
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    }
  }
}
</script>

<style lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
