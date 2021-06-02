import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    meta: { title: "酒店管理系统" },
    component: () => import("../views/Index"),
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "酒店系统登陆" },
    component: () => import("../views/Login"),
  },
  {
    path: "/layout",
    name: "Layout",
    meta: { title: "酒店管理系统" },
    component: () => import("../views/Layout"),
    meta: {
      isAuthRequired: true,
    },
    children: [
      {
        path: "role",
        meta: { title: "角色管理", permission: [1] },
        component: () => import("../views/role/Role.vue"),
      },
      {
        path: "admin",
        meta: { title: "账号管理" },
        component: () => import("../views/admin/Admin.vue"),
      },
      {
        path: "roomType",
        meta: { title: "类型管理", permission: [1] },
        component: () => import("../views/roomType/RoomType.vue"),
      },
      {
        path: "room",
        meta: { title: "客房管理" },
        component: () => import("../views/room/Room.vue"),
      },
      {
        path: "guest",
        meta: { title: "客户管理" },
        component: () => import("../views/guest/Guest.vue"),
      },
      {
        path: "permission",
        meta: { title: "权限管理", permission: [1] },
        component: () => import("../views/permission/Permission.vue"),
      },
      {
        path: "",
        meta: { title: "酒店管理系统" },
        component: () => import("../views/user/Home.vue"),
      },
      {
        path: "message",
        meta: { title: "系统消息" },
        component: () => import("../views/user/Message.vue"),
      },
      {
        path: "email",
        meta: { title: "电子邮件" },
        component: () => import("../views/user/Email.vue"),
      },
      {
        path: "profile",
        meta: { title: "个人中心" },
        component: () => import("../views/user/Profile.vue"),
      },
      {
        path: "modifyPwd",
        meta: { title: "修改密码" },
        component: () => import("../views/user/ModifyPwd.vue"),
      },
    ],
  },
  {
    path: "*",
    name: "Error404",
    component: () => import("../views/Error404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  NProgress.start();
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta && to.meta.permission) {
    if (to.meta.permission.includes(localStorage.getItem("roleId"))) {
      next();
    } else {
      router.push("/layout");
    }
  } else {
    next();
  }
});
router.afterEach((to, from) => {
  // to and from are both route objects.
  NProgress.done();
});
export default router;
