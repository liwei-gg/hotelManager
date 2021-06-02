<template>
  <div style="padding:0 10px;width:500px">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      size="mini"
    >
      <el-form-item label="原始密码" prop="oldLoginPwd">
        <el-input
          v-model="ruleForm.oldLoginPwd"
          autocomplete="off"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newLoginPwd">
        <el-input
          v-model="ruleForm.newLoginPwd"
          autocomplete="off"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="loginPwd2">
        <el-input
          v-model="ruleForm.loginPwd2"
          autocomplete="off"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >修改
        </el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import { mapState } from "vuex";
import { strToMd5 } from "../../util/md5";
export default {
  data() {
    var validateOldLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateNewLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if (value !== this.ruleForm.newLoginPwd) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        id: this.$store.state.admin.admin.id,
        oldLoginPwd: "",
        newLoginPwd: "",
        loginPwd2: "",
      },
      rules: {
        oldLoginPwd: [{ validator: validateOldLoginPwd, trigger: "blur" }],
        newLoginPwd: [{ validator: validateNewLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
      },
    };
  },
  // computed: {
  //   ...mapState("admin", ["admin"]),
  // },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
          this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
          let { success, message } = await this.$post(
            "/Admin/ResetPwd",
            this.ruleForm
          );
          if (success) {
            this.$msg_s(message);
            this.resetForm("ruleForm");
          } else {
            this.$msg_e(message);
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
        id: this.admin.id,
        oldLoginPwd: "",
        newLoginPwd: "",
        loginPwd2: "",
      };
    },
  },
};
</script>
