<template>
  <div class="flex">
    <div>
      <el-image
        style="width: 200px; height: 220px"
        :src="BASE_URL_IMG + (admin.photo || 'admin_default.jpg')"
        fit="cover"
      ></el-image>
    </div>
    <div class="text">
      <p>账号：{{ admin.loginId }}</p>
      <p>姓名：{{ admin.name }}</p>
      <p>电话：{{ admin.phone }}</p>
      <p>角色：{{ admin.role.roleName }}</p>
    </div>
  </div>
</template>
<script>
import { BASE_URL_IMG } from "../../config/index.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      BASE_URL_IMG,
    };
  },
  computed: {
    ...mapState("admin", ["admin"]),
  },
};
</script>
<style lang="scss" scoped>
.text {
  margin-left: 20px;
  p {
    line-height: 50px;
  }
}
</style>
