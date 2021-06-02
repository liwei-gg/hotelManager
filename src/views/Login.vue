<template>
  <div class="main" @keyup.enter="submitForm('ruleForm')">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="40"
      shapeType="star"
      :particleSize="4"
      linesColor="#FFFFFF"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <div class="content">
      <div class="login">
        <div class="title">酒店管理系统</div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="40px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="loginPwd">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
            ></el-input> </el-form-item
          ><el-form-item>
            <el-checkbox v-model="ruleForm.checked" class="checkbox"
              >记住我</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { strToMd5 } from "../util/md5";
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

    return {
      ruleForm: {
        //登录名
        loginId: "",
        //登录密码
        loginPwd: "",
        checked: false,
      },
      rules: {
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          let { message, success, token } = await this.$get(
            "/Admin/Login",
            this.ruleForm
          );
          if (success) {
            if (this.ruleForm.checked) {
              localStorage.setItem("loginPwd", this.ruleForm.loginPwd);
            }
            localStorage.setItem("loginId", this.ruleForm.loginId);
            sessionStorage.setItem("token", token);
            this.$setToken();
            this.$router.push("/layout");
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
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #373b44;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .login {
      width: 440px;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 20px;
      .title {
        font-size: 18px;
        color: #fff;
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
