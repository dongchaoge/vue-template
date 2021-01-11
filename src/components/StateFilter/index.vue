<template>
  <div class="state_filter fs14 mb16" flex="cross:center">
    <span class="pl0 state_filter_tit">{{ title }}</span>
    <ul flex>
      <li v-if="all" class="state_filter_item" :class="{active:active === 'all'}" @click="handleClick('all')">全部</li>
      <li
        class="state_filter_item"
        :class="{active:active === item.key}"
        v-for="item in list"
        :key="item.key"
        @click="handleClick(item.key)"
      >{{ item.text }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'StateFilter',
  components: {},
  created () {
    if (this.all === false) {
      this.active = this.list[0].key
    }
  },
  props: {
    // 是否显示全部选择
    all: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '筛选'
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      active: 'all'
    }
  },
  methods: {
    handleClick (key) {
      this.active = key
      this.$emit('click', key)
    }
  }
}
</script>

<style lang="less" scoped>
.state_filter_item {
  padding: 4px 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:all .3s;
  &.active {
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 3px;
  }
}
.state_filter_tit {
  display: inline-block;
  width: 4.8em;
  line-height: 1.5;
  height: 1.5em;
  overflow: hidden;
  text-align: justify;
  padding-right: 8px;
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 0;
    overflow: hidden;
  }
}
</style>
