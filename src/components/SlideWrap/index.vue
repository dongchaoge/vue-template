<template>
  <transition name="dui-slide-wrap" @after-enter="transitionComplete">
    <aside
      :class="{
        'dui-slide-wrap': !fullScreen,
        'dui-slide-wrap-fullscreen': fullScreen
      }"
      :style="slide_style"
      v-if="insedShow"
      ref="slide"
    >
      <slot></slot>
    </aside>
  </transition>
</template>

<script>
import bus from '@bus'

export default {
  name: 'Slidewrap',
  props: {
    parentClass: {
      type: String,
      default: '.index_content'
    },
    value: {
      type: Boolean,
      default: false
    },
    name: {
      type: null,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    callBack: {
      type: Function,
      required: false
    },
    zIndex: {
      type: null
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.zIndex) {
      this.slide_style = `z-index:${this.zIndex}`
    }
    this.insedShow = this.show || this.value
    bus.$on('close_slide_wrap', name => {
      // 给大家说一下，二级页面关闭了
      bus.$emit('changeSecondPage', false)
      console.log('name:::', name, this.name)
      if (this.name === name && this.$refs.slide) {
        this.$emit('close')
        this.insedShow = false
      }
    })
  },
  beforeDestroy () {
    this.$emit('close')
    this.removeNode()
    bus.$off('close_slide_wrap')
    bus.$emit('changeSecondPage', false)
  },
  data () {
    return {
      insedShow: false,
      slide_style: ''
    }
  },
  watch: {
    show (val) {
      this.insedShow = val
    },
    value (val) {
      this.insedShow = val
    },
    insedShow (val) {
      if (val) {
        this.$nextTick(() => {
          if (this.$refs.slide) {
            document.querySelector(this.parentClass).appendChild(this.$refs.slide)
          }
        })
        // ----------
        const slideLength = document.querySelectorAll('.dui-slide-wrap').length
        if (slideLength > 1 && !this.zIndex) {
          this.slide_style = `z-index:${slideLength + 99}`
        }
        // ----------
        // 给大家说一下，二级页面展示出来了
        bus.$emit('changeSecondPage', true)
      } else {
        bus.$emit('changeSecondPage', false)
      }
    }
  },
  methods: {
    transitionComplete () {
      this.$emit('transitionend')
      // 给大家说一下，动画执行完了
      // console.log('slide__slideWrapTransitionend')
      bus.$emit('slideWrapTransitionend', this.name)
    },
    removeNode () {
      if (!this.insedShow) {
        return
      }
      this.insedShow = false
      const parentNode = document.querySelector(this.parentClass)
      if (this.$refs.slide && parentNode && parentNode.hasChildNodes(this.$refs.slide)) {
        parentNode.removeChild(this.$refs.slide)
      }
    }
  }
}
</script>
<style lang="less">
.dui-slide-bg {
  transition: 0.3s ease-out;
}
.dui-slide-bg-in {
  transition: 0.3s ease-out;
  opacity: 0;
  transform: translateX(-30%);
}
.dui-slide-wrap {
  position: absolute;
  // width: 800px
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  background-color: var(--disabled-color-bg);
  z-index: 99;
  opacity: 1;
  // box-shadow: -1px 5px 15px 0 rgba(0, 0, 0, 0.2)
}
.dui-slide-wrap-enter-active,
.dui-slide-wrap-leave-active {
  transition: 0.2s ease-out;
  will-change: transform;
}
.dui-slide-wrap-enter,
.dui-slide-wrap-leave-to {
  transform: translate3d(0, 30%, 0);
  opacity: 0;
}
</style>
