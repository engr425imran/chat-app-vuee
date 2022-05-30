import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProfileView from "../views/ProfileView.vue";
import ChatUi from "../views/ChatUi.vue";
import ChatLogin from "../views/ChatLogin.vue";
import store from "../store";
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
    name: "LoginView",
    component: ChatLogin,
    meta: { requiresAuth: false },
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
  routes,
});
const loggedIn = store.getters.getUser;
// const loggedIn = store.state.user;
// const loggedIn = localStorage.getItem("user");
router.beforeEach((to, from, next) => {
  if (to.name !== "LoginView" && !loggedIn) {
    next({ name: "LoginView" });
    console.log("either user is not  defined or user is login page");
    console.log("user status => ", loggedIn);
  } else {
    next();
    console.log(
      "either user is defined or user is visiting other than login page "
    );
    console.log("user status", loggedIn);
  }
});
export default router;
