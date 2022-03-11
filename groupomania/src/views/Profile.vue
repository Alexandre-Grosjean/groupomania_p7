<template>
  <div>
    <h1>info profile</h1>
    <button>modifier</button>
    <p>{{ userInfos.name }}</p>
    <p>{{ userInfos.email }}</p>
    <p v-if="userInfos.isAdmin === true">admin</p>
    <img class="image_profil" :src="userInfos.imageUrl" />
    <div>
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
    mounted: function () {
      if (this.$store.state.user.uuid === "") {
        this.$router.push("/");
        return;
      }
    },
  computed: {
    ...mapState(["userInfos"]),
  },
  methods: {
    disconnect: function() {
    const self = this;
      this.$store.commit('logout');
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
  },
};
</script>

<style>
.image_profil {
  width: 400px;
}
</style>