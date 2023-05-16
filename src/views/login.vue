<template>
  <div id="login" class="type">
    <img
      class=""
      src="../assets/Thales_Wallpaper2018_1920x1080.jpg"
      alt=""
      style="position: absolute"
      width="100%"
      height="100%"
    />

    <!-- Modal -->
    <div
      :class="{ show: modal }"
      :style="{ display: modal ? 'block' : 'none' }"
      style="margin-top: 100px"
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="text-center">
              <br />
              <img
                alt="Logo"
                class="w3-margin-top"
                style="width: 70%"
                src="../assets/left_menu_logo.jpg"
              />
            </div>

            <form name="frm" class="container mt-4">
              <h1 style="">Login Requerido</h1>
              <p style="color: black">
                O recurso que você está tentando acessar requer uma
                identificação de usuário adequada.
              </p>
              <p style="font-weight: 900; color: black">
                Por favor, insira suas credenciais:
              </p>
              <p id="authEnforcedMsg"></p>

              <div class="form-group w-75">
                <div class="flex-row align-items-center" style="display: flex">
                  <label style="color: black" for="username" class="mr-2"
                    >Usuário</label
                  ><br />

                  <input
                    v-model="username"
                    placeholder="Usuário"
                    type="text"
                    name="username"
                    id="username"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-group" style="margin-top: 5px">
                <div
                  class="flex-row align-items-center w-75"
                  style="display: flex"
                >
                  <label
                    for="password"
                    class=""
                    style="margin-right: 17px; color: black"
                    >Senha</label
                  >
                  <input
                    v-model="passowrd"
                    placeholder="Senha"
                    type="password"
                    name="password"
                    id="password"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="form-group">
                <input
                  type="button"
                  name="submit"
                  class="btn btn-md"
                  value="Entrar"
                  style="
                    color: White;
                    background-color: #1f91ff;
                    margin-left: 60px;
                  "
                  @click="login"
                />
              </div>
            </form>
            <div
              v-if="showAlert"
              class="alert alert-danger mt-5 text-center"
              style="size: 100px"
              role="alert"
            >
              Username or Password invalid!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data: () => {
    return {
      modal: true,
      showAlert: false,
      username: "",
      passowrd: "",
      authenticated: false,
    };
  },

  methods: {
    ...mapGetters(["getToken", "GetUser"]),
    ...mapActions(["ActionDoLogin", "ActionGetlUser"]),
    ...mapMutations(["SET_TOKEN", "SET_USER", "SET_LOGIN"]),

    login() {
      this.ActionDoLogin({
        username: this.username,
        password: this.passowrd,
      }).then((resposta) => {
        this.authenticated = resposta.data.auth;
        if (this.authenticated) {
          this.SET_TOKEN(resposta.data.token);
          this.SET_USER(resposta.data.username);
          this.SET_LOGIN(resposta.data.auth);
          this.$router.push({ name: "Home" });
        } else {
          this.showAlert = true;
          setTimeout(() => (this.showAlert = false), 3000);
        }
      });
    },
    alertShow() {
      if (!this.showAlert) this.showAlert = !this.showAlert;
    },
  },
};
</script>

<style scoped>
.type {
  font-family: "RobotoDraft", "Roboto", sans-serif;
}
</style>