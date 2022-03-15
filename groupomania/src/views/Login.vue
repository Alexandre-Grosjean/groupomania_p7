<template>
  <div class="template-box">
    <div class="box_log_register">
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
        <span class="switchChoice" @click="switchToLogin()"
          >creer un compte</span
        >
      </p>
      <div class="input-box">
        <label for="myEmail">E-mail : </label>
        <input
          name="myEmail"
          v-model="email"
          type="text"
          placeholder="***@***.com"
        />
      </div>
      <div v-if="mode == 'create'" class="input-box">
        <label for="myName">Name : </label>
        <input v-model="name" name="MyName" type="text" placeholder="abc" />
      </div>
      <div class="input-box">
        <label for="myPassword">Password : </label>
        <input
          v-model="password"
          name="myPassword"
          type="password"
          placeholder="******"
        />
      </div>
      <div v-if="errorAlertLogin == 'alert'" class="alert-p">
        <p>adresse mail et/ou mot de passe invalide</p>
      </div>
      <div v-if="errorAlertCreate == 'alert'" class="alert-p">
        <p>adresse mail déjà existant ou mot de passe trop faible</p>
      </div>
      <div class="validation-box">
        <button
          @click="loginAccount"
          v-if="mode == 'login'"
          :class="{ buttonGrise: !validatedfields }"
          class="button-log"
        >
          <span>Connexion</span>
        </button>
        <button
          @click="createAccount"
          v-else
          :class="{ buttonGrise: !validatedfields }"
          class="button-create"
        >
          <span>creer mon compte</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

export default {
  data: function () {
    return {
      mode: "login",
      email: "",
      name: "",
      password: "",
      errorAlertLogin: "",
      errorAlertCreate: "",
    };
  },

  mounted: function async () {
    if (this.$store.state.user.userId !== -1) {
              this.$router.push("/posts");
      return;
    }
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
  },

  methods: {

    switchToCreateAccount: function () {
      this.mode = "create";
      this.errorAlertLogin = "";
    },
    switchToLogin: function () {
      this.mode = "login";
      this.errorAlertCreate = "";
    },
    loginAccount: async function () {
      const self = this;
      let dataForm = {
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch("setUser", dataForm)
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
      let dataForm = {
        email: this.email,
        name: this.name,
        password: this.password,
      };

      instance
        .post("/auth/register", dataForm)
        .then(function (res) {
          console.log(res);
          self.mode = "login";
        })
        .catch(function (err) {
          console.log(err);
          self.errorAlertCreate = "alert";
        });
    },
  },
};
</script>

<style scoped>
.template-box {
  display: flex;
  justify-content: center;
}

.box_log_register {
  text-align: center;
  width: 350px;
  height: 250px;
  background-color: lightgrey;
  border: 1px solid lightslategray;
  border-radius: 5px;
  margin-top: 50px;
  padding: 10px;
}
.switchChoice {
  color: rgba(63, 63, 196, 0.85);
  cursor: pointer;
}

.input-box {
  margin: 5px 50px;
  text-align: right;
}

.validation-box {
  margin: 20px;
}
.button-log {
  border-radius: 10px;
}

.button-create {
  border-radius: 10px;
}

.buttonGrise {
  opacity: 0.5;
  cursor: not-allowed;
  border-radius: 10px;
}

.alert-p {
  font-size: 14px;
    color: red
}
</style>