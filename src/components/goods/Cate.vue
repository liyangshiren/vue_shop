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
          <el-button style="margin-bottom: 15px" type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
        <!--表格-->
        <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
                    show-index index-text="#" border>
          <!-- 是否有效-->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
          <!-- 排序-->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!--          操作-->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-search" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--分页-->
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryInfo.pagenum"
                       :page-sizes="[3,5,10,15]"
                       :page-size="queryInfo.pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </el-row>
    </el-card>

    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @close="addCateDialogClosed">
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules"
               ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options 用来指定数据源-->
          <!--props 用来指定配置对象-->
          <el-cascader
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //商品分类的数据列表，默认为空
        catelist: [],
        //总数据条数
        total: 0,
        //为 table 指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          }, {
            label: '是否有效',
            //表示，将当前列定义为模板列
            type: 'template',
            //表示，将当前列使用的模板名称
            template: 'isok'
          }, {
            label: '排序',
            //表示，将当前列定义为模板列
            type: 'template',
            //表示，将当前列使用的模板名称
            template: 'order'
          }, {
            label: '操作',
            //表示，将当前列定义为模板列
            type: 'template',
            //表示，将当前列使用的模板名称
            template: 'opt'
          }
        ],
        //控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        //添加分类的表单数据对象
        addCateForm: {
          //将要添加的分类的名称
          cat_name: '',
          //父级分类id
          cat_pid: 0,
          //分类的登记，默认要添加的是一级分类
          cat_level: 0
        },
        //添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        //父级分类的列表
        parentCateList: [],
        //选中的父级分类的Id数组
        selectedKeys: []

      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取商品分类数据
      async getCateList() {
        const { data: res } = await this.$http.get(`categories`, { params: this.queryInfo })

        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        //把数据列表，赋值给 catelist
        this.catelist = res.data.result
        //为总数据条数赋值
        this.total = res.data.total
      },
      //监听 pageSize 改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听，pageNum 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击显示添加商品分类对话框
      showAddCateDialog() {
        // 获取父级分类的数据礼拜
        this.getParentCateList()
        // 展示出对话框
        this.addCateDialogVisible = true
      },
      //获取父级分类的数据列表
      async getParentCateList() {
        const { data: res } = await this.$http.get(`categories`, { params: { type: 2 } })

        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败！')
        }

        console.log(res.data)
        this.parentCateList = res.data
      },
      //选择项发生变化触发这个函数
      parentCateChanged() {
        //如果 selectedKeys 数组中的 length 大于 0，证明选中了父级分类
        //反之，就说明没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          //为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0
          //为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      //点击按钮，添加新的分类
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post(`categories`, this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
      },
      //监听对话框的关闭事件，重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    }
  }
</script>


<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>
