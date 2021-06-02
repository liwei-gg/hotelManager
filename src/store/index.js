import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import theme from "./module/theme";
import admin from "./module/admin";
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    theme,
    admin,
  },
});
