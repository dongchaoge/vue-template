<!--
 * @Author: monster
 * @Date: 2020-12-18 17:46:54
 * @LastEditors: monster
 * @LastEditTime: 2020-12-29 20:36:11
-->
<template>
  <div class="page-container" :class="{ full: isFullPage }">
    <a-page-header v-if="!isFullPage" class="page-container_header" ref="header">
      <template slot="tags">
        <a-tag :color="tagColor[state.type]" v-if="state">
          {{ state.text }}
        </a-tag>
      </template>
      <template #title>
        <a-icon v-if="$listeners.back" type="left" @click="$emit('back')" />
        {{ title || $store.state.permission.currentPathName }}
      </template>
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <div
        v-if="$slots.contentTitle || $slots.content"
        class="page-container_header-content"
        flex=""
      >
        <div class="page-container_header-main" flex-box="1">
          <h3 v-if="$slots.contentTitle" class="page-container_header-title">
            <slot name="contentTitle"></slot>
          </h3>
          <div flex="">
            <div v-if="$slots.content" flex-box="1">
              <slot name="content"></slot>
            </div>
            <!-- <div v-if="state" class="page-container_header-extra">
              状态
              <StateTag :type="state.type" size="large" :text="state.text" />
            </div> -->
          </div>
          <div class="position_r">
            <a-alert v-if="tips" :message="tips.message" :type="tips.type" show-icon />
            <div class="page-container_tips-btn">
              <slot name="tipsExtra"></slot>
            </div>
          </div>
        </div>
      </div>
    </a-page-header>
    <div v-if="$slots.total" class="page-container_total">
      <slot name="total"> </slot>
    </div>
    <div v-if="steps && steps.states" class="page-container_steps">
      <StepsTitle v-bind="steps" />
    </div>
    <div class="page-container_children-content">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
import { PageHeader, Icon, Button, Alert, Tag } from 'ant-design-vue'
// import StateTag from '@components/StateTag'
import StepsTitle from '@components/StepsTitle/index.vue'
export default {
  name: 'PageContainer',
  components: {
    // StateTag,
    StepsTitle,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [Alert.name]: Alert,
    [Button.name]: Button,
    [PageHeader.name]: PageHeader
  },
  props: {
    title: String,
    tips: Object,
    isFullPage: Boolean,
    state: Object,
    steps: Object
  },
  created () {
    // console.log(this.$slots)
  },
  data () {
    return {
      tagColor: {
        success: 'green',
        info: 'blue',
        warning: 'orange',
        error: 'red'
      }
    }
  },
  methods: {}
}
</script>
<style lang="less">
.block() {
  background-color: #fff;
  margin: 16px;
  padding: 16px;
}
.page-container {
  min-height: ~'calc(100vh - 64px)';
  background-color: var(--disabled-color-bg);
  &.full {
    background-color: #fff;
    .page-container_children-content {
      margin: 0;
    }
  }
}
.page-container_header {
  background-color: #fff;
  padding: 16px;
}
.page-container_header-title {
  font-size: 20px;
}
// .page-container_header-extra {
//   text-align: right;
// }
.page-container_total {
  .block();
}
.page-container_steps {
  .block();
}
.page-container_children-content {
  .block();
  margin-bottom: 0;
}
.page-container_tips-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
