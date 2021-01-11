<template>
  <div class="step-title " :class="statusClass">
    <div class="ant-steps-item-title">
      {{ state.processName }}

      <div class="ant-steps-item-subtitle" >
        {{ state.operationName }}

        <span @click="handleBtn" v-if="state.btn && state.btn.text" class="a-link">查看</span>
      </div>
    </div>
    <div class="ant-steps-item-description">{{ state.createTime }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    state: {
      default () {
        return {}
      }
    },
    current: {
      default: 1
    },
    index: {
      default: 0
    }
  },
  data () {
    return {}
  },
  computed: {
    statusClass () {
      let code = this.current > this.index ? 0 : 1
      code = this.current === this.index ? 2 : code

      const map = {
        0: 'finish',
        1: 'wait',
        2: 'active'
      }

      return map[code] || 0
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleBtn () {
      this.state.btn && this.state.btn.onClick()
    }
  }
}
</script>

<style lang="less" scoped>
.step-title {
  position: absolute;
  left: -74px;
  bottom: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-weight: normal;
  font-size: 14px;
  width: 140px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  &.wait{
    .ant-steps-item-title{
      color: rgba(0, 0, 0, 0.45)
    }
  }
  &.active{
    .ant-steps-item-title{
      color: rgba(0, 0, 0, 0.85)
    }
  }
}
</style>
