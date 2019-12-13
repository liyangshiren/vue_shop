<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区-->
    </el-card>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        // 所有角色列表数据
        roleList: []
      }
    },
    created() {
      this.getRoleList()
    },
    methods: {
      async getRoleList() {
        const { data: res } = await this.$http.get('roles')
        if(res.meta.status !== 200){
          return this.$message.error('获取角色列表失败！')
        }
        this.roleList = res.data
        console.log(res.data)
      }
    }


  }
</script>

<style xml:lang="less" scoped></style>
