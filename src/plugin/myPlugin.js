import Vue from "vue";
import { get, post, setToken } from "../util/request";
export default {
  //插件中必须包含一个install方法
  install: function(vue) {
    Vue.mixin({
      methods: {
        $get(url, params) {
          return get(url, params);
        },
        $post(url, params) {
          return post(url, params);
        },
        $setToken() {
          setToken();
        },
        $msg_e(message, duration) {
          this.$message({
            message,
            type: "error",
            showClose: true,
          });
        },
        $msg_s(message, duration) {
          this.$message({
            message,
            type: "success",
            showClose: true,
          });
        },
      },
    });
  },
};
