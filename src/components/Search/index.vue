<template>
  <section class="search_page fs14" flex="cross:center wrap:wrap">
    <div class="search_block" v-for="item in list" :key="item.name">
      <span class="search_tit">{{ item.name }}</span>
      <template v-if="item.type === 'input'">
        <a-input
          :allowClear="!item.notAllowClear"
          :class="{'search_item': item.size === 'large', 'search_item_m': !item.size || item.size === 'middle', 'search_item_s': item.size === 'small'}"
          :placeholder="item.placeholder || `请输入${item.name}`"
          v-model="params[item.key]"
        />
      </template>
      <template v-if="item.type === 'select'">
        <a-select
          :show-search="true"
          optionFilterProp="children"
          :class="{'search_item': item.size === 'large', 'search_item_m': !item.size || item.size === 'middle', 'search_item_s': item.size === 'small'}"
          :placeholder="item.placeholder || '请选择'"
          :allowClear="!item.notAllowClear"
          @change="item.onChange"
          v-model="params[item.key]"
        >
          <a-select-option
            v-for="option in item.options"
            :key="option.key"
            :value="option.key"
          >{{option.name}}</a-select-option>
        </a-select>
      </template>

      <template v-if="item.type === 'date'">
        <div :class="{'search_item': item.size === 'large', 'search_item_m': !item.size || item.size === 'middle', 'search_item_s': item.size === 'small'}">
          <a-date-picker
            v-if="item.dateType === 'day'" :disabled-date="item.disabledDate && item.disabledDate" format='YYYY-MM-DD' :allowClear="!item.notAllowClear" v-model="params[item.key]" @change="(date) => {datePickerChange(item.key,date)}" />
          <a-month-picker
            :class="{'search_item': item.size === 'large', 'search_item_m': !item.size || item.size === 'middle', 'search_item_s': item.size === 'small'}"
            v-if="item.dateType === 'month'" :disabled-date="item.disabledDate && item.disabledDate" format='YYYY-MM' :allowClear="!item.notAllowClear" v-model="params[item.key]" @change="(date) => {datePickerChange(item.key,date)}" />
        </div>

      </template>

      <template v-if="item.type === 'dateRange'">
        <a-range-picker flex-box="1" v-model="rangeDate" @change="onDateChange" />
      </template>
    </div>
    <div class="search_block">
      <a-button @click="search" type="primary" class="mr8">搜索</a-button>
      <a-button v-if="showRest" @click="reset">重置</a-button>
    </div>
  </section>
</template>

<script>
import { Button, Select, Input, DatePicker } from 'ant-design-vue'
export default {
  name: 'Search',
  props: {
    // 需要搜索的字段
    list: {
      type: Array,
      default () {
        return []
      }
    },
    // 默认搜索项
    defaultParams: {
      type: Object,
      default () {
        return {}
      }
    },
    // 如果有需要双向绑定的
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    showRest: {
      type: Boolean,
      default: true
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [DatePicker.name]: DatePicker,
    [DatePicker.MonthPicker.name]: DatePicker.MonthPicker,
    [DatePicker.RangePicker.name]: DatePicker.RangePicker
  },
  watch: {
    params (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.params = { ...this.value, ...this.defaultParams }
    this.rangeDate = this.params.defaultDate
  },
  beforeDestroy () {},
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      params: {},
      rangeDate: []
    }
  },
  methods: {
    search () {
      this.$emit('search', this.params)
    },
    reset () {
      this.params = {}
      this.rangeDate = []
      this.$emit('input', {})
      this.$emit('search', {}, true)
    },
    datePickerChange (key, date) {
      this.params[key] = date.format('YYYY-MM-DD')
    },
    onDateChange (date, dateString) {
      this.params.startTime = dateString[0]
      this.params.endTime = dateString[1]
    }
  }
}
</script>
<style lang="less" scoped>
.search_block {
  margin: 0 16px 16px 0;
  display: flex;
  align-items: center;
}
.search_tit {
  display: inline-block;
  width: 4.8em;
  line-height: 1.5;
  height: 1.5em;
  overflow: hidden;
  text-align: justify;
  padding-right: 4px;
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 0;
    overflow: hidden;
  }
}
.search_item {
  width: 240px;
}

.search_item_m {
  width: 180px;
}

.search_item_s{
  width: 120px;
}
</style>
