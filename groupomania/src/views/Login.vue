<template>
  <div>
    <h1 v-if="mode == 'login'">Connexion</h1>
    <h1 v-else>Creation de compte</h1>
    <p v-if="mode == 'login'">
      tu n'as pas de compte ?
      <span class="switchChoice" @click="switchToCreateAccount()"
        >creer un compte</span
      >
    </p>
    <p v-else>
      tu as déjà un compte ?
      <span class="switchChoice" @click="switchToLogin()">creer un compte</span>
    </p>
    <div>
      <input v-model="email" type="text" placeholder="adresse mail" />
    </div>
    <div v-if="mode == 'create'">
      <input v-model="name" type="text" placeholder="name" />
    </div>
    <div>
      <input v-model="password" type="password" placeholder="mot de passe" />
    </div>
    <div v-if="mode == 'login' && status == 'error_login'">
      <p>adresse mail et/ou mot de passe invalide</p>
    </div>
    <div v-if="mode == 'create' && status == 'error_create'">
      <p>adresse mail deja utilisé</p>
    </div>
    <div>
      <button
        @click="loginAccount"
        v-if="mode == 'login'"
        :class="{ buttonGrise: !validatedfields }"
      >
        <span v-if="status == 'loading'">connexion en cours</span>
        <span v-else>Connexion</span>
      </button>
      <button
        @click="createAccount"
        v-else
        :class="{ buttonGrise: !validatedfields }"
      >
        <span v-if="status == 'loading'">connexion en cours</span>
        <span v-else>creer mon compte</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data: function () {
    return {
      mode: "login",
      email: "",
      name: "",
      password: "",
    };
  },
  computed: {
    validatedfields: function () {
      if (this.mode == "create") {
        if (this.email != "" && this.name != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
      if (this.mode == "login") {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  mounted: function async () {
    if (this.$store.state.user.uuid !== "") {
              this.$router.push("/posts");
      return;
    }
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    loginAccount: async function () {
      const self = this;
      this.$store
        .dispatch("loginAccount", {
          email: this.email,
          password: this.password,
        })
        .then(
          function async() {
              self.$router.push("/posts");
          },
          function (error) {
            console.log(error);
          }
        );
    },
    createAccount: function () {
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          name: this.name,
          password: this.password,
        })
        .then(
          function () {
            self.loginAccount();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style>
.switchChoice {
  color: rgba(63, 63, 196, 0.85);
  cursor: pointer;
}

.buttonGrise {
  opacity: 0.5;
}
</style>