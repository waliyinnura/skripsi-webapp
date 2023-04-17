<template>
  <div class="container p-3">
    <ul class="nav nav-underline justify-content-center" v-if="role == 'operator'">
      <li class="nav-item mx-3">
        <router-link class="nav-link text-secondary" to="/">Transaksi</router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link class="nav-link text-secondary" to="/menu">Menu</router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link class="nav-link text-secondary" to="/profile">Profile</router-link>
      </li>
      <li class="nav-item mx-3">
        <a class="nav-link text-secondary" @click="Logout" role="button">Logout</a>
      </li>
    </ul>
    <ul class="nav nav-underline justify-content-center" v-else>
      <li class="nav-item mx-3">
        <router-link class="nav-link text-secondary" to="/restoran">Restoran</router-link>
      </li>
      <li class="nav-item mx-3">
        <router-link class="nav-link text-secondary" to="/patterns">Patterns</router-link>
      </li>
      <li class="nav-item mx-3">
        <a class="nav-link text-secondary" @click="Logout" role="button">Logout</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      // if true => operator | false => admin
      role: "",
    };
  },
  mounted() {
    this.role = localStorage.getItem("role");
  },
  methods: {
    Logout() {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    },
  },
};
</script>

<style scoped>
.router-link-exact-active {
  border-bottom: 1px solid rgb(211, 211, 211);
}
</style>
