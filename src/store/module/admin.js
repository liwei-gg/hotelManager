export default {
  namespaced: true,
  state: {
    admin: {
      role: {},
    },
  },
  mutations: {
    setAdmin(state, value) {
      state.admin = value;
    },
  },
};
