<template>
  <a-modal
    title="新增xxx"
    :destroyOnClose="true"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="close"
    okText="提交"
    :confirm-loading="queryLoading"
  >
  </a-modal>
</template>
<script>
import { Button, Modal, Form } from 'ant-design-vue'
export default {
  name: 'xxxAdd',
  components: {
    [Button.name]: Button,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Modal.name]: Modal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        if (val) {
          this.init()
        }
      }
    }
  },
  data () {
    return {
      // 请求时显示loading
      queryLoading: false,
      // 请求时和关闭前，禁止请求
      queryReady: true
    }
  },
  methods: {
    init () {},
    close () {},
    handleSubmit () {}
  }
}
</script>

<style lang="less">

</style>
