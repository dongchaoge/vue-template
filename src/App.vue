<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="less">
/*每个页面公共css */
@import url('tailwindcss/tailwind.css');
@import url('@/style/common.less');
@import url('@/style/app.less');
</style>
