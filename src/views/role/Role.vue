<template>
  <div>
    <div style="padding:0 10px">
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加账号</el-button
      >
    </div>

    <el-drawer
      :title="isAdd ? '添加角色' : '修改角色'"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div style="padding:0 10px">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          size="mini"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="角色编号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success">设置权限</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            type="warning"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      drawer: false,
      isAdd: true,
      direction: "rtl",
      ruleForm: {
        roleName: "",
      },
      rules: {
        roleName: [{ validator: validateRoleName, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // addRole(){
    //   this.$post('/')
    // },
    async getTableData() {
      let res = await this.$get("/Role/list");
      this.tableData = res;
    },
    async handleEdit(index, row) {
      let roleId = row.roleId;
      let res = await this.$get("/Role/GetOne", { roleId });
      this.ruleForm = res;
      this.isAdd = false;
      this.drawer = true;
    },
    async handleDelete(index, row) {
      await this.$confirm("是否确认删除？");
      let roleId = row.roleId;
      let { success, message } = await this.$post("/Role/Delete", { roleId });
      if (success) {
        this.$msg_s(message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        this.$msg_e(message);
        return false;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.resetForm("ruleForm");
          this.isAdd = true;
          done();
        })
        .catch((_) => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isAdd) {
            let { success, message } = await this.$post(
              "/Role/Add",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$msg_e(message);
            }
          } else {
            let { success, message } = await this.$post(
              "/Role/Update",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$msg_e(message);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm = {
        roleName: "",
      };
    },
  },
};
</script>
