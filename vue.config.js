const webpack = require('webpack')
const path = require('path')
// 是否为开发环境
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, dir)
}

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    nprogress: 'NProgress'
  },
  // cdn的css链接
  css: ['https://gm-itrade-1255882558.cos.ap-guangzhou.myqcloud.com/nprogress.css'],
  // cdn的js链接
  js: [
    'https://gm-itrade-1255882558.cos.ap-guangzhou.myqcloud.com/nprogress.js',
    'https://imgcdn2.huangjinx.com/public/js/jjh/echarts.common.min.js'
  ]
}
module.exports = {
  publicPath: './',
  indexPath: 'index.html',
  productionSourceMap: !isProd,
  css: {
    loaderOptions: {
      less: {
        sourceMap: !isProd,
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: config => {
    config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/))
    // 用cdn方式引入，则构建时要忽略相关资源
    config.externals = cdn.externals
    // 别名配置
    config.resolve.alias = {
      '@': resolve('src'),
      '@views': resolve('src/views'),
      '@const': resolve('src/utils/const'),
      '@utils': resolve('src/utils'),
      '@util': resolve('src/utils/util'),
      '@js': resolve('src/js'),
      '@api': resolve('src/api'),
      '@config': resolve('src/utils/config'),
      '@bus': resolve('src/utils/bus.js'),
      '@assets': resolve('src/assets'),
      '@image': resolve('src/assets/image'),
      '@components': resolve('src/components')
    }
    // 生产环境相关配置
    if (!isProd) {
      // 代码压缩
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      )
    }
  },

  chainWebpack: config => {
    // 这里需要修改音频文件打包出来的文件名 m开头的文件默认会跳到移动端(nginx配置)
    config.module
      .rule('media')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.name = 'imedia/[name].[hash:8].[ext]'
        return options
      })
    // 打包可视化
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // 注入cdn
    config.plugin('html').tap(args => {
      args[0].cdn = {}
      // cdn css 无论在本地还是生产，都会注入
      if (cdn.css.length) args[0].cdn.css = cdn.css
      // 注入cdn
      args[0].cdn = cdn
      return args
    })
  }
}
