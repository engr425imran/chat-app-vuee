import Vue from "vue";
// import store from "../store";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "/" */ "../views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "LoginView",
    component: () =>
      import(/* webpackChunkName: "/" */ "../views/ChatLogin.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/chatUIPage",
    name: "chatPage",
    component: () => import(/* webpackChunkName: "/" */ "../views/ChatUi.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profileEdit",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "/" */ "../views/ProfileView.vue"),
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
// const loggedInn = store.getters.getUser;
// // const loggedIn = store.state.user;
// const loggedIn = localStorage.getItem("user");
// router.beforeEach((to, from, next) => {
//   if (to.name !== "LoginView" && !loggedIn) {
//     next({ name: "LoginView" });
//     console.log(" user is not  defined and  user is not visiting login page");
//     console.log(
//       "user status from storage => ",
//       loggedIn,
//       "user status from state =>",
//       loggedInn
//     );
//   } else {
//     next();
//     console.log("either user is defined or user is visiting  login page ");
//     console.log(
//       "user status from storage => ",
//       loggedIn,
//       "user status from state =>",
//       loggedInn
//     );
//   }
// });
router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});
export default router;
