<template>
  <Table ref="table" v-bind="{...$props,...$attrs}" @dataRefresh="refreshData">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
    <template v-for="item in slots" #[item.scopedSlots.customRender]="{ text,record,index }">
      <slot :name="item.scopedSlots.customRender" :text="text" :record="record" :index="index"></slot>
    </template>
    <template v-for="col in editList" #[col]="{ text,record }">
      <div :key="col">
        <template v-if="record.editable">
          <!-- 编辑状态 -->
          <slot :name="`${col}Edit`" :change="handleChange" :text="text" :record="record">
            <!-- :value="record[col]" -->
            <a-input
              :class="{error:record[`${col}Error`]}"
              v-model="record[col]"
            />
            <!-- @change="e => handleChange(e.target.value, record, col)" -->
          </slot>
        </template>
        <template v-else>
          <!-- 展示状态 -->
          <slot :name="col" :text="text" :record="record">{{ record[col] }}</slot>
        </template>
      </div>
    </template>
    <template #action="{ record ,index}">
      <template v-if="!record.hideAction">
        <span v-if="record.editable">
          <a-button @click="() => save(record)" size="small" type="link">保存</a-button>
          <span class="color_divider">|</span>
          <a-popconfirm title="确定放弃修改？" @confirm="() => cancel(record)">
            <a-button size="small" type="link">取消</a-button>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-button
            :disabled="editingKey !== '' || record._disable"
            @click="() => edit(record)"
            size="small"
            type="link"
          >编辑</a-button>
        </span>
      </template>
      <template>
        <slot name="action" :record="record" :index="index"></slot>
      </template>
    </template>
  </Table>
</template>

<script>
import { Button, Popconfirm, Input } from 'ant-design-vue'
import Table from '@components/Table'
export default {
  name: 'EditTable',
  components: {
    Table,
    [Button.name]: Button,
    [Input.name]: Input,
    [Popconfirm.name]: Popconfirm
  },
  props: {
    // 需要编辑的字段列表
    editList: {
      type: Array,
      default () {
        return []
      }
    },
    dataSource: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否显示loading,主要用于判断数据请求完毕
    showLoading: {
      type: Boolean,
      default: false
    },
    // 列表的唯一key
    rowKey: {
      type: String,
      default: '_id'
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    showLoading: {
      immediate: true,
      handler (val) {
        if (!val) {
          // 代表请求数据done
          this.refreshData()
        }
      }
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      // 正在编辑的数据的key
      editingKey: '',
      slots: [],
      cacheData: []
    }
  },
  methods: {
    init () {
      this.initSlots()
    },
    refreshData (data = this.dataSource) {
      this.editingKey = ''
      this.cacheData = data.map(item => ({ ...item }))
    },
    // 初始slot插槽
    initSlots () {
      // 插槽数组 根据clumns 中的 scopedSlots.customRender
      this.slots = this.columns.filter(item => item.scopedSlots)
    },
    emitData (data) {
      this.$emit('dataRefresh', JSON.parse(JSON.stringify(data)))
    },
    handleChange (value, record, column) {
      const newData = [...this.dataSource]
      const key = record[this.rowKey]
      const target = newData.find(item => key === item[this.rowKey])
      if (target) {
        target[column] = value
        this.emitData(newData)
      }
    },
    edit (record) {
      const key = record[this.rowKey]
      const newData = [...this.dataSource]
      const target = newData.find(item => key === item[this.rowKey])
      this.editingKey = key
      if (target) {
        target.editable = true
        this.emitData(newData)
      } else {
        console.warn('editTable::edit-没有找到对应数据')
      }
    },
    save (record) {
      const key = record[this.rowKey]
      const newData = [...this.dataSource]
      const newCacheData = [...this.cacheData]
      const target = newData.find(item => key === item[this.rowKey])
      const targetCache = newCacheData.find(item => key === item[this.rowKey])
      if (target && targetCache) {
        this.$emit('save', target, success => {
          delete target.editable
          this.emitData(newData)
          Object.assign(targetCache, target)
          this.cacheData = newCacheData
          this.editingKey = ''
          this.refreshData()
        })
      } else {
        console.warn('editTable::save-没有找到对应数据')
      }
    },
    cancel (record) {
      const key = record[this.rowKey]
      const newData = [...this.dataSource]
      const target = newData.find(item => key === item[this.rowKey])
      this.editingKey = ''
      if (target) {
        Object.assign(
          target,
          this.cacheData.find(item => key === item[this.rowKey])
        )
        delete target.editable
        this.emitData(newData)
      } else {
        console.warn('editTable::cancel-没有找到对应数据')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ant-input {
  &.error {
    border-color: var(--color-error);
  }
}
</style>
