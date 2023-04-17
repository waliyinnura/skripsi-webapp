<template>
  <Navbar />
  <div class="container">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="cari" />
        </form>
      </div>
    </nav>
    <table class="table my-2">
      <thead>
        <tr>
          <th scope="col">Nama Restoran</th>
          <th scope="col">Alamat</th>
        </tr>
      </thead>
      <tbody v-if="isOnline" class="table-group-divider">
        <tr v-for="restoran in cariRestoran" :key="restoran.idRestoran">
          <td v-if="restoran.status == 'terverifikasi'">
            {{ restoran.nama }}
            <i class="bi bi-check-square"></i>
          </td>
          <td v-else>
            {{ restoran.nama }}
          </td>
          <td>{{ restoran.alamat }}</td>
          <td>
            <p
              role="button"
              class="text-decoration-underline detail"
              data-bs-toggle="modal"
              data-bs-target="#detailModal"
              @click="SendDetail(restoran.idRestoran, restoran.nama, restoran.alamat, restoran.nomorTelepon, restoran.email, restoran.jumlahMeja, restoran.status)"
            >
              Detail
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- modal -->
  <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Restoran</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h2>{{ this.nama }}</h2>
          <div class="row">
            <div class="col-3">Alamat</div>
            <div class="col-9">: {{ this.alamat }}</div>
            <div class="col-3">Nomor Tel</div>
            <div class="col-9">: {{ this.nomorTelepon }}</div>
            <div class="col-3">Email</div>
            <div class="col-9">: {{ this.email }}</div>
            <div class="col-3">Jumlah Meja</div>
            <div class="col-9">: {{ this.jumlahMeja }}</div>
          </div>
        </div>
        <div class="modal-footer" v-if="this.status == 'belum terverifikasi'">
          <button type="button" class="btn btn-secondary" @click="Validasi">Verifikasi Restoran</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Restoran",
  data() {
    return {
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
      isOnline: "",
      restorans: [],
      nama: "",
      alamat: "",
      nomorTelepon: "",
      email: "",
      jumlahMeja: "",
      cari: "",
      status: "",
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    if (!this.token || this.role == "operator") {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    }

    axios
      .get("http://localhost:3000/restoran", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          this.isOnline = true;
          this.restorans = res.data.data;
          console.log(this.restorans);
        }
      })
      .catch((error) => {
        this.isOnline = false;
      });
  },
  methods: {
    SendDetail(id, nama, alamat, nomorTelepon, email, jumlahMeja, status) {
      this.id = id;
      this.nama = nama;
      this.alamat = alamat;
      this.nomorTelepon = nomorTelepon;
      this.email = email;
      this.jumlahMeja = jumlahMeja;
      this.status = status;
    },
    Validasi() {
      axios
        .post(
          "http://localhost:3000/restoran/postVerifikasi",
          {
            idRestoran: this.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Restoran tidak berhasil di verifikasi");
        });
    },
  },
  computed: {
    cariRestoran() {
      return this.restorans.filter((restoran) => {
        return restoran.nama.match(this.cari);
      });
    },
  },
};
</script>

<style></style>
