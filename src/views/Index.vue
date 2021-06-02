<template>
  <div></div>
</template>
<script>
export default {
  async created() {
    let loginId = localStorage.getItem("loginId");
    let loginPwd = localStorage.getItem("loginPwd");
    if (!loginId || !loginPwd) {
      this.$router.push("/login");
    } else {
      let { success, token } = await this.$get("/Admin/Login", {
        loginId,
        loginPwd,
      });
      if (success) {
        sessionStorage.setItem("token", token);
        this.$setToken();
        this.$router.push("/layout");
      } else {
        this.$router.push("/login");
      }
    }
  },
};
</script>
