import { createRouter, createWebHistory } from "vue-router";
import AboutPage from "./pages/AboutPage.vue";
import DesignPage from "./pages/DesignPage.vue";
import StickersPage from "./pages/StickersPage.vue";

const routes = [
  { path: "/", name: "home", component: AboutPage },
  { path: "/stickers", name: "stickers", component: StickersPage },
  { path: "/about", name: "about", component: AboutPage },
  { path: "/design", name: "design", component: DesignPage },
  { path: "/profile", redirect: "/about" },
  { path: "/palette", redirect: "/design" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
