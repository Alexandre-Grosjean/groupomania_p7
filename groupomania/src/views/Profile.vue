<template>
  <div>
    <div>
      <p @click="goToPosts">return</p>
    </div>
    <h1>info profile</h1>
    <p v-if="mode == 'profile'" @click="switchToUpdateProfile()">🖋️</p>
    <div v-if="mode == 'profile'">
      <p>{{ user }}</p>
    </div>
    <div v-else>
      <p>{{ user }}</p>
      <input v-model="name" type="text" placeholder="quel sera ton choix ?" />
      <p class="alert_condition">ecrire ou modifier pour valider changement</p>
    </div>
    <p>{{ email }}</p>
    <p v-if="admin === true">admin</p>
    <div v-if="mode == 'updateProfile'">
      <input type="file" name="imageProfil" ref="file" @change="onFileChange" />
    </div>
    <div>
      <img class="image_profil" :src="image" />
    </div>
    <div v-if="mode == 'updateProfile'">
      <p class="alert_condition">votre profil sera mis à jour à votre prochaine connexion</p>
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
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

import { mapState } from "vuex";

export default {
  name: "Profile",
  data: function () {
    return {
      mode: "profile",
      name: "",
      imageProfil: "",
      user: this.$store.state.userInfos.name,
      email: this.$store.state.userInfos.email,
      image: this.$store.state.userInfos.imageUrl,
      admin: this.$store.state.userInfos.isAdmin,
    };
  },
  mounted: function () {
    if (this.$store.state.user.uuid == "") {
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
    ...mapState(["userInfos"]),
  },
  methods: {
    goToPosts: function() {
      this.$router.push("/posts");
    },
    switchToUpdateProfile: function () {
      this.mode = "updateProfile";
    },
    switchToProfile: function () {
      this.mode = "profile";
    },
    disconnect: function () {
      const self = this;
      this.$store.commit("logout");
      self.$router.push("/");
    },
    desactivate: function () {
      localStorage.removeItem("user");
      instance.put(
        `/auth/desactivate/users/${this.$store.state.userInfos.uuid}`
      );
      const self = this;
      self.$router.push("/");
    },
    onFileChange() {
      this.imageProfil = this.$refs.file.files[0];
    },
    validateUpdateProfile: function () {
      
      const formData = new FormData();
      formData.append("imageProfil", this.imageProfil);
      formData.append("name", this.name);
      instance
        .put(
          `/auth/updateProfil/users/${this.$store.state.userInfos.uuid}`,
          formData
        )
        .then((res) => {
          this.mode = "profile";
          console.log(res)
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