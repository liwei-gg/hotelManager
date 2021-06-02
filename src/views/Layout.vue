<template>
  <div class="main">
    <!-- 左侧导航栏 -->
    <div
      class="left"
      :style="{
        backgroundColor: themeColor,
        width: isCollapse ? 'auto' : '200px',
      }"
    >
      <div class="logo">Hotel</div>
      <el-menu
        :collapse="isCollapse"
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/role" v-if="admin.roleId === 1"
              >角色管理</el-menu-item
            >
            <el-menu-item index="/layout/admin">账号管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>客房管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/roomType" v-if="admin.roleId === 1"
              >类型管理</el-menu-item
            >
            <el-menu-item index="/layout/room">客房管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/guest">客户管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4" v-if="admin.roleId === 1">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/layout/permission">权限管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <!-- end 左侧导航栏 -->
    <!-- 右侧部分 -->
    <div class="right">
      <!-- 右侧导航栏 -->
      <div class="nav" :style="{ backgroundColor: themeColor }">
        <!-- 右侧折叠图 -->
        <div class="collapse" @click="isCollapse = !isCollapse">
          <i v-show="!isCollapse" class="el-icon-s-fold"></i>
          <i v-show="isCollapse" class="el-icon-s-unfold"></i>
        </div>
        <!-- end 右侧折叠图 -->
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          :background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/layout"
            ><i class="el-icon-s-home"></i>Home</el-menu-item
          >
          <el-menu-item index="/layout/message"
            ><i
              class="el-icon-chat-line-round
"
            ></i
            >Message</el-menu-item
          >
          <el-menu-item index="/layout/email"
            ><i class="el-icon-message"></i>Email</el-menu-item
          >
          <el-submenu index="4">
            <template slot="title"
              ><i class="el-icon-bangzhu"></i>Theme</template
            >
            <el-menu-item
              @click="changeTheme(item.value)"
              v-for="(item, index) in theme"
              :key="index"
              >{{ item.name }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"
              ><i class="el-icon-user-solid"></i>{{ admin.name }}</template
            >
            <el-menu-item index="/layout/profile">个人中心</el-menu-item>
            <el-menu-item index="/layout/modifyPwd">修改密码</el-menu-item>
            <el-menu-item @click="exit">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- end 右侧导航栏 -->
      <!-- 右侧内容主体 -->
      <div class="content">
        <router-view></router-view>
      </div>
      <!-- end 右侧内容主体 -->
    </div>
    <!-- end 右侧部分 -->
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeIndex2: "1",
      themeColor: localStorage.getItem("theme") || "#144a74",
      isCollapse: false,
    };
  },
  computed: {
    ...mapState("theme", ["theme"]),
    ...mapState("admin", ["admin"]),
  },
  async created() {
    let loginId = localStorage.getItem("loginId");
    if (!loginId) {
      this.$router.push("/login");
    }
    let res = await this.$get("/Admin/GetOne", { loginId });
    this.setAdmin(res);
    localStorage.setItem("roleId", res.roleId);
  },
  methods: {
    ...mapMutations("admin", ["setAdmin"]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    changeTheme(color) {
      this.themeColor = color;
      localStorage.setItem("theme", color);
    },
    exit() {
      sessionStorage.clear();
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  width: 100vw;
  height: 100vh;
  .left {
    width: 200px;
    .logo {
      width: 90%;
      padding: 10px 0;
      margin: 10px auto;
      text-align: center;
      border: 1px solid #fff;
      color: #fff;
      font-size: 18px;
    }
  }
  .right {
    flex: 1;
    .nav {
      display: flex;
      height: 65px;
      justify-content: space-between;
      align-items: center;
      .collapse i {
        margin-left: 5px;
        font-size: 20px;
        color: #fff;
      }
    }
    .content {
      padding: 5px;
    }
  }
}
</style>
