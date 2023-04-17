<template>
  <Navbar />
  <div class="container d-flex justify-content-center">
    <div class="profile mx-3">
      <h1 class="fw-bold">{{ nama }}</h1>
      <p class="lh-sm">
        {{ alamat }} <br />
        {{ email }} <br />
        {{ nomorTelepon }} <br />
        {{ jumlahMeja }} Meja
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Profile",
  data() {
    return {
      nama: "",
      alamat: "",
      email: "",
      nomorTelepon: "",
      jumlahMeja: "",
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    if (!token || role == "admin") {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    }

    axios
      .get("http://localhost:3000/restoran/getRestoranByIdToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        let data = res.data.data[0];
        this.nama = data.nama;
        this.alamat = data.alamat;
        this.email = data.email;
        this.nomorTelepon = data.nomorTelepon;
        this.jumlahMeja = data.jumlahMeja;
      });
  },
};
</script>

<style scoped></style>
