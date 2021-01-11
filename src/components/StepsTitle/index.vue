<template>
  <div>
    <div class="ant-descriptions-title"  v-if="title !== false">{{title}}</div>

    <a-steps :style="{ paddingTop: hasTopInfo ? '78px' : '0' }" :current="current">
      <template slot="progressDot" slot-scope="{ index, status, prefixCls }">
        <StepItemTop :current="current" :index="index" :state="states[index].topInfo" />

        <span :class="`${prefixCls}-icon-dot`" />
      </template>

      <a-step
        v-for="(item, index) in states"
        :key="item.remark + item.processName + index"
        :title="item.processName"
        :subTitle="index !== states.length - 1 ? item.operationName : ''"
        :description="index !== states.length - 1 ? item.createTime : ''"
      >
      </a-step>
    </a-steps>
  </div>
</template>

<script>
import { Icon, Steps } from 'ant-design-vue'
import StepItemTop from './stepItemTop'

export default {
  components: {
    [Icon.name]: Icon,
    [Steps.name]: Steps,
    [Steps.Step.name]: Steps.Step,
    StepItemTop
  },
  name: 'StepsTitle',
  props: {
    title: {
      type: String,
      default: '流程进度'
    },
    state: {
      default: false
    },
    states: {
      type: Array,
      default () {
        return []
      }
    },
    from: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      statesMap: {},
      pricingState: '',
      stepName: ''
    }
  },
  computed: {
    current () {
      const len = this.states.length
      for (let i = len - 1; i >= 0; i--) {
        const item = this.states[i]

        // 如果没有state 使用createTime 寻找当前current
        if (this.state === false) {
          if (item.createTime) {
            return i + 1
          }
        } else {
          if (this.state === Number(item.remark)) {
            return i
          }
        }
      }

      return 0
    },
    hasTopInfo () {
      for (let i = 0, len = this.states.length; i < len; i++) {
        if (this.states[i].topInfo) {
          return true
        }
      }

      return false
    }
  },
  created () {
  },
  mounted () {},
  methods: {

  }
}
</script>

<style lang="less" scoped></style>
