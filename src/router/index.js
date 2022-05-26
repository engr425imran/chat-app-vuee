import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import ChatView from "../views/ProfileView.vue";
import ChatUi from "../views/ChatUi.vue";
import ChatLogin from "../views/ChatLogin.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: ChatLogin,
    meta: { requiresAuth: false },
  },
  {
    path: "/profile",
    name: "chat",
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: "/chatUIPage",
    name: "chatPage",
    component: ChatUi,
    meta: { requiresAuth: true },
  },
  {
    path: "/profileEdit",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
const loggedIn = localStorage.getItem("user");
router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !loggedIn) next({ name: "Login" });
  else next();
});

export default router;

// if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
//   next("/login");
//   return;
// } else {
//   if (to.matched.some((record) => !record.meta.requiresAuth) ) {
//     next({
//       name: "home",
//     });
//   }
// }
