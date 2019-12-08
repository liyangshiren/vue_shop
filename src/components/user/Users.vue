<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索与添加区-->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"></el-col>
          <el-button type="primary">添加用户</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //获取用户列表的参数对象
        queryInfo: {
          query: '',
          pagenum: '1',
          pagesize: '10'
        },
        userList:[],
        total:0
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      async getUserList () {
        const { data: res } = await this.$http.get('users', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
        this.userList = res.data.users
        this.total = res.data.total
        console.log(res)
      }
    }
  }
</script>

<style lang="less" scoped></style>
