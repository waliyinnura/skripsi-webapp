<template>
  <Navbar />
  <div class="container">
    <div class="profile mx-3 row border-bottom" v-if="qr">
      <!-- qr -->
      <div class="col-6 text-end">
        <figure class="figure">
          <!-- image qr -->
          <img v-bind:src="qr" class="figure-img img-fluid rounded" alt="qr" />
          <!-- btn download -->
          <figcaption type="button" class="figure-caption text-center" @click="Download"><i class="bi bi-download"> Download QR</i></figcaption>
        </figure>
      </div>
      <!-- qr  -->
      <!-- profil -->
      <div class="col-6">
        <h1 class="fw-bold d-flex">
          {{ nama }}
          <!-- btn ubah profil -->
          <i type="button" class="bi bi-pencil-fill align-self-start text-secondary" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Edit Profile'"></i>
        </h1>
        <p class="lh-sm txtProfile">
          {{ alamat }} <br />
          {{ email }} <br />
          {{ nomorTelepon }} <br />
          {{ jumlahMeja }} Meja
        </p>
        <!-- btn ubah password -->
        <p type="button" class="figure-caption fst-italic password" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Ubah Password'">
          <i class="bi bi-lock"></i>
          Ubah password
        </p>
        <p type="button" class="figure-caption delete" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Delete Akun'">
          <i class="bi bi-exclamation-triangle-fill"></i>
          DELETE AKUN
        </p>
      </div>
      <!-- profil -->
    </div>

    <!-- jika belom terverifikasi -->
    <div class="profile mx-3 border-bottom text-center" v-else>
      <!-- profil -->
      <h1 class="fw-bold d-flex justify-content-center ms-4">
        {{ nama }}
        <!-- btn ubah profil -->
        <i type="button" class="bi bi-pencil-fill align-self-start text-secondary" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Edit Profile'"></i>
      </h1>
      <p class="lh-sm txtProfile">
        {{ alamat }} <br />
        {{ email }} <br />
        {{ nomorTelepon }} <br />
        {{ jumlahMeja }} Meja
      </p>
      <!-- btn ubah password -->
      <p type="button" class="figure-caption fst-italic password" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Ubah Password'">
        <i class="bi bi-lock"></i>
        Ubah password
      </p>
      <p type="button" class="figure-caption delete" data-bs-toggle="modal" data-bs-target="#modalProfile" @click="this.modal = 'Delete Akun'">
        <i class="bi bi-exclamation-triangle-fill"></i>
        DELETE AKUN
      </p>
    </div>
    <!-- profil -->

    <!-- menu -->
    <div class="menu text-center mt-3">
      <figure class="figure">
        <!-- image menu -->
        <img v-bind:src="fotoMenu" class="figure-img img-fluid rounded" alt="Foto Menu" v-if="fotoMenu" />
        <!-- btn ubah / input gambar -->
        <figcaption
          v-if="fotoMenu"
          type="button"
          class="figure-caption text-center"
          data-bs-toggle="modal"
          data-bs-target="#modalProfile"
          @click="
            this.modal = 'Ubah Gambar';
            this.lokasi = 'menu';
          "
        >
          <i class="bi bi-upload"> Ubah gambar</i>
        </figcaption>
        <figcaption
          v-else
          type="button"
          class="figure-caption text-center"
          data-bs-toggle="modal"
          data-bs-target="#modalProfile"
          @click="
            this.modal = 'Upload Gambar';
            this.lokasi = 'menu';
          "
        >
          <i class="bi bi-upload"> Upload gambar</i>
        </figcaption>
      </figure>
    </div>
  </div>
  <!-- menu -->

  <!-- modal -->
  <div class="modal fade" id="modalProfile" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modal }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <!-- modal header -->
        <!-- modal body -->
        <!-- edit profile body -->
        <div class="modal-body row" v-if="this.modal == 'Edit Profile'">
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" placeholder="Nama Restoran" v-model="nama" />
              <label for="floatingInput">Nama Restoran</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ namaValidate }}</p>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" placeholder="Nomor Telepon" v-model="nomorTelepon" />
              <label for="floatingInput">Nomor Telepon </label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ nomorTeleponValidate }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" placeholder="Alamat" v-model="alamat" />
              <label for="floatingInput">Alamat</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ alamatValidate }}</p>
            </div>
          </div>
          <div class="col-8">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" placeholder="name@example.com" v-model="email" />
              <label for="floatingInput">Email </label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ emailValidate }}</p>
            </div>
          </div>
          <div class="col-4">
            <div class="form-floating mb-3">
              <input type="number" class="form-control" placeholder="Jumlah Meja" v-model="jumlahMeja" />
              <label for="floatingInput">Jumlah Meja</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ jumlahMejaValidate }}</p>
            </div>
          </div>
        </div>
        <!-- end edit profile body -->
        <!-- ubah password body -->
        <div class="modal-body row" v-else-if="this.modal == 'Ubah Password'">
          <div class="col-12">
            <div class="form-floating mb-3">
              <input type="password" class="form-control" placeholder="Passowrd Lama" v-model="passwordLama" />
              <label for="floatingInput">Password Lama</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ passwordLamaValidate }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating mb-3">
              <input type="password" class="form-control" placeholder="Passowrd Baru" v-model="passwordBaru" />
              <label for="floatingInput">Password Baru </label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ passwordBaruValidate }}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="form-floating mb-3">
              <input type="password" class="form-control" placeholder="Konfirmasi Password Baru" v-model="konfirmasiPasswordBaru" />
              <label for="floatingInput">Konfirmasi Password Baru</label>
              <p class="text-danger text-start fw-lighter opacity-75">{{ konfirmasiPasswordBaruValidate }}</p>
            </div>
          </div>
        </div>
        <!-- end ubah password body -->
        <!-- Upload Gambar body -->
        <div class="modal-body" v-else-if="this.modal == 'Upload Gambar' || this.modal == 'Ubah Gambar'">
          <div class="mb-3 file">
            <label for="formFile" class="form-label ms-2">{{ this.modal }} Menu</label>
            <input class="form-control" type="file" id="formFile" name="image" @change="onFileSelected" />
            <p class="text-danger text-start fw-lighter opacity-75">{{ fotoMenuValidate }}</p>
          </div>
        </div>
        <!-- end Upload Gambar body -->
        <!-- Delete Akun body -->
        <div class="modal-body" v-else-if="this.modal == 'Delete Akun'">
          <h5>Anda ingin menghapus akun anda?</h5>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" placeholder="Password" v-model="password" />
            <label for="floatingInput">Password</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ passwordValidate }}</p>
          </div>
        </div>
        <!-- end Delete Akun body -->
        <!-- modal body -->
        <!-- modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-if="this.modal == 'Edit Profile'" @click="EditProfile">Save edit</button>
          <button type="button" class="btn btn-secondary" v-else-if="this.modal == 'Ubah Password'" @click="UbahPassword">Save password</button>
          <button type="button" class="btn btn-secondary" v-else-if="this.modal == 'Ubah Gambar'" @click="UbahGambar">Ubah Gambar</button>
          <button type="button" class="btn btn-secondary" v-else-if="this.modal == 'Upload Gambar'" @click="UploadGambar">Upload Gambar</button>
          <button type="button" class="btn btn-secondary" v-else-if="this.modal == 'Delete Akun'" @click="DeleteAkun">Delete</button>
        </div>
        <!-- modal footer -->
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
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      id: "",
      nama: "",
      alamat: "",
      email: "",
      nomorTelepon: "",
      jumlahMeja: "",
      password: "",
      passwordValidate: "",
      passwordLama: "",
      passwordBaru: "",
      konfirmasiPasswordBaru: "",
      passwordLamaValidate: "",
      passwordBaruValidate: "",
      konfirmasiPasswordBaruValidate: "",
      namaValidate: "",
      alamatValidate: "",
      emailValidate: "",
      nomorTeleponValidate: "",
      jumlahMejaValidate: "",
      fotoMenuValidate: "",
      qr: "",
      fotoMenu: "",
      namaFotoMenu: "",
      modal: "",
      file: null,
      lokasi: "",
    };
  },
  components: {
    Navbar,
  },
  mounted() {
    if (!this.token || this.role == "admin") {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    }

    axios
      .get("http://localhost:3000/restoran/getRestoranByIdToken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
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

        if (data.fotoMenu) {
          this.fotoMenu = require("../../../skripsi-api/image/" + data.fotoMenu);
          this.namaFotoMenu = data.fotoMenu;
        }
        if (data.qrchatbot) {
          this.qr = require("../../../skripsi-api/image/" + data.qrchatbot);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    EditProfile() {
      axios
        .post(
          "http://localhost:3000/restoran/updateRestoranByIdToken",
          {
            nama: this.nama,
            email: this.email,
            alamat: this.alamat,
            nomorTelepon: this.nomorTelepon,
            jumlahMeja: this.jumlahMeja,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if ((res.status = 200)) {
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error.response.data.error);
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di input");
            location.reload();
          } else {
            const errs = error.response.data.error;
            for (var key in errs) {
              if ((key = "nama")) this.namaValidate = errs[key];
              if ((key = "email")) this.emailValidate = errs[key];
              if ((key = "alamat")) this.alamatValidate = errs[key];
              if ((key = "nomorTelepon")) this.nomorTeleponValidate = errs[key];
              if ((key = "jumlahMeja")) this.jumlahMejaValidate = errs[key];
            }
          }
        });
    },
    onFileSelected(event) {
      this.file = event.target.files[0];
    },
    UbahPassword() {
      axios
        .post(
          "http://localhost:3000/restoran/ubahPassword",
          {
            passwordLama: this.passwordLama,
            passwordBaru: this.passwordBaru,
            konfirmasiPasswordBaru: this.konfirmasiPasswordBaru,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if ((res.status = 200)) {
            location.reload();
          }
        })
        .catch((error) => {
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di input");
            location.reload();
          } else {
            const errs = error.response.data.error;
            for (var key in errs) {
              if ((key = "passwordLama")) this.passwordLamaValidate = errs[key];
              if ((key = "passwordBaru")) this.passwordBaruValidate = errs[key];
              if ((key = "konfirmasiPasswordBaru")) this.konfirmasiPasswordBaruValidate = errs[key];
            }
          }
        });
    },
    UploadGambar() {
      if (this.file == null) {
        this.fotoMenuValidate = "File harus terisi";
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
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    UbahGambar() {
      if (this.file == null) {
        this.fotoMenuValidate = "File harus terisi";
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
            oldImage: this.namaFotoMenu,
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
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    DeleteAkun() {
      console.log(this.id);
      console.log(this.password);

      axios
        .post(
          "http://localhost:3000/restoran/delete",
          {
            idRestoran: this.id,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if ((res.status = 200)) {
            localStorage.clear();
            this.$router.push({ name: "SignIn" });
            location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di input");
            location.reload();
          } else {
            const errs = error.response.data.error;
            for (var key in errs) {
              if ((key = "password")) this.passwordValidate = errs[key];
            }
          }
        });
    },
    Download() {
      axios
        .get("http://localhost:3000/common/download", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.token,
          },
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
figure img {
  width: 150px;
}

.menu img {
  width: 300px;
}

.txtProfile {
  margin-top: -10px;
}

.password {
  margin-top: -15px;
}

.delete {
  margin-top: -15px;
  color: #ff8776;
}

.bi-pencil-fill {
  font-size: 0.8rem;
  margin: 5px;
}

.label {
  font-size: 12px;
}

.file p,
.form-floating p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
