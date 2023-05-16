<template>
  <div class="home">
    <div class="bg-thales-light-blue mb-4" style="display: flex">
      <div
        class="justify-content-center align-items-center w-100"
        style="display: flex"
      >
        <div style="font-size: 25px" class="text-white font-weight-bold">
          Portal para cadastro de visitantes - Wi-Fi Visitors
        </div>
      </div>
      <div class="justify-content-end align-items-center" style="display: flex">
        <div class="mr-4" @click="logout" style="cursor: pointer">
          <i class="fas fa-sign-out-alt fa-lg text-white"></i>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      :class="{ show: modal }"
      :style="{ display: modal ? 'block' : 'none' }"
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              v-if="showButonPassword"
              class="modal-title"
              id="exampleModalLabel"
              style="color: #242a75"
            >
              Cadastrar novo visitante
            </h5>
            <h5
              v-if="!showButonPassword"
              class="modal-title"
              id="exampleModalLabel"
              style="color: #242a75"
            >
              Editar visitante
            </h5>
            <button
              @click="closeModal"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" style="color: #049ddd">
            <div class="mb-3">
              <label for="">Nome completo</label>
              <input
                @change="$v.user.name.$touch()"
                v-model="user.name"
                type="text"
                class="form-control"
                aria-label="Recipient's "
                aria-describedby="basic-addon2"
              />
              <label v-if="$v.user.name.$error" class="text-error-requiredfield"
                >Campo requerido</label
              >
            </div>

            <label for="">Tipo documento</label>
            <select
              v-if="showButonPassword"
              @change="$v.user.doctype.$touch()"
              v-model="user.doctype"
              class="form-select mb-3"
              aria-label="Default select example"
            >
              <option selected>RG</option>
              <option value="CPF">CPF</option>
              <option value="passaporte">Passaporte</option>
              <option value="RNE">RNE</option>
            </select>
            <label
              v-if="$v.user.doctype.$error"
              class="text-error-requiredfield"
              >Campo requerido</label
            >

            <div v-if="showButonPassword" class="mb-3">
              <label for="">N° documento (Apenas números e letras)</label>
              <input
                v-on:blur="searchDocument"
                v-model="user.document"
                @change="$v.user.document.$touch()"
                @keyup="trataTexto(user.document)"
                type="text"
                class="form-control"
                aria-label="Recipient's "
                aria-describedby="basic-addon2"
              />
              <label
                v-if="$v.user.document.$error"
                class="text-error-requiredfield"
                >Campo requerido</label
              >
            </div>
            <div v-if="showActive">
              <div class="form-check">
                <input
                  v-model="user.active"
                  value="1"
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked
                />
                <label class="form-check-label" for="flexRadioDefault2">
                  Ativo
                </label>
              </div>

              <div class="form-check">
                <input
                  v-model="user.active"
                  value="0"
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Inativo
                </label>
              </div>
            </div>

            <div class="mb-3 input-group mt-3">
              <input
                v-if="false"
                disabled
                @change="$v.user.password.$touch()"
                v-model="user.password"
                type="password"
                class="form-control"
                aria-label="Recipient's "
                aria-describedby="basic-addon2"
              />
              <div
                v-if="showButonPassword"
                @click="generatePass(0)"
                class="input-group-text btn btn-outline-primary"
                style="cursor: pointer"
                id="btnGroupAddon"
              >
                Gerar senha
              </div>
            </div>
            <label
              v-if="$v.user.password.$error"
              class="text-error-requiredfield"
              >Gerar senha é requerido</label
            >
            <div v-if="showAlert" class="alert alert-success" role="alert">
              Salvo com sucesso!
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click="closeModal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Fechar
            </button>
            <button
              @click.prevent="saveUser"
              type="button"
              class="btn btn-primary"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex-column w-100 justify-content-lg-around m-3"
      style="display: flex"
    >
      <form class="d-flex mb-3">
        <button
          @click="openModal"
          class="btn btn-outline-primary mr-5"
          type="button"
        >
          <i class="fas fa-plus"></i>
          Cadastrar novo visitante
        </button>

        <b-form-select
          v-model="selected"
          :options="options"
          class="w-25 mr-2"
        ></b-form-select>
        <input
          v-model="filterName"
          class="form-control mr-2 w-25"
          type="search"
          placeholder="Buscar"
          aria-label="Search"
        />
        <button
          @click="getFilters"
          class="btn btn-outline-primary"
          type="button"
        >
          <i class="fas fa-search"></i>
          Buscar
        </button>
      </form>

      <div class="w-100">
        <table class="table text-thales-dark-blue">
          <thead>
            <tr>
              <th scope="col">Nome do visitante</th>
              <th scope="col">Tipo documento</th>
              <th scope="col">N° documento</th>
              <th scope="col">Liberado por</th>
              <th scope="col">Última Atualização</th>
              <th scope="col">Status do visitante</th>
              <th scope="col">Ação</th>
            </tr>
          </thead>
          <tbody class="" style="color: #049ddd">
            <tr v-for="item in pageUsers" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.doctype }}</td>
              <td>{{ item.document }}</td>
              <td>{{ item.opusername }}</td>
              <td>{{ formatDate(item.update) }}</td>
              <td>
                <i
                  v-if="item.active == 1"
                  class="fas fa-user"
                  style="color: green"
                ></i>
                <i
                  v-if="item.active == 0"
                  class="fas fa-user"
                  style="color: red"
                ></i>
              </td>

              <td>
                <i
                  @click="putUser(item)"
                  class="fas fa-pencil-alt mr-3"
                  style="color: #242a75; cursor: pointer"
                ></i>
                <i
                  v-if="item.active == 1"
                  @click="generatePass(1, item)"
                  class="fas fa-key mr-3"
                  style="color: green; cursor: pointer"
                  title="Gerar nova senha"
                >
                </i>
                <i
                  v-if="item.active == 1"
                  @click="deleteUser(item)"
                  class="fas fa-trash"
                  style="color: red; cursor: pointer"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="align-items-center flex-column" style="display: flex">
          <div class="">
            <button @click="prevPage" type="button" class="btn btn-light">
              <i
                class="fas fa-chevron-left"
                style="color: #e84586; cursor: pointer"
              ></i>
            </button>

            <button disabled type="button" class="btn btn-light">
              {{ currentPage }}/{{ totalPage }}
            </button>

            <button @click="nextPage" type="button" class="btn btn-light">
              <i
                class="fas fa-chevron-right"
                style="color: #e84586; cursor: pointer"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "Home",

  data() {
    return {
      selected: null,
      options: [
        { value: null, text: "Selecione o campo que deseja buscar" },
        { value: "nome", text: "Nome" },
        { value: "document", text: "Número Documento" },
        { value: "opusername", text: "Liberado por" },
      ],

      caracteresEspeciais: [
        { list: ["Á", "À", "Ä", "Â", "Ã"], caracter: "A" },
        { list: ["É", "È", "Ê", "Ë"], caracter: "E" },
        { list: ["Í", "Ì", "Î", "Ï"], caracter: "I" },
        { list: ["Ö", "Ó", "Ò", "Ô", "Õ"], caracter: "O" },
        { list: ["Ú", "Ù", "Û", "Ü"], caracter: "U" },
        { list: ["Ñ"], caracter: "N" },
        { list: ["Ç"], caracter: "C" },
        { list: ["Ý"], caracter: "Y" },
        {
          list: [
            "!",
            "@",
            "#",
            "%",
            "&",
            "(",
            ")",
            "_",
            "=",
            "@",
            "#",
            "*",
            ".",
            ";",
            "/",
            "|",
            ">",
            "<",
            "^",
            "º",
            "`",
            "´",
            "{",
            "}",
            '"',
            "$",
            "¨",
          ],
          caracter: "",
        },
      ],
      mask: "[a-zA-Z0-9]",
      showButonPassword: true,
      showActive: false,
      showAlert: false,
      currentSort: "name",
      currentSortDir: "asc",
      pageSize: 10,
      currentPage: 1,
      totalPage: 0,

      modal: false,
      filterName: "",

      user: {
        id: "",
        name: "",
        opusername: "",
        doctype: "",
        document: "",
        password: "",
        active: "",
        update: Date,
      },
      users: [],
    };
  },
  validations: {
    user: {
      name: { required },
      doctype: { required },
      document: { required },
      password: { required },
    },
  },
  computed: {
    pageUsers: function () {
      return [...this.users]
        .sort((a, b) => {
          let modifier = 1;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        })
        .filter((row, index) => {
          let start = (this.currentPage - 1) * this.pageSize;
          let end = this.currentPage * this.pageSize;
          if (index >= start && index < end) return true;
        });
    },
  },
  methods: {
    ...mapGetters(["getToken", "GetUser"]),
    ...mapActions([
      "ActionDoLogin",
      "ActionAddUser",
      "ActionDelUser",
      "ActionGetlUser",
      "ActionPutUser",
      "ActionGetName",
      "ActionGetDocument",
      "ActionGetDocumentEspecific",
      "ActionGetOpusername",
    ]),
    ...mapMutations(["SET_TOKEN", "SET_USER", "SET_LOGIN"]),

    specialCharacters(c) {
      for (let i = 0; i < this.caracteresEspeciais.length; i++) {
        let item = this.caracteresEspeciais[i];
        for (let j = 0; j < item.list.length; j++) {
          if (item.list[j] == c) {
            return item.caracter;
          }
        }
      }
      return c;
    },

    verifyText(txt) {
      txt = txt.toUpperCase().trim();
      let ret = "";

      for (let i = 0; i < txt.length; i++) {
        ret += this.specialCharacters(txt.substr(i, 1));
      }
      this.user.document = ret;
      return ret;
    },

    nextPage: function () {
      if (this.currentPage * this.pageSize < this.users.length)
        this.currentPage++;
    },
    prevPage: function () {
      if (this.currentPage > 1) this.currentPage--;
    },

    openModal() {
      this.showButonPassword = true;
      this.showActive = false;
      this.modal = true;
    },
    closeModal() {
      this.clearFields();
      this.modal = false;
      this.getUser();
    },
    saveUser() {
      if (!this.$v.$invalid) {
        if (this.user.id == "") {
          this.user.opusername = this.GetUser();
          this.user.active = 1;
          this.showAlert = true;
          setTimeout(
            () => (
              this.ActionAddUser({ _user: this.user, token: this.getToken() }),
              this.getUser(),
              this.clearFields(),
              (this.showAlert = false)
            ),
            500
          );
          setTimeout(() => (this.showAlert = false), 3000);
          this.$v.$reset();
        } else {
          this.user.opusername = this.GetUser();
          this.showAlert = true;
          //this.user.update = new Date();
          setTimeout(
            () => (
              this.ActionPutUser({ _user: this.user, token: this.getToken() }),
              this.getUser(),
              this.clearFields()
            ),
            500
          );
          setTimeout(() => (this.showAlert = false), 3000);
          this.$v.$reset();
        }
      } else {
        this.$v.$touch();
      }
    },

    deleteUser(item) {
      if (window.confirm("Voce deseja realmente excluir esse usuário?")) {
        item.opusername = this.GetUser();
        item.active = 0;
        this.ActionPutUser({ _user: item, token: this.getToken() });
        this.getUser();
      }
    },
    getUser() {
      setTimeout(
        () =>
          this.ActionGetlUser(this.getToken()).then((resposta) => {
            this.users = resposta.data;
            this.totalPage = Math.ceil(this.users.length / this.pageSize);
          }),
        1000
      );
    },
    putUser(item) {
      this.showButonPassword = false;
      this.showActive = true;
      this.user = item;

      this.modal = true;
    },

    getFilters() {
      if (!this.filterName.trim() == "") {
        if (this.selected == "nome") {
          this.ActionGetName({
            name: this.filterName.trim(),
            token: this.getToken(),
          }).then((resposta) => {
            setTimeout(
              () => (
                (this.users = resposta.data),
                (this.totalPage = Math.ceil(this.users.length / this.pageSize)),
                (this.currentPage = 1)
              )
            ),
              1000;
          });
        } else if (this.selected == "document") {
          this.ActionGetDocument({
            document: this.verifyText(this.filterName),
            token: this.getToken(),
          }).then((resposta) => {
            setTimeout(
              () => (
                (this.users = resposta.data),
                (this.totalPage = Math.ceil(this.users.length / this.pageSize)),
                (this.currentPage = 1)
              )
            ),
              1000;
          });
        } else if (this.selected == "opusername") {
          this.ActionGetOpusername({
            opusername: this.verifyText(this.filterName),
            token: this.getToken(),
          }).then((resposta) => {
            setTimeout(
              () => (
                (this.users = resposta.data),
                (this.totalPage = Math.ceil(this.users.length / this.pageSize)),
                (this.currentPage = 1)
              )
            ),
              1000;
          });
        }
      } else {
        this.getUser();
      }
    },

    generatePass(n, item) {
      if (n == 1) {
        if (confirm("deseja alterar a senha deste usuario?")) {
          this.user.password = "";
          for (let i = 0; i < 6; i++) {
            this.user.password += Math.floor(Math.random() * 10);
          }
          item.password = this.user.password;
          this.ActionPutUser({ _user: item, token: this.getToken() });
          alert("Senha gerada: " + item.password);
          this.getUser();
        }
      } else {
        this.user.password = "";
        for (let i = 0; i < 6; i++) {
          this.user.password += Math.floor(Math.random() * 10);
        }
        alert("Senha gerada: " + this.user.password);
      }
    },

    clearFields() {
      var user = {
        id: "",
        name: "",
        doctype: "",
        document: "",
        password: "",
      };
      this.user = user;
    },
    logout() {
      this.SET_LOGIN(false);
      this.$router.push({ name: "Login" });
    },
    formatDate(date) {
      return moment(String(date)).format("DD/MM/YYYY HH:mm");
    },
    searchDocument() {
      if (!this.verifyText(this.user.document) == "") {
        this.ActionGetDocumentEspecific({
          document: this.verifyText(this.user.document),
          token: this.getToken(),
        }).then((resposta) => {
          if (resposta.data.length > 0) {
            alert("documento ja cadastrado");
            this.user.document = "";
          }
        });
      }
    },
  },
  mounted() {
    this.getUser();
  },
};
</script>

<style scoped>
#mostrar {
  display: none;
}

#passar_mouse:hover #mostrar {
  display: block;
}
</style>


