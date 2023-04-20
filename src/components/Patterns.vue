<template>
  <Navbar />
  <!--btn create dan search -->
  <div class="container">
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid">
        <!-- btn create tag -->
        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalPatterns" @click="SendCreateTag">Create Tag</button>
        <form class="d-flex" role="search">
          <!-- input cari -->
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="cari" />
        </form>
      </div>
    </nav>
    <!-- tampilan tag, patterns dan response -->
    <div v-if="isOnline">
      <div class="accordion my-2" v-for="tag in cariTag" :key="tag.idPatterns">
        <div class="accordion-item">
          <div class="accordion-header row">
            <h4 class="mt-3 ms-3 fw-semibold tag col">
              {{ tag.tag.tag.toUpperCase() }}
              <!-- icon edit tag-->
              <i class="bi bi-pencil-square text-secondary" role="button" data-bs-toggle="modal" data-bs-target="#modalPatterns" @click="SendEditTag(tag.tag.idPatterns, tag.tag.tag)"></i>
            </h4>
            <div class="me-3 d-flex justify-content-end col">
              <!-- icon tambah patterns & response -->
              <i class="bi bi-plus text-secondary" role="button" data-bs-toggle="modal" data-bs-target="#modalPatterns" @click="SendCratePatternsResponse(tag.tag.tag)"></i>
              <!-- icon delete tag -->
              <i class="bi bi-trash2-fill text-secondary mx-2 align-self-center" role="button" data-bs-toggle="modal" data-bs-target="#modalPatterns" @click="SendDeleteTag(tag.tag.idPatterns, tag.tag.tag, tag.patterns, tag.response)"></i>
            </div>
          </div>
          <div class="accordion-body row">
            <div class="col">
              <div class="text-end">
                <h5 class="d-inline-flex">Patterns</h5>
              </div>
              <ul class="list-group list-group-flush" v-for="pattern in tag.patterns" :key="pattern">
                <li class="list-group-item border-bottom border-top text-secondary">
                  {{ pattern.pesan }}
                  <!-- icon edit patterns -->
                  <div class="float-end d-flex">
                    <i
                      class="bi bi-pencil-fill align-self-center me-3"
                      role="button"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPatterns"
                      @click="SendEditPatternsResponse(pattern.idDetailPatterns, tag.tag.tag, pattern.tipe, pattern.pesan)"
                    ></i>
                    <!-- icon delete patterns -->
                    <i
                      class="bi bi-trash2"
                      role="button"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPatterns"
                      @click="SendDeletePatternsResponse(tag.tag.idPatterns, pattern.idDetailPatterns, tag.tag.tag, pattern.tipe, pattern.pesan)"
                    ></i>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col">
              <div class="text-end">
                <h5 class="d-inline-flex">Response</h5>
              </div>
              <ul class="list-group list-group-flush" v-for="response in tag.response" :key="response">
                <li class="list-group-item border-bottom border-top text-secondary">
                  {{ response.pesan }}
                  <!-- icon edit response -->
                  <div class="float-end d-flex">
                    <i
                      class="bi bi-pencil-fill align-self-center me-3"
                      role="button"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPatterns"
                      @click="SendEditPatternsResponse(response.idDetailPatterns, tag.tag.tag, response.tipe, response.pesan)"
                    ></i>
                    <i
                      class="bi bi-trash2"
                      role="button"
                      data-bs-toggle="modal"
                      data-bs-target="#modalPatterns"
                      @click="SendDeletePatternsResponse(tag.tag.idPatterns, response.idDetailPatterns, tag.tag.tag, response.tipe, response.pesan)"
                    ></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- modal -->
  <div class="modal fade" id="modalPatterns" tabindex="-1" aria-labelledby="exampleModalLabel" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">{{ this.modal }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="Close"></button>
        </div>
        <!-- modal header -->
        <!-- modal body -->
        <!-- tampilan modal btn create tag & edit tag-->
        <div class="modal-body" v-if="modal == 'Tag'">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" v-model="tag" />
            <label for="floatingInput">Tag</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ tagValidate }}</p>
          </div>
        </div>
        <!-- tampilan modal icon tambah detail tag & edit detail tag -->
        <div class="modal-body" v-else-if="modal == 'Patterns / Response'">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInputDisabled" v-model="tag" disabled />
            <label for="floatingInputDisabled">Tag</label>
          </div>
          <div class="form-floating mb-3">
            <select class="form-select" id="floatingSelect" aria-label="Floating label select example" v-model="tipe" dropdown-item>
              <option value="response" selected>Response</option>
              <option value="patterns">Patterns</option>
            </select>
            <label for="floatingSelect">Tipe</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ tipeValidate }}</p>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" v-model="pesan" />
            <label for="floatingInput">Pesan</label>
            <p class="text-danger text-start fw-lighter opacity-75">{{ pesanValidate }}</p>
          </div>
        </div>
        <!-- tampilan modal icon delete  -->
        <div class="modal-body" v-else-if="modal == 'Delete'">
          <p v-if="modalBody == 'Detail'">
            Hapus data <b>{{ this.tipe }}</b> dari tag <b>{{ this.tag }}</b
            >: "{{ this.pesan }}" ?
          </p>
          <div v-if="modalBody == 'Tag'">
            Jika anda menghapus tag <b>{{ this.tag }}</b> maka data berikut juga akan terhapus :
            <div class="d-flex flex-nowrap mt-3" v-if="this.patterns.length != 0">
              <b>Pattern</b> :
              <p v-for="pattern in this.patterns" :key="pattern.idDetailPatterns">"{{ pattern.pesan }}" ,</p>
            </div>
            <div class="d-flex flex-nowrap" v-if="this.response.length != 0">
              <b>Response</b> :
              <p v-for="response in this.response" :key="response.idDetailPatterns">"{{ response.pesan }}" ,</p>
            </div>
            Tetap hapus tag <b>"{{ this.tag }}"</b> ?
          </div>
        </div>
        <!-- modal body -->
        <!-- modal-footer -->
        <div class="modal-footer" v-if="modal == 'Tag'">
          <!-- btn create tag -->
          <button type="button" class="btn btn-secondary" @click="CreateTag" v-if="modalBody == 'Create'">Save Create</button>
          <!-- btn edit tag -->
          <button type="button" class="btn btn-secondary" @click="EditTag" v-else-if="modalBody == 'Edit'">Save Edit</button>
        </div>
        <div class="modal-footer" v-else-if="modal == 'Patterns / Response'">
          <!-- btn create patterns response -->
          <button type="button" class="btn btn-secondary" @click="CreatePatternsResponse" v-if="modalBody == 'Create'">Save Create</button>
          <!-- btn edit patterns response -->
          <button type="button" class="btn btn-secondary" @click="EditPatternsResponse" v-else-if="modalBody == 'Edit'">Save Edit</button>
        </div>
        <div class="modal-footer" v-else-if="modal == 'Delete'">
          <button class="btn btn-secondary" type="button" v-if="modalBody == 'Detail'" @click="DeletePatternsResponse">Delete {{ this.tipe }}</button>
          <button class="btn btn-secondary" type="button" v-if="modalBody == 'Tag'" @click="DeleteTag">Delete tag</button>
        </div>
        <!-- modal-footer -->
      </div>
    </div>
  </div>
  <!-- modal -->
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Patterns",
  data() {
    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      isOnline: "",
      tags: [],
      cari: "",
      modal: "",
      modalBody: "",
      id: "",
      idDetail: "",
      tag: "",
      tipe: "",
      pesan: "",
      nama: "",
      patterns: [],
      response: [],
      tagValidate: "",
      tipeValidate: "",
      pesanValidate: "",
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

    // get all data patterns dan detail patterns
    axios
      .get("http://localhost:3000/patterns/getDetailTag", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.token,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          this.isOnline = true;
          this.tags = res.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    // search bar
    cariTag() {
      return this.tags.filter((tag) => {
        return tag.tag.tag.match(this.cari);
      });
    },
  },
  methods: {
    // btn close
    Close() {
      this.modal = "";
      this.modalBody = "";
      this.id = "";
      this.tag = "";
      this.tipe = "";
      this.pesan = "";
      this.nama = "";
      this.patterns = [];
      this.response = [];
      this.tagValidate = "";
      this.tipeValidate = "";
      this.pesanValidate = "";
    },
    // trigger untuk isi modal btn create tag
    SendCreateTag() {
      this.modal = "Tag";
      this.modalBody = "Create";
    },
    // post tag baru
    CreateTag() {
      axios
        .post(
          "http://localhost:3000/patterns/postTag",
          {
            tag: this.tag,
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
              if ((key = "tag")) this.tagValidate = errs[key];
            }
          }
        });
    },
    // trigger untuk isi modal icon edit tag
    SendEditTag(id, tag) {
      this.modal = "Tag";
      this.modalBody = "Edit";
      this.id = id;
      this.tag = tag;
    },
    // post Edit tag
    EditTag() {
      axios
        .post(
          "http://localhost:3000/patterns/updateTag",
          {
            idPatterns: this.id,
            tag: this.tag,
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
              if ((key = "tag")) this.tagValidate = errs[key];
            }
          }
        });
    },
    // trigger delete tag
    SendDeleteTag(id, tag, patterns, response) {
      this.id = id;
      this.tag = tag;
      this.patterns = patterns;
      this.response = response;
      this.modal = "Delete";
      this.modalBody = "Tag";
    },

    DeleteTag() {
      axios
        .post(
          "http://localhost:3000/patterns/deleteTag",
          {
            idPatterns: this.id,
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
    // trigger untuk isi modal icon create detail patterns
    SendCratePatternsResponse(tag) {
      this.modal = "Patterns / Response";
      this.modalBody = "Create";
      this.tag = tag;
    },
    // post patterns & rasponse baru
    CreatePatternsResponse() {
      axios
        .post(
          "http://localhost:3000/patterns/postPatternsResponse",
          {
            tag: this.tag,
            pesan: this.pesan,
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
              if ((key = "tag")) this.tagValidate = errs[key];
              if ((key = "tipe")) this.tipeValidate = errs[key];
              if ((key = "pesan")) this.pesanValidate = errs[key];
            }
          }
        });
    },
    // trigger untuk isi modal icon edit detail patterns
    SendEditPatternsResponse(id, tag, tipe, pesan) {
      this.modal = "Patterns / Response";
      this.modalBody = "Edit";
      this.id = id;
      this.tag = tag;
      this.tipe = tipe;
      this.pesan = pesan;
      // console.log(this.id, this.tag, this.tipe, this.pesan);
    },
    // post edit patterns & rasponse
    EditPatternsResponse() {
      axios
        .post(
          "http://localhost:3000/patterns/updatePatternsResponse",
          {
            idDetailPatterns: this.id,
            tipe: this.tipe,
            pesan: this.pesan,
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
              if ((key = "tag")) this.tagValidate = errs[key];
              if ((key = "tipe")) this.tipeValidate = errs[key];
              if ((key = "pesan")) this.pesanValidate = errs[key];
            }
          }
        });
    },
    // trigger delete patterns / response
    SendDeletePatternsResponse(idTag, idDetailTag, tag, tipe, pesan) {
      this.id = idTag;
      this.idDetail = idDetailTag;
      this.tag = tag;
      this.tipe = tipe;
      this.pesan = pesan;
      this.modal = "Delete";
      this.modalBody = "Detail";
    },
    // delete patterns / response
    DeletePatternsResponse() {
      axios
        .post(
          "http://localhost:3000/patterns/deletePatternsRasponse",
          {
            idPatterns: this.id,
            idDetailPatterns: this.idDetail,
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
};
</script>

<style scoped>
.bi-plus {
  font-size: 2.5rem;
}
.bi-trash2-fill {
  font-size: 1.5rem;
}
.bi-pencil-square {
  font-size: 0.8rem;
}
.bi-pencil-fill {
  font-size: 0.8rem;
  text-align: center;
}

.bi-trash2 {
  font-size: 1rem;
}

.tag {
  color: #41444b;
}

.col h5 {
  font-size: 0.8rem;
  color: #52575d;
}

.form-floating p {
  margin-left: 10px;
  font-size: 12px;
}
</style>
