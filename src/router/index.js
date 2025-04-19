import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashBoardView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/dashboard", name: "Dashboard", component: DashboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const isLoggedIn = !!localStorage.getItem("token");

  if (authRequired && !isLoggedIn) {
    return next("/login");
  }

  next();
});

export default router;
