<template>
  <Navbar />
  <div class="container">
    <!-- navbar search -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <form class="d-flex" role="search">
          <!-- search bar -->
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="cari" />
        </form>
      </div>
    </nav>
    <!-- navbar search -->
    <table class="table my-2">
      <thead>
        <tr>
          <th scope="col">Nama Restoran</th>
          <th scope="col">Alamat</th>
        </tr>
      </thead>
      <!-- jika server tidak bermasalah -->
      <tbody v-if="isOnline" class="table-group-divider">
        <!-- looping +print  1 1 -->
        <tr v-for="restoran in cariRestoran" :key="restoran.idRestoran">
          <!-- verif -->
          <td v-if="restoran.status == 'terverifikasi'">
            {{ restoran.nama }}
            <i class="bi bi-check-square"></i>
          </td>
          <td v-else>
            {{ restoran.nama }}
          </td>
          <td>{{ restoran.alamat }}</td>
          <td>
            <!-- btn modal detail -->
            <p>
              <i
                class="bi bi-three-dots-vertical"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#detailModal"
                @click="SendDetail(restoran.idRestoran, restoran.nama, restoran.alamat, restoran.nomorTelepon, restoran.email, restoran.jumlahMeja, restoran.status, restoran.qrchatbot, restoran.fotoMenu)"
              ></i>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- modal -->
  <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Restoran</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="Close"></button>
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
            <div class="col-9 mb-2">: {{ this.jumlahMeja }}</div>

            <div class="col-4" v-if="fotoMenu != null">
              <img v-bind:src="fotoMenu" class="img-thumbnail foto-menu" alt="Foto Menu" />
            </div>
            <div class="col menu rounded-2" v-if="menus.length != 0">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nama</th>
                    <th scope="col">Tipe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="menu in menus" :key="menu.idMenu">
                    <td>{{ menu.nama }}</td>
                    <td>{{ menu.tipe }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- input gambar qr muncul jika belom terverifikasi -->
            <div class="col-12 mt-3">
              <input class="form-control" type="file" id="formFile" name="image" @change="onFileSelected" />
              <p class="text-danger text-start fw-lighter opacity-75">{{ validateQRcode }}</p>
            </div>
          </div>
        </div>
        <!-- footer + btn muncul jika belom terverifikasi -->
        <div class="modal-footer" v-if="this.status == 'belum terverifikasi'">
          <button type="button" class="btn btn-secondary" @click="Validasi">Verifikasi Restoran</button>
        </div>
        <div class="modal-footer" v-if="this.status == 'terverifikasi'">
          <button type="button" class="btn btn-secondary" @click="UpdateQRCode">Ubah QR code Restoran</button>
          <button type="button" class="btn btn-secondary" @click="RemoveVerifikasi">Copot Verifikasi Restoran</button>
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
      id: "",
      nama: "",
      alamat: "",
      nomorTelepon: "",
      email: "",
      jumlahMeja: "",
      cari: "",
      status: "",
      lokasi: "",
      file: null,
      namaFotoQRcode: "",
      fotoMenu: null,
      validateQRcode: "",
      menus: [],
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    // trigger jika belom login akan diarahkan ke login
    if (!this.token || this.role == "operator") {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    }

    // get all restoran
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
        }
      })
      .catch((error) => {
        // this.isOnline = false;
        console.log(error);
      });
  },
  methods: {
    Close() {
      this.id = "";
      this.nama = "";
      this.alamat = "";
      this.nomorTelepon = "";
      this.email = "";
      this.jumlahMeja = "";
      this.status = "";
      this.lokasi = "";
      this.namaFotoQRcode = "";
      this.fotoMenu = null;
      this.menus = [];
    },

    // get data restoran
    SendDetail(id, nama, alamat, nomorTelepon, email, jumlahMeja, status, namaFotoQRcode, fotoMenu) {
      this.id = id;
      this.nama = nama;
      this.alamat = alamat;
      this.nomorTelepon = nomorTelepon;
      this.email = email;
      this.jumlahMeja = jumlahMeja;
      this.status = status;
      this.lokasi = "qr";
      this.namaFotoQRcode = namaFotoQRcode;
      if (fotoMenu) {
        this.fotoMenu = require("../../../skripsi-api/image/" + fotoMenu);
      }

      axios
        .post(
          "http://localhost:3000/menu/getAllMenuIdRestoran",
          {
            // id harus terisi
            idRestoran: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.menus = res.data.data;
          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            return;
          }
        });
    },
    // get image
    onFileSelected(event) {
      this.file = event.target.files[0];
    },
    // upload foto qr + memberi verifikasi
    Validasi() {
      if (this.file == null) {
        this.validateQRcode = "File harus terisi";
        return;
      }

      var bodyFormData = new FormData();
      bodyFormData.append("image", this.file, this.file.name);
      bodyFormData.append("lokasi", this.lokasi);
      bodyFormData.append("idRestoran", this.id);
      axios
        .post("http://localhost:3000/common/upload", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + this.token,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            axios
              .post(
                "http://localhost:3000/restoran/postVerifikasi",
                {
                  idRestoran: this.id,
                  status: "terverifikasi",
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
          }
        })
        .catch((error) => {
          consoe.log(error);
        });
    },
    // update foto qr
    UpdateQRCode() {
      if (this.file == null) {
        this.validateQRcode = "File harus terisi";
        return;
      }

      var bodyFormData = new FormData();
      bodyFormData.append("image", this.file, this.file.name);
      bodyFormData.append("lokasi", this.lokasi);
      bodyFormData.append("idRestoran", this.id);
      axios
        .post(
          "http://localhost:3000/common/delete",
          {
            oldImage: this.namaFotoQRcode,
            lokasi: this.lokasi,
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
            axios
              .post("http://localhost:3000/common/upload", bodyFormData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + this.token,
                },
              })
              .then((res) => {
                if (res.status == 200) {
                  location.reload();
                }
              })
              .catch((error) => {
                consoe.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    RemoveVerifikasi() {
      axios
        .post(
          "http://localhost:3000/common/delete",
          {
            oldImage: this.namaFotoQRcode,
            lokasi: this.lokasi,
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
            axios
              .post(
                "http://localhost:3000/restoran/postVerifikasi",
                {
                  idRestoran: this.id,
                  status: "belum terverifikasi",
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
          }
        });
    },
  },
  computed: {
    // fungsi search
    cariRestoran() {
      return this.restorans.filter((restoran) => {
        return restoran.nama.match(this.cari);
      });
    },
  },
};
</script>

<style scoped>
.menu {
  height: 150px;
  overflow: hidden;
  overflow-y: scroll;
}

.foto-menu {
  height: 150px;
}

.restoran {
  margin-top: 100px;
}

.col-12 p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
