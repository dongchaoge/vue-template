import { str2json } from '@util'
import { basicLayout } from '@/layouts'
// 未找到页面路由
const notFoundRouter = {
  path: '*',
  redirect: '/404'
}
// 动态生成菜单
export const generatorDynamicRouter = routerList => {
  const routers = generatorRouter(routerList)
  // 设置首页为第一个路由页面
  routers.push({
    path: '/',
    name: 'index',
    redirect: routers[0].children[0].path
  })
  // // 这个页面作为那种没有子集菜单的包裹层
  // routers.push({
  //   path: '/independent',
  //   name: 'independent',
  //   component: basicLayout
  // })
  routers.push(notFoundRouter)
  // console.log('routers', routers)
  return routers
}

// 格式化树形结构数据 生成 vue-router 层级路由表
export const generatorRouter = routerList => {
  return routerList.map(item => {
    // 没有配置router的是一级菜单
    const isMenuItem = !item.router
    // item : {
    //   name:路由 - branchOfficeSummary
    //   sn:文件对应的路径 - dashboard/branchOfficeSummary
    // }
    const name = isMenuItem ? item.sn : item.router
    const currentRouter = {
      name,
      path: `/${name}`,
      // '@views/dashboard/branchOfficeSummary'
      component: isMenuItem ? basicLayout : () => import(`@views/${item.sn}`),
      meta: {
        title: item.name,
        ...str2json(item.ext)
      }
    }
    // 是否有子菜单
    if (item.children && item.children.length > 0) {
      currentRouter.children = generatorRouter(item.children)
    }
    return currentRouter
  })
}
