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
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Nomor Meja</th>
          <th scope="col">Tanggal Pesan</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="transaksi in cariTransaksi" :key="transaksi.idTransaksi">
          <td>{{ transaksi.username }} <span class="badge text-bg-info ms-2 text-light" v-if="transaksi.status == 'lunas'">Lunas</span></td>
          <td>{{ transaksi.nomorMeja }}</td>
          <td>{{ transaksi.tanggalBuat }}</td>
          <td>
            <p role="button" data-bs-toggle="modal" data-bs-target="#ModalTransaksi" @click="SendDetail(transaksi.idTransaksi, transaksi.username, transaksi.nomorMeja, transaksi.tanggalBuat, transaksi.status, transaksi.tanggalBayar)">
              Detail
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="ModalTransaksi" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
          <p class="text-center tanggalBuat">Pesan: {{ this.tanggalBuat }}</p>
          <p class="text-center tanggalBuat" v-if="this.tanggalBayar">Bayar: {{ this.tanggalBayar }}</p>
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
      isOnline: "",
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
          this.isOnline = true;
          this.transaksis = res.data.data;
        }
      })
      .catch((error) => {
        this.isOnline = false;
      });
  },
  computed: {
    cariTransaksi() {
      return this.transaksis.filter((transaksi) => {
        return transaksi.username.match(this.cari);
      });
    },
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
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.detailTransaksis = res.data.data;
            this.total = res.data.total;
          }
        })
        .catch((error) => {
          this.isOnline = false;
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
</style>
