<template>
  <div class="error" @click="toHome">
    <img src="/img/404/404.png" alt="找不到网页" title="点击返回首页" />
  </div>
</template>
<script>
export default {
  methods: {
    toHome() {
      this.$router.push("/");
    },
  },
};
</script>
<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
