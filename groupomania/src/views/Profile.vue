<template>
  <div class="page-profils">
    <div>
      <fa icon="angles-left" class="return-button" @click="goToPosts" />
      <h1>info profil</h1>
    </div>
    <div class="profil-box">
      <div v-if="mode == 'profile'" class="edit-profil-box">
        <p>{{ this.userInfos.name }}</p>
        <fa
          icon="pen"
          class="pointer-cursor"
          v-if="mode == 'profile'"
          @click="switchToUpdateProfile()"
        />
      </div>
      <div v-else>
        <p class="name-edit-box">{{ this.userInfos.name }}</p>
        <input v-model="name" type="text" placeholder="quel sera ton choix ?" />
        <p class="alert_condition">
          nom entre 3 et 10 lettres pour valider changement
        </p>
      </div>
      <p>{{ this.userInfos.email }}</p>
      <fa
        v-if="this.userInfos.isAdmin === true"
        icon="crown"
        class="admin-logo"
      />
      <div v-if="mode == 'updateProfile'">
        <input
          type="file"
          name="imageProfil"
          ref="file"
          @change="onFileChange"
        />
      </div>
      <div>
        <img class="image_profil" :src="this.userInfos.imageUrl" />
      </div>
      <div v-if="mode == 'updateProfile'">
        <button
          @click="validateUpdateProfile"
          :class="{ buttonGriseProfil: !validatedfields }"
        >
          valider
        </button>
        <button @click="switchToProfile()">annuler</button>
      </div>
      <div v-else>
        <button @click="disconnect">deconnexion</button>
        <button v-if="this.userInfos.isAdmin === true" @click="getAllProfil">
          bannir / reactiver un compte
        </button>
      </div>
    </div>
    <div v-if="this.modeAdmin == true">
      <div v-for="profil in allProfil" :key="profil.id">
        <div v-if="profil.isAdmin != true">
          <div class="profil-list">
            <div>
              <p>
                name: <span class="info-profil">{{ profil.name }}</span> ,
                email: <span class="info-profil">{{ profil.email }}</span>
              </p>
            </div>
            <div>
              <fa
                v-if="profil.active === true"
                icon="check"
                @click="desactivate(profil)"
                class="status-profil-true"
              />
              <fa
                v-else
                icon="xmark"
                @click="reactivate(profil)"
                class="status-profil-false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

export default {
  data: function () {
    return {
      mode: "profile",
      modeAdmin: false,
      userInfos: "",
      name: "",
      allProfil: [],
    };
  },
  created: async function () {
    let data = { userId: this.user.userId };
    await instance
      .post("/auth/profil", data, {
        headers: {
          authorization: "Bearer " + this.user.token,
        },
      })
      .then((res) => {
        this.userInfos = res.data;
        this.$store.commit("update", {
          userName: res.data.name,
          userImage: res.data.imageUrl,
        });
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
      this.$router.push("/");
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
    getAllProfil: function () {
      instance
        .get(`/auth/allProfil`, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          if (this.modeAdmin == true) {
            this.modeAdmin = false;
          } else {
            this.modeAdmin = true;
          }
          this.allProfil = res.data;
          console.log(res);
        });
    },
    desactivate: function (profil) {
      let data = { userId: this.user.userId };
      instance
        .put(`/auth/desactivate/users/${profil.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          profil.active = false;
        })
        .catch((err) => console.log(err));
    },
    reactivate: function (profil) {
      let data = { userId: this.user.userId };
      instance
        .put(`/auth/reactivate/users/${profil.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          profil.active = true;
        })
        .catch((err) => console.log(err));
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
.page-profils {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -130px;
}

h1 {
  text-align: center;
  margin-bottom: 35px;
}

.return-button {
  position: absolute;
  font-size: 35px;
  cursor: pointer;
  color: grey;
  margin: 25px 0 0 30px;
}

.return-button:hover {
  color: rgb(71, 71, 71);
}

.pointer-cursor {
  font-size: 17px;
  cursor: pointer;
  width: fit-content;
  color: darkgray;
}

.pointer-cursor:hover {
  color: rgb(71, 71, 71);
}

.profil-box {
  margin: auto;
  border-radius: 10px;
  padding: 15px;
  width: fit-content;
  background-color: rgb(231, 231, 231);
}

.edit-profil-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.edit-profil-box p {
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: bold;
  color: blue;
}

.name-edit-box {
  font-size: 20px;
  font-weight: bold;
  color: blue;
}

.profil-box button {
  margin-top: 10px;
  margin-right: 15px;
  padding: 5px;
  border-radius: 15px;
  cursor: pointer;
  background-color: white;
}

.admin-logo {
  color: gold;
}

.image_profil {
  margin: 10px 0;
  width: 320px;
  border: 0.5px solid lightgrey;
}

.buttonGriseProfil {
  opacity: 0.5;
}

.alert_condition {
  font-size: 14px;
  color: rgb(204, 92, 129);
}

.profil-list {
  display: flex;
  justify-content: space-evenly;
  border-radius: 15px;
  background-color: white;
  width: 340px;
  margin: 5px 25px;
  padding: 0px;
}

.profil-list p {
  font-weight: bold;
}
.info-profil {
  font-weight: 400;
  font-size: 14px;
  color: blue;
}

.status-profil-true {
  color: green;
  height: 25px;
  margin: 15px;
}

.status-profil-false {
  color: red;
  height: 25px;
  margin: 15px;
}

</style>