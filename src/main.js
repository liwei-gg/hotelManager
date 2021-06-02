import Vue from "vue";
import App from "../App.vue";
import router from "./router";
import store from "./store";
import "./plugin";
import VueParticles from "vue-particles";
import Blob from "./Excel/Blob";
import Export2Excel from "./Excel/Export2Excel.js";
Vue.use(VueParticles);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
// http://bingjs.com:84/#/layout/adminList
// 接口
// baseURL: "http://bingjs.com:83"
// url                 method        params
// /Admin/Login        get          {loginId,loginPwd}
// /Admin/GetOne       get           {loginId}
// /Admin/GetOne       get           {loginId}
// /Admin/list         get
// /Admin/Delete       post          {id,photo}
// /Admin/Add          post          {loginId}
// /Admin/Update       post          {loginId}
// /Role/list          get
// /Role/GetOne        get           {roleId}
///Role/Delete         post          {roleId}
// /Role/Add           post          {roleName}
// /Role/Update        post          {roleName}
