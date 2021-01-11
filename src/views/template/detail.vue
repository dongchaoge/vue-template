<template>
  <div class="x_detail_page h100" flex="dir:top">
    <h1 class="page-title_inset" flex="cross:center main:justify">
      <div flex="cross:center">
        <a-icon type="left" @click="$emit('back')" />
        <span>x详情</span>
        <StateTag
          class="ml16"
          :type="stateTagType[detail.state]"
          :text="stateType[detail.state]"
        />
      </div>
      <div>
        <a-button class="mr8" @click="handleApprove('reject')"
          >关闭申请</a-button
        >
        <a-button @click="handleApprove('approve')" type="primary"
          >确认</a-button
        >
      </div>
    </h1>
    <section class="bg_white pw24 over_auto" flex-box="1">
      <a-descriptions
        title="申请信息"
        layout="vertical"
        bordered
        :column="{ lg: 3, md: 2 }"
      >
        <a-descriptions-item label="流水号">{{
          detail.assetRecordCode
        }}</a-descriptions-item>
        <a-descriptions-item label="金额(元)">{{
          detail.changeBalance | milliFormat
        }}</a-descriptions-item>
        <a-descriptions-item label="凭证">
          <Upload :upload="false" :value="transformImg(detail.voucher)"/>
          <viewer>
            <img
              v-for="src in transformImg(detail.voucher)"
              :key="src"
              class="voucher"
              :src="src"
              alt
            />
          </viewer>
        </a-descriptions-item>
        <a-descriptions-item label="备注">{{
          detail.remark
        }}</a-descriptions-item>
      </a-descriptions>
    </section>
  </div>
</template>

<script>
import { Icon, Button, Descriptions } from 'ant-design-vue'
import { stateType, stateTagType, stateTypeCode } from '@const'
import { transformImg } from '@util'
import StateTag from '@components/StateTag'
export default {
  name: 'AssetsFundsDetail',
  components: {
    StateTag,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Descriptions.name]: Descriptions,
    [Descriptions.Item.name]: Descriptions.Item
  },
  created () {
    this.init()
  },
  beforeDestroy () {},
  data () {
    return {
      stateType,
      stateTypeCode,
      stateTagType,
      transformImg,
      detail: {}
    }
  },
  methods: {
    init () {},
    handleApprove (type) {
      if (type === 'reject') {
        this.$emit('reject')
      } else {
        this.$emit('approve')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.x_detail_page {
  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    margin: 0 4px 4px 0;
    cursor: pointer;
    border: 1px solid var(--divider-color);
  }
}
</style>
