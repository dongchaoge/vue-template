<template>
  <div class="template_page flex1" flex="dir:top">
    <h1 class="page-title" flex="cross:center main:justify">
      <span>template管理</span>
      <a-button type="primary" @click="go2add" icon="plus">新增template</a-button>
    </h1>
    <div>
      <Search
        @search="handleSearch"
        :list="searchList"
        v-model="searchParams"
      />
      <StateFilter title="状态" @click="handleFilter" :list="statusList" />
    </div>
    <Table
      ref="table"
      :columns="columns"
      :scrollX="1000"
      :params="listParams"
    >
      <template #action="{ record }" @click.stop>
        <a-button @click.stop="go2detail(record)" size="small" type="link"
          >详情</a-button
        >
      </template>
    </Table>
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import Table from '@components/Table'
import Search from '@components/Search'
import StateFilter from '@components/StateFilter'
import bus from '@bus'
export default {
  name: 'Template',
  components: {
    Table,
    Search,
    StateFilter,
    [Button.name]: Button
  },
  created () {},
  beforeDestroy () {},
  data () {
    const columns = [
      {
        title: '流水号',
        dataIndex: 'assetRecordCode',
        width: 160
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
        width: 160
      },
      {
        title: '操作',
        width: 140,
        align: 'center',
        fixed: 'right',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns,
      statusList: [
        {
          text: '待确认',
          key: 'ing'
        },
        {
          text: '已完成',
          key: 'done-reject'
        }
      ],
      searchList: [
        {
          name: '流水号',
          type: 'input',
          placeholder: '请输入流水号',
          key: 'assetRecordCode'
        },
        {
          name: '类型',
          type: 'select',
          size: 'small',
          key: 'tradeType',
          options: [
            {
              key: 'moneyIn',
              name: '收款'
            },
            {
              key: 'moneyOut',
              name: '付款'
            }
          ]
        },
        {
          name: '申请时间',
          type: 'dateRange'
        }
      ],
      searchParams: {},
      filterParams: {},
      listParams: {}
    }
  },
  methods: {
    init () {},
    refresh () {
      this.$refs.table.refreshQuery()
    },
    go2add () {
      bus.$emit('showQuickModule', {
        // 模块名称-对应组件name，可在QuickModule组件内查看
        name: 'AssetsFundsAdd'
      }, () => {
        this.refresh()
      })
    },
    go2detail (item) {
      bus.$emit('showQuickModule', {
        // 模块名称-对应组件name，可在QuickModule组件内查看
        name: 'AssetsFundsDetail',
        // 模块内需要使用的参数
        props: {
          assetRecordCode: item.assetRecordCode
        }
      }, () => {
        this.refresh()
      })
    },
    handleSearch () {
      this.listParams = Object.assign({}, this.filterParams, this.searchParams)
    },
    handleFilter (key) {
      this.filterParams = {
        key
      }
      this.listParams = Object.assign({}, this.searchParams, this.filterParams)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
