import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../components/SignIn.vue";
import SignUp from "../components/SignUp.vue";
import Transaksi from "../components/Transaksi.vue";
import Profile from "../components/Profile.vue";
import Menu from "../components/Menu.vue";
import Restoran from "../components/Restoran.vue";
import Patterns from "../components/Patterns.vue";
import Error from "../components/Error.vue";

const routes = [
  {
    path: "/",
    name: "Transaksi",
    component: Transaksi,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/restoran",
    name: "Restoran",
    component: Restoran,
  },
  {
    path: "/patterns",
    name: "Patterns",
    component: Patterns,
  },
  {
    path: "/404",
    name: "Error",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
