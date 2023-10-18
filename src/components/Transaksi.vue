<template>
  <Navbar />
  <div class="container">
    <!-- navbar transaksi -->
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <form class="d-flex" role="search">
          <!-- search -->
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="cari" />
        </form>
      </div>
    </nav>
    <!-- filter -->
    <div class="filter">
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  autocomplete="off" v-model="cariLunas" v-bind:value="''" checked>
        <label class="form-check-label" for="flexRadioDefault1">
          No Filter
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" v-model="cariLunas" v-bind:value="'lunas'">
        <label class="form-check-label" for="flexRadioDefault2">
          Lunas
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" v-model="cariLunas" v-bind:value="'belum bayar'">
        <label class="form-check-label" for="flexRadioDefault3">
          Belum Bayar
        </label>
      </div>
    </div>
    <!-- navbar transaksi -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Nomor Meja</th>
          <th scope="col">Tanggal Pesan</th>
        </tr>
      </thead>
      <!-- jika server aman -->
      <tbody v-if="adaData == 'ada'" class="table-group-divider">
        <tr v-for="transaksi in cariTransaksi" :key="transaksi.idTransaksi">
          <td>{{ transaksi.username }} <span class="badge text-bg-info ms-2 text-light" v-if="transaksi.status == 'lunas'">Lunas</span></td>
          <td>{{ transaksi.nomorMeja }}</td>
          <td>{{ new Date(transaksi.tanggalBuat).toLocaleString() }}</td>
          <!-- btn detail -->
          <td>
            <p role="button" data-bs-toggle="modal" data-bs-target="#ModalTransaksi" @click="SendDetail(transaksi.idTransaksi, transaksi.username, transaksi.nomorMeja, transaksi.tanggalBuat, transaksi.status, transaksi.tanggalBayar)">
              Detail
            </p>
          </td>
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
          <td></td>
          <td></td>
        </tr>
      </tbody>
      <tbody v-else class="table-group-divider">
        <tr class="text-center">
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="ModalTransaksi" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            {{ this.username }}
            <span class="badge bg-secondary">{{ this.nomorMeja }}</span>
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="text-center tanggalBuat">Pesan: {{ new Date(this.tanggalBuat).toLocaleString() }}</p>
          <p class="text-center tanggalBuat" v-if="this.tanggalBayar">Bayar: {{ new Date(this.tanggalBayar).toLocaleString() }}</p>
          <div class="p-2">
            <div class="row border-bottom">
              <div class="col-5"><b>Nama Menu</b></div>
              <div class="col-1 text-center"><b>qty</b></div>
              <div class="col-3 text-end"><b>Harga</b></div>
              <div class="col-3 text-end"><b>Sub Harga</b></div>
            </div>
            <div class="row mt-1" v-for="pesan in this.detailTransaksis" :key="pesan.idDetailTransaksi">
              <div class="col-5">
                {{ pesan.nama }}
              </div>
              <div class="col-1 text-center">{{ pesan.qty }}</div>
              <div class="col-3 text-end">{{ pesan.harga }}</div>
              <div class="col-3 text-end">{{ pesan.qty * pesan.harga }}</div>
            </div>
            <div class="row mt-2 border-top pt-2">
              <div class="col-3"><b>Total</b></div>
              <div class="col-9 text-end">{{ this.total }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="this.status != 'lunas'">
          <button type="button" class="btn btn-primary" @click="StatusBayar">Lunas</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import axios from "axios";

export default {
  name: "Transaksi",
  components: {
    Navbar,
  },
  data() {
    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      cari: "",
      cariLunas: "",
      adaData: "",
      transaksis: [],
      detailTransaksis: [],
      total: "",
      idTransaksi: "",
      username: "",
      nomorMeja: "",
      tanggalBuat: "",
      tanggalBayar: "",
      status: "",
    };
  },
  mounted() {
    if (!this.token || this.role == "admin") {
      localStorage.clear();
      this.$router.push({ name: "SignIn" });
    }

    axios
      .get("http://localhost:3000/transaksi/getTransaksi", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          this.adaData = "ada";
          this.transaksis = res.data.data;
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
  computed: {
    cariTransaksi() {
      return this.transaksis.filter((transaksi) => {
        if (this.cariLunas.length !== 0 && transaksi.status === this.cariLunas){
          return transaksi.username.match(this.cari);
        } else if (this.cariLunas.length === 0){
          return transaksi.username.match(this.cari);
        }
      });
    },
    // cariLunas() {
    //   return this.transaksis.filter((transaksi) => {
    //     return transaksi.status.match(this.cariLunas)
    //   })
    // }
  },
  methods: {
    SendDetail(idTransaksi, username, nomorMeja, tanggalBuat, status, tanggalBayar) {
      this.idTransaksi = idTransaksi;
      this.username = username;
      this.nomorMeja = nomorMeja;
      this.tanggalBuat = tanggalBuat;
      this.status = status;
      this.tanggalBayar = tanggalBayar;
      axios
        .post(
          "http://localhost:3000/transaksi/getDetailTransaksi",
          {
            idTransaksi: this.idTransaksi,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.detailTransaksis = res.data.data;
            this.total = res.data.total;
          }
          console.log(this.total);
        })
        .catch((error) => {
          this.adaData = false;
        });
    },
    StatusBayar() {
      axios
        .post(
          "http://localhost:3000/transaksi/postStatus",
          {
            idTransaksi: this.idTransaksi,
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
        });
    },
  },
};
</script>

<style scoped>
.tanggalBuat {
  font-size: 14px;
  margin-top: -10px;
}

.filter {
  display: flex;
  margin: 10px;
}

.filter .form-check {
  margin: 0 10px;
}

</style>
