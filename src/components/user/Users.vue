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
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4"></el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-row>
      </div>
      <!--用户列表区域-->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClosed">
      <!--内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--    分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      // 验证邮箱的规则
      const checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      // 验证手机号的规则
      const checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
        if (regMobile.test(value)) {
          // 合法手机号
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条
          pagesize: 10
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '用户名长度在3-10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '密码长度在6-15个字符之间',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            }, {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        //控制分配角色对话框的显示与隐藏
        setRoleDialogVisible: false,
        //需要分配角色的用户信息
        userInfo: {},
        //所有角色的数据列表
        roleList: [],
        //已选中的角色id值
        selectedRoleId: ''
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
      },
      // 监听 pagesize 改变的事件
      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      // 监听页码值改变的事件
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听switch开关状态的改变
      async userStateChanged (userinfo) {
        const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败!')
        }
        this.$message.success('更新用户状态成功')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮，添加用户
      addUser () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          // 可以发起添加用户的网络请求
          const { data: res } = await this.$http.post('users', this.addForm)

          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          // 隐藏对话框
          this.addDialogVisible = false
          // 重新渲染列表
          this.getUserList()
        })
      },
      // 展示编辑用户的对话框
      async showEditDialog (id) {
        const { data: res } = await this.$http.get('users/' + id)

        if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = res.data
        console.log(this.editForm)
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },
      // 监听修改用户对话框的关闭事件
      editUserInfo () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户的数据请求
          const { data: res } = await this.$http.put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 200) {
            console.log(res)
            return this.$message.error('更新用户信息失败！')
          }
          // 隐藏对话框
          this.editDialogVisible = false
          // 重新渲染列表
          this.getUserList()
          this.$message.success('更新用户成功！')
        })
      },
      // 删除用户的对话框事件
      async removeUserById (id) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认了删除，则返回字符串 confirm
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        // 如果用户取消了确认，则返回字符串 cancel
        console.log('确认了删除')
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        this.getUserList()
      },
      //展示分配角色的对话框
      async setRole (userInfo) {
        this.userInfo = userInfo

        //在展示对话框之前获取所有角色的列表
        const { data: res } = await this.$http.get(`roles`)
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }

        this.roleList = res.data
        this.setRoleDialogVisible = true
      },
      async saveRoleInfo () {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }

        const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败！')
        }

        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false
      },
      //监听分配角色对话框的关闭事件
      setRoleDialogClosed(){
        this.selectedRoleId = ''
        this.userInfo = {}
      }
    }
  }
</script>

<style lang="less" scoped></style>
