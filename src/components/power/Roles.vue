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
      <el-table :data="roleList" border stripe>
        <!-- 展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom','vcenter',i1 === 0 ? 'bdtop':'']" v-for="(item1, i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row, item1.id)">{{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级、三级权限-->
              <el-col :span="19">
                <!--通过for循环 嵌套渲染二级权限-->
                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable
                            @close="removeRightById(scope.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3 ,i3) in item2.children" :key="item3.id" closable
                            @close="removeRightById(scope.row, item3.id)"
                            type="warning">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--     分配权限的对话框-->
    <el-dialog @close="setRightDialogClosed" title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!--      树形控件-->
      <el-tree
        node-key="id"
        show-checkbox
        default-expand-all
        ref="treeRef"
        :default-checked-keys="defKeys"
        :props="treeProps"
        :data="rightsList">
      </el-tree>
      <span slot="footer" class="dialog-foot">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button @click="allotRights" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data () {
      return {
        // 所有角色列表数据
        roleList: [],
        // 控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        //所有权限的数据
        rightsList: [],
        //树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        //默认选中的节点的id值
        defKeys: [],
        //当前即将分配权限的角色的id
        roleId: ''
      }
    },
    created () {
      this.getRoleList()
    },
    methods: {
      async getRoleList () {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.roleList = res.data
      },
      //根据id删除对应的权限
      async removeRightById (role, rightId) {
        //提示用户是否要删除
        const confirmResult = await this.$confirm('确认删除该权限吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除!')
        }

        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败!')
        }
        // this.getRoleList() 避免刷新整个列表
        role.children = res.data
      },
      //展示分配权限的对话框
      async showSetRightDialog (role) {
        this.roleId = role.id
        //获取所有权限数据
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        //把获取到的权限数据保存到data中
        this.rightsList = res.data
        //递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys)
        console.log(this.rightsList)
        this.setRightDialogVisible = true
      },
      // 通过递归的形式将三级权限的id拿到赋值到 defKeys 中
      getLeafKeys (node, arr) {
        // 如果当前node节点不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }

        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      //监听分配权限对话框的关闭事件，将 defKey 置空， 不然arr会越积越多
      setRightDialogClosed () {
        this.defKeys = []
      },
      //点击为角色分配权限
      async allotRights () {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')

        const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }

        this.$message.success('分配权限成功！')
        this.getRoleList()
        this.setRightDialogVisible = false
      }
    }
  }
</script>

<style xml:lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
