<template>
  <div>
    <div>
      <p @click="goToPosts">return</p>
    </div>
    <h1>info profile</h1>
    <p v-if="mode == 'profile'" @click="switchToUpdateProfile()">🖋️</p>
    <div v-if="mode == 'profile'">
      <p>{{ this.userInfos.name }}</p>
    </div>
    <div v-else>
      <p>{{ this.userInfos.name }}</p>
      <input v-model="name" type="text" placeholder="quel sera ton choix ?" />
      <p class="alert_condition">ecrire ou modifier pour valider changement</p>
    </div>
    <p>{{ this.userInfos.email }}</p>
    <p v-if="this.userInfos.isAdmin === true">admin</p>
    <div v-if="mode == 'updateProfile'">
      <input type="file" name="imageProfil" ref="file" @change="onFileChange" />
    </div>
    <div>
      <img class="image_profil" :src="this.userInfos.imageUrl" />
    </div>
    <div v-if="mode == 'updateProfile'">
      <button
        @click="validateUpdateProfile"
        :class="{ buttonGrise: !validatedfields }"
      >
        valider
      </button>
      <button @click="switchToProfile()">annuler</button>
    </div>
    <div v-else>
      <button @click="disconnect">deconnexion</button>
      <button @click="desactivate">desactivation</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/"
});

export default {
  data: function () {
    return {
      mode: "profile",
      userInfos: "",
      name: "",
    };
  },
  created: async function () {
    let data = { userId: this.user.userId };
    await instance
      .post("/auth/profil", data,{
        headers: {
          authorization: "Bearer " + this.user.token,
        }
      })
      .then((res) => {
        this.userInfos = res.data;
        console.log(res);
      })
      .catch((err) => console.log(err));
  },
  mounted: function async() {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
  },
  computed: {
    validatedfields: function () {
      if (this.mode == "updateProfile") {
        if (this.name != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapGetters({ user: "getUser" }),
  },
  methods: {
    goToPosts: function () {
      this.$router.push("/posts");
    },
    switchToUpdateProfile: function () {
      this.mode = "updateProfile";
    },
    switchToProfile: function () {
      this.mode = "profile";
    },
    disconnect: function () {
      this.$store.commit("logout");
      document.location.reload();
    },
    desactivate: function () {
      let data = { userId: this.user.userId };
      instance
        .put(`/auth/desactivate/users/${this.userInfos.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          this.$store.commit("logout");
          console.log(res);
          document.location.reload();
        });
    },
    onFileChange() {
      this.imageProfil = this.$refs.file.files[0];
    },

    validateUpdateProfile: function () {
      const formData = new FormData();
      formData.append("userId", this.user.userId);
      formData.append("imageProfil", this.imageProfil);
      formData.append("name", this.name);
      instance
        .put(`/auth/updateProfil/users/${this.userInfos.uuid}`, formData, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          this.mode = "profile";
          document.location.reload();
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
.image_profil {
  width: 400px;
}

.buttonGrise {
  opacity: 0.5;
}

.alert_condition {
  color: lightblue;
}
</style>