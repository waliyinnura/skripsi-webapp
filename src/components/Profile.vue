<template>
  <Navbar />
  <div class="container">
    <div class="profile mx-3 row border-bottom">
      <div class="col-6 text-end">
        <figure class="figure">
          <img v-bind:src="qr" class="figure-img img-fluid rounded" alt="qr" />
          <figcaption type="button" class="figure-caption text-center"><i class="bi bi-download"> Download QR</i></figcaption>
        </figure>
      </div>
      <div class="col-6">
        <h1 class="fw-bold d-flex">{{ nama }}<i type="button" class="bi bi-pencil-fill align-self-start text-secondary" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal == 'edit'"></i></h1>
        <p class="lh-sm">
          {{ alamat }} <br />
          {{ email }} <br />
          {{ nomorTelepon }} <br />
          {{ jumlahMeja }} Meja
        </p>
        <p type="button" class="figure-caption fst-italic password"><i class="bi bi-lock"></i> Ubah password</p>
      </div>
    </div>

    <div class="menu text-center mt-3">
      <figure class="figure">
        <img v-bind:src="fotoMenu" class="figure-img img-fluid rounded" alt="Foto Menu" />
        <figcaption type="button" class="figure-caption text-center"><i class="bi bi-upload"> Ubah gambar</i></figcaption>
      </figure>
    </div>
  </div>

  <!-- modal -->
  <div class="modal fade" id="modalProfile" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Edit</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body row">
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="Nama Restoran" v-model="nama" />
              <label for="floatingInput">Nama Restoran</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="Nomor Telepon" v-model="nomorTelepon" />
              <label for="floatingInput">Nomor Telepon </label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="Alamat" v-model="alamat" />
              <label for="floatingInput">Alamat</label>
            </div>
          </div>
          <div class="col-8">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" />
              <label for="floatingInput">Email </label>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="floatingInput" placeholder="Jumlah Meja" v-model="jumlahMeja" />
              <label for="floatingInput">Jumlah Meja</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
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
      id: "",
      nama: "",
      alamat: "",
      email: "",
      nomorTelepon: "",
      jumlahMeja: "",
      qr: "",
      fotoMenu: "",
      modal: "",
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
        this.id = data.idRestoran;
        this.nama = data.nama;
        this.alamat = data.alamat;
        this.email = data.email;
        this.nomorTelepon = data.nomorTelepon;
        this.jumlahMeja = data.jumlahMeja;
        this.fotoMenu = require("../../../skripsi-api/image/" + data.fotoMenu);
        this.qr = require("../../../skripsi-api/image/" + data.qrchatbot);
      });
  },
  methods: {},
};
</script>

<style scoped>
figure img {
  width: 150px;
}

.menu img {
  width: 300px;
}

.password {
  margin-top: 26px;
}

.bi-pencil-fill {
  font-size: 0.8rem;
  margin: 5px;
}

.label {
  font-size: 12px;
}
</style>
