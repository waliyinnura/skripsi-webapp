<template>
  <div class="container">
    <div class="card text-bg-light text-center">
      <h3 class="card-header fw-bold">Sign Up</h3>
      <div class="card-body">
        <form @submit.prevent="signUp">
          <div class="row">
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="Nama Restoran" v-model="nama" />
                <label>Nama Restoran</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ namaValidate }}</p>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="tel" class="form-control" placeholder="Nomor Telepon" v-model="nomorTelepon" />
                <label>Nomor Telepon</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ nomorTeleponValidate }}</p>
              </div>
            </div>
            <div class="col-7">
              <div class="form-floating mb-3">
                <input type="email" class="form-control" placeholder="name@example.com" v-model="email" />
                <label>Email</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ emailValidate }}</p>
              </div>
            </div>
            <div class="col-5">
              <div class="form-floating mb-3">
                <input type="number" class="form-control" id="InputNumber" placeholder="Jumlah Meja" v-model="jumlahMeja" />
                <label for="InputNumber">Jumlah Meja</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ jumlahMejaValidate }}</p>
              </div>
            </div>
            <div class="col-12">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" placeholder="Alamat Restoran" v-model="alamat" />
                <label>Alamat Restoran</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ alamatValidate }}</p>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="password" class="form-control" placeholder="password" v-model="password" />
                <label>Passoword</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ passwordValidate }}</p>
              </div>
            </div>
            <div class="col-6">
              <div class="form-floating mb-3">
                <input type="password" class="form-control" placeholder="Konfirmasi Password" v-model="konfirmasiPassword" />
                <label>Konfirmasi Password</label>
                <p class="text-danger text-start fw-lighter opacity-75">{{ konfirmasiPasswordValidate }}</p>
              </div>
            </div>
          </div>
          <p class="text-secondary mt-1 mb-3">Sudah Punya Akun <router-link to="/sign-in" class="text-reset">Sign In</router-link></p>
          <button class="btn btn-secondary px-5">Sign Up</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      nama: "",
      email: "",
      nomorTelepon: "",
      alamat: "",
      jumlahMeja: "",
      password: "",
      konfirmasiPassword: "",
      namaValidate: "",
      emailValidate: "",
      nomorTeleponValidate: "",
      alamatValidate: "",
      jumlahMejaValidate: "",
      passwordValidate: "",
      konfirmasiPasswordValidate: "",
    };
  },
  methods: {
    async signUp() {
      try {
        let result = await axios.post("http://localhost:3000/restoran/registrasi", {
          nama: this.nama,
          email: this.email,
          nomorTelepon: this.nomorTelepon,
          alamat: this.alamat,
          jumlahMeja: this.jumlahMeja,
          password: this.password,
          konfirmasiPassword: this.konfirmasiPassword,
        });
        if (result.status == 200) {
          this.$router.push({ name: "SignIn" });
        }
      } catch (error) {
        if (error.code == "ERR_NETWORK") {
          this.$router.push({ name: "Error" });
        } else {
          const errs = error.response.data.error;
          for (var key in errs) {
            if ((key = "nama")) this.namaValidate = errs[key];
            if ((key = "email")) this.emailValidate = errs[key];
            if ((key = "nomorTelepon")) this.nomorTeleponValidate = errs[key];
            if ((key = "alamat")) this.alamatValidate = errs[key];
            if ((key = "jumlahMeja")) this.jumlahMejaValidate = errs[key];
            if ((key = "password")) this.passwordValidate = errs[key];
            if ((key = "konfirmasiPassword")) this.konfirmasiPasswordValidate = errs[key];
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-floating p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
