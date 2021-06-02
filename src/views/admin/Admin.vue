<template>
  <div>
    <!-- 搜索添加账号 -->
    <div class="flex a-c" style="margin:5px">
      <span style="font-size:12px">角色：</span>
      <el-select
        v-model="roleId"
        placeholder="请选择角色"
        clearable
        size="mini"
        style="margin-right:10px"
      >
        <el-option
          v-for="item in roleListToSearch"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="getTableData"
        >搜索</el-button
      >
      <el-button type="primary" size="mini" @click="drawer = true"
        >添加账号</el-button
      >
    </div>
    <!-- 账号列表数据 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="编号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.loginId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="BASE_URL_IMG + (scope.row.photo || 'admin_default.jpg')"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.role.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
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
    <!-- 分页 -->
    <div class="flex j-c" style="margin-top:5px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        page-size="8"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 抽屉 -->
    <el-drawer
      :title="isAdd ? '添加账号' : '修改账号'"
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
          <el-form-item label="头像" prop="photo">
            <el-upload
              class="avatar-uploader"
              :action="Upload_URL_IMG"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.photo"
                :src="BASE_URL_IMG + ruleForm.photo"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="loginPwd" v-if="isAdd">
            <el-input
              v-model="ruleForm.loginPwd"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="loginPwd2" v-if="isAdd">
            <el-input
              v-model="ruleForm.loginPwd2"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="ruleForm.roleId"
              placeholder="请选择角色"
              clearable
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
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
  </div>
</template>
<script>
import { BASE_URL_IMG, Upload_URL_IMG } from "../../config/index";
import { strToMd5 } from "../../util/md5";
export default {
  data() {
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.loginPwd) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入电话"));
      } else {
        callback();
      }
    };
    var validateRoleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      pageIndex: 1,
      roleId: "",
      count: 0,
      BASE_URL_IMG,
      Upload_URL_IMG,
      tableData: [],
      roleList: [],
      roleListToSearch: [],
      drawer: false,
      isAdd: true,
      direction: "rtl",
      ruleForm: {
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        roleId: "",
        photo: "",
      },
      rules: {
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roleId: [{ validator: validateRoleId, trigger: "change" }],
      },
    };
  },
  created() {
    this.getTableData();
    this.getRoleList();
  },
  methods: {
    // addRole(){
    //   this.$post('/')
    // },
    currentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    async getTableData() {
      let { data, count } = await this.$get("/Admin/list", {
        roleId: this.roleId || 0,
        pageIndex: this.pageIndex,
        pageSize: 8,
      });
      this.tableData = data;
      this.count = count;
    },
    async getRoleList() {
      let res = await this.$get("/Role/list");
      this.roleList = res;
      this.roleListToSearch = res;
    },
    async handleEdit(index, row) {
      let loginId = row.loginId;
      let res = await this.$get("/Admin/GetOne", { loginId });
      this.ruleForm = res;
      this.isAdd = false;
      this.drawer = true;
    },
    async handleDelete(index, row) {
      console.log(row);
      await this.$confirm("是否确认删除？");
      let id = row.id;
      let photo = row.photo;
      // let res = await this.$post("/Admin/Delete", { loginId });
      // console.log(res);
      let { success, message } = await this.$post("/Admin/Delete", {
        id,
        photo,
      });
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
            this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
            this.ruleForm.loginPwd2 = strToMd5(this.ruleForm.loginPwd2);
            let { success, message } = await this.$post(
              "/Admin/Add",
              this.ruleForm
            );
            if (success) {
              this.$msg_s(message);
              this.getTableData();
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              this.$msg_e(message);
            }
          } else {
            let { success, message } = await this.$post(
              "/Admin/Update",
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
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        roleId: "",
        photo: "",
      };
    },
    handleAvatarSuccess(res) {
      let { success, filename, message } = res;
      if (success) {
        this.ruleForm.photo = filename;
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },
    beforeAvatarUpload(file) {
      const img_type_list = ["image/jpeg", "image/png", "image/gif"];
      const isValid = img_type_list.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isValid) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isValid && isLt2M;
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
