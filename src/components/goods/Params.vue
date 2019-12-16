<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--警告区域-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning" :closable="false" show-icon>
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="first">
          <!--添加动态参数的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="second">
          <!--添加静态属性的按钮-->
          <el-button type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //商品分类列表
        catelist: [],
        //级联选择框双向数据绑定
        selectedCateKeys: [],
        //被激活的页签的名称
        activeName: 'second'
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取所有的商品分类
      async getCateList() {
        const { data: res } = await this.$http.get(`categories`)
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类失败！')
        }

        this.catelist = res.data
      },
      //级联选择框选中项变化，会触发这个函数
      handleChange() {
        //证明选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          return
        }

        //证明选中的是三级分类
        console.log(this.selectedCateKeys)
      },
      // tab 页签点击事件的处理函数
      handleTabClick() {
        console.log(this.activeName)
      }
    },
    computed: {
      //如果按钮需要被禁用，则返回true，否则返回false
      isBtnDisable(){
        if(this.selectedCateKeys.length !==3){
          return true
        }
        return false
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0px;
  }
</style>
