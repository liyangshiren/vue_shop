//项目发布阶段需要用到的 babel 插件
const prodPlugins = []
//处于产品发布模式
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组 ... 表示把数组展开放到这里
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
