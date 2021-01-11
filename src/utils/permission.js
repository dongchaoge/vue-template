// 单个权限
// --方法调用
// this.$auth('sendGoods:add')
// --v-if形式
// <a-button v-if="$auth('sendGoods:add')">Button</a-button>
// --指令形式(template只能使用v-if)
// <a-button v-auth:sendGoods:add>Button</a-button>

// 多个权限
// --交集
// <a-button v-if="$auth('sendGoods:add|takeGoods:add')">Button</a-button>
// --并集
// <a-button v-if="$auth('sendGoods:add&takeGoods:add')">Button</a-button>
import store from '@/store'
export const auth = permissions => {
  // 方法调用、v-if
  return checkPermission(permissions)
}
export const authDirective = {
  // 指令的形式
  inserted (el, binding) {
    // console.log('inserted', binding)
    const hasAuth = checkPermission(binding.arg)
    if (!hasAuth) {
      el.parentNode && el.parentNode.removeChild(el)
      el.style.display = 'none'
    }
  }
}

function checkPermission (permissions) {
  // sendGoods:add|takeGoods:add&takeGoods:edit
  // console.log(permissions)
  return permissions.split('|').reduce((prev, item) => {
    // 先拆分或的 false || permission
    // 再拆分与的 true && permission
    return (
      prev ||
      item.split('&').reduce((prev, current) => {
        return prev && checkSinglePermission(current)
      }, true)
    )
  }, false)
}
// 检验单个权限
function checkSinglePermission (permissions) {
  const [permission, action] = permissions.split(':')
  const permissionMap = store.getters && store.getters.roles
  // 有action的，是判断按钮权限
  if (action) {
    return permissionMap[permission]?.actionList.some(item => {
      return item.router === action
    })
  } else {
    // 没有的，就是菜单(页面)权限
    return !!permissionMap[permission]
  }
}
