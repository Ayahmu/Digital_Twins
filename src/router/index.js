import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  // 预留路由跳转
  // {
  //   path: "/manage",
  //   name: "manange",
  //   component: () => import("../views/ManageView.vue"),
  // },
];

const router = new VueRouter({
  routes,
  mode: "hash",
});

export default router;
