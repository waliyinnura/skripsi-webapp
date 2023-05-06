<template>
  <div class="container">
    <div class="card text-bg-light text-center">
      <div class="card-header d-inline-flex">
        <h3 class="fw-bold">Sign In</h3>
        <div class="d-flex align-items-end ms-auto text-secondary">
          <span v-if="operator">Restoran</span>
          <span v-else>Admin</span>
        </div>
      </div>
      <div class="card-body">
        <form @submit.prevent="SignIn">
          <div v-if="operator">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" />
              <label for="floatingInput">Email</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ emailValidate }}</p>
            </div>
          </div>
          <div v-else>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="nama" />
              <label for="floatingInput">Nama</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ namaValidate }}</p>
            </div>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password" />
            <label for="floatingPassword">Password</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ passwordValidate }}</p>
          </div>
          <div v-if="operator">
            <p class="text-secondary mt-3 mb-0">
              Tidak Memiliki Akun ?
              <router-link to="/sign-up" class="text-reset">Buat Akun</router-link>
            </p>
          </div>
          <button class="btn btn-secondary mt-3 px-5">Sign In</button>
        </form>
      </div>
      <div class="card-footer">
        <p @click="ChangeRole" class="text-decoration-underline my-0 text-secondary" role="button">Masuk Sebagai {{ operator ? "Admin" : "Operator" }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignIn",
  data() {
    return {
      operator: "true",
      nama: "",
      email: "",
      password: "",
      namaValidate: "",
      emailValidate: "",
      passwordValidate: "",
    };
  },
  methods: {
    ChangeRole() {
      this.operator = !this.operator;

      this.nama = "";
      this.email = "";
      this.password = "";
      this.namaValidate = "";
      this.emailValidate = "";
      this.passwordValidate = "";
    },

    async SignIn() {
      try {
        let result;
        if (this.operator) {
          result = await axios.post("http://localhost:3000/restoran/login", {
            email: this.email,
            password: this.password,
          });
        } else {
          result = await axios.post("http://localhost:3000/admin/login", {
            nama: this.nama,
            password: this.password,
          });
        }
        const token = await result.data.data.token;
        if (result.status == 200) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", this.operator ? "operator" : "admin");
          this.$router.push({ name: this.operator ? "Transaksi" : "Restoran" });
        }
      } catch (error) {
        // jika server down maka akan ke halaman error
        if (error.code == "ERR_NETWORK") {
          this.$router.push({ name: "Error" });
        } else {
          const errs = error.response.data.error;
          for (var key in errs) {
            if ((key = "email")) this.emailValidate = errs[key];
            if ((key = "nama")) this.namaValidate = errs[key];
            if ((key = "password")) this.passwordValidate = errs[key];
          }
        }
      }
    },
  },
  mounted() {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    if (token) {
      this.$router.push({ name: role == "operator" ? "Transaksi" : "Restoran" });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  height: 100vh;
  width: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-floating p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
