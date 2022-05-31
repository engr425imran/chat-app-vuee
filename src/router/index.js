import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatLogin from "../views/ChatLogin.vue";
import ChatUi from "../views/ChatUi.vue";
import ProfileView from "../views/ProfileView.vue";
import AboutView from "../views/AboutView.vue";
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
    component: AboutView,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else if (to.name === "LoginView" && loggedIn) {
    next("/");
  } else {
    next();
  }
});
export default router;
