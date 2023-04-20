<template>
  <Navbar />
  <div class="container">
    <!-- navbar menu -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <!-- btn input -->
        <button type="button" class="btn btn-secondary px-5" data-bs-toggle="modal" data-bs-target="#ModalMenu" @click="this.modal = 'Input'">Input</button>
        <form class="d-flex" role="search">
          <!-- search -->
          <input class="form-control me-2" type="search" placeholder="Search" v-model="cari" />
        </form>
      </div>
    </nav>
    <!-- navbar menu -->
    <table class="table my-4">
      <thead>
        <tr>
          <th scope="col">Nama</th>
          <th scope="col">Harga</th>
          <th scope="col">Tipe</th>
        </tr>
      </thead>
      <!-- jika server aman -->
      <tbody v-if="adaData == 'ada'" class="table-group-divider">
        <tr v-for="menu in cariMenu" :key="menu.idMenu">
          <td>{{ menu.nama }}</td>
          <td>{{ menu.harga }}</td>
          <td>{{ menu.tipe }}</td>
          <!-- btn edit -->
          <td><p role="button" class="text-decoration-underline edit" data-bs-toggle="modal" data-bs-target="#ModalMenu" @click="SendEdit(menu.idMenu, menu.nama, menu.harga, menu.tipe)">Edit</p></td>
          <!-- btn delete -->
          <td><p role="button" class="text-decoration-underline delete" data-bs-toggle="modal" data-bs-target="#ModalMenu" @click="SendDelete(menu.idMenu, menu.nama)">Delete</p></td>
        </tr>
      </tbody>
      <tbody v-else-if="adaData == 'data tidak ada'" class="table-group-divider">
        <tr class="text-center">
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
      <tbody v-else-if="adaData == 'server down'" class="table-group-divider">
        <tr class="text-center">
          <td></td>
          <td><b>Server Down &#128591; </b></td>
          <td></td>
        </tr>
      </tbody>
      <!-- jika server tidak aman -->
      <tbody v-else class="table-group-divider">
        <tr class="text-center">
          <td></td>
          <td><b>Server Down &#128591; </b></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- modal -->
  <div class="modal fade" id="ModalMenu" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ modal }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="Close"></button>
        </div>
        <!-- modal body input menu -->
        <div class="modal-body" v-if="modal === 'Input'">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" v-model="nama" />
            <label for="floatingInput">Nama Menu</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ namaValidate }}</p>
          </div>
          <div class="form-floating mb-3">
            <input type="number" class="form-control" id="floatingInput" v-model="harga" />
            <label for="floatingInput">Harga</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ hargaValidate }}</p>
          </div>
          <div class="form-floating">
            <select class="form-select" id="floatingSelect" aria-label="Floating label select example" v-model="tipe" dropdown-item>
              <option value="makanan" selected>Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
            <label for="floatingSelect">Tipe</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ tipeValidate }}</p>
          </div>
        </div>
        <!-- modal body edit menu -->
        <div class="modal-body" v-else-if="modal === 'Edit'">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" v-model="nama" />
            <label for="floatingInput">Nama Menu</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ namaValidate }}</p>
          </div>
          <div class="form-floating mb-3">
            <input type="number" class="form-control" id="floatingInput" v-model="harga" />
            <label for="floatingInput">Harga</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ hargaValidate }}</p>
          </div>
          <div class="form-floating">
            <select class="form-select" id="floatingSelect" aria-label="Floating label select example" v-model="tipe" dropdown-item>
              <option value="makanan" selected>Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
            <label for="floatingSelect">Tipe</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ tipeValidate }}</p>
          </div>
        </div>
        <!-- modal body delete menu -->
        <div class="modal-body" v-else-if="modal === 'Delete'">
          <p>Hapus Data Menu: {{ nama }} ?</p>
        </div>
        <!-- modal footer -->
        <div class="modal-footer" v-if="modal === 'Input'">
          <button type="button" class="btn btn-secondary" @click="Input">Save</button>
        </div>
        <div class="modal-footer" v-else-if="modal === 'Edit'">
          <button type="button" class="btn btn-secondary" @click="Edit">Edit</button>
        </div>
        <div class="modal-footer" v-else-if="modal === 'Delete'">
          <button type="button" class="btn btn-secondary" @click="Delete">Delete</button>
        </div>
        <!-- modal footer -->
      </div>
    </div>
  </div>
  <!-- modal -->
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Error from "../components/Error.vue";

export default {
  name: "Menu",
  data() {
    return {
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
      adaData: "",
      id: "",
      nama: "",
      harga: "",
      tipe: "",
      cari: "",
      namaValidate: "",
      hargaValidate: "",
      tipeValidate: "",
      menus: [],
      modal: "",
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
      .get("http://localhost:3000/menu/getAllMenuByIdToken", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          this.adaData = "ada";
          this.menus = res.data.data;
        }
      })
      .catch((error) => {
        if (error.code == "ERR_NETWORK") {
          this.adaData = "server down";
        } else if (error.response.status == 404) {
          this.adaData = "data tidak ada";
        }
      });
  },
  methods: {
    Close() {
      this.id = "";
      this.nama = "";
      this.harga = "";
      this.tipe = "";
      this.namaValidate = "";
      this.hargaValidate = "";
      this.tipeValidate = "";
    },
    Input() {
      axios
        .post(
          "http://localhost:3000/menu/postMenuRestoranByIdToken",
          {
            nama: this.nama,
            harga: this.harga,
            tipe: this.tipe,
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
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di input");
            location.reload();
          } else {
            const errs = error.response.data.error;
            for (var key in errs) {
              if ((key = "nama")) this.namaValidate = errs[key];
              if ((key = "harga")) this.hargaValidate = errs[key];
              if ((key = "tipe")) this.tipeValidate = errs[key];
            }
          }
        });
    },
    SendEdit(id, nama, harga, tipe) {
      this.id = id;
      this.nama = nama;
      this.harga = harga;
      this.tipe = tipe;
      this.modal = "Edit";
    },
    Edit() {
      axios
        .post(
          "http://localhost:3000/menu/updateMenuRestoranByIdToken",
          {
            idMenu: this.id,
            nama: this.nama,
            harga: this.harga,
            tipe: this.tipe,
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
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di Edit");
            location.reload();
          } else {
            const errs = error.response.data.error;
            for (var key in errs) {
              if ((key = "nama")) this.namaValidate = errs[key];
              if ((key = "harga")) this.hargaValidate = errs[key];
              if ((key = "tipe")) this.tipeValidate = errs[key];
            }
          }
        });
    },
    SendDelete(id, nama) {
      this.id = id;
      this.nama = nama;
      this.modal = "Delete";
    },
    Delete() {
      axios
        .post(
          "http://localhost:3000/menu/deleteMenuByIdMenu",
          {
            idMenu: this.id,
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
          if (error.code == "ERR_NETWORK") {
            alert("Data tidak berhasil di delete");
            location.reload();
          } else {
            alert(error.response.data.error);
          }
        });
    },
  },
  computed: {
    cariMenu() {
      return this.menus.filter((menu) => {
        return menu.nama.match(this.cari);
      });
    },
  },
};
</script>

<style scoped>
td {
  font-weight: 500;
}
.edit {
  color: #ffd050;
}
.delete {
  color: #ff8776;
}

.form-floating p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
