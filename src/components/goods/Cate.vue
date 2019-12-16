<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
        <!--表格-->
        <!--分页-->
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{}
    },
    created() {
    },
    methods(){

    }
  }
</script>


<style lang="less" scoped></style>
