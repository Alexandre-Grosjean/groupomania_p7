<template>
  <div>
    <!-- go to profils -->
    <div>
      <p @click="goToProfile">👨‍💻</p>
    </div>
  
    <!-- post creation -->
    <div>
      <p @click="switchToCreatePost">➕</p>
      <div v-if="mode == 'create'">
        <textarea
          v-model="newPost"
          type="text"
          placeholder="quel sera ton message"
        />
        <input type="file" name="imagePost" ref="file" @change="onFileChange" />

        <button
          @click="createNewPost"
          :class="{ buttonGrise: !validatedfields }"
        >
          valider
        </button>
        <button @click="switchToCancelCreatePost">annuler</button>
      </div>
    </div>

    <!-- list of posts -->
    <div
      class="posts-box"
      v-for="post in posts.slice().reverse()"
      :key="post.uuid"
    >
      <div v-if="mode == 'view'">
        <p @click="deletePost(post)">🗑️</p>
      </div>
      <div class="posts-user-box">
        <img class="img-profil" :src="post.user.imageUrl" alt="img-Profil" />
        <p>{{ post.user.name }}</p>
        <p>
          {{ post.createdAt.split("T").join(" | ").split(".000Z").join("") }}
        </p>
      </div>
      <div class="post-img-box" v-if="post.imageUrl !== null">
        <img class="imgOfPost" :src="post.imageUrl" alt="image de post" />
      </div>
      <div class="posts-body-text">
        <p>{{ post.body }}</p>
      </div>
      <div class="posts-likes-box">
        <p>{{  }}</p>
        <button @click="chooseLike(post)">👍</button>
        <p>{{  }}</p>
        <button @click="chooseDislike(post)">👎</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const axios = require("axios");
const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

export default {
  name: "posts",
  data: function () {
    return {
      mode: "view",
      posts: [],
      post: [],
      newPost: null,
      newImage: null,
    };
  },

  created: async function () {
    await instance
      .get("/posts/")
      .then((res) => {
        this.posts = res.data;
      })
      .catch((err) => console.log(err));
  },

    mounted: function async () {
    if (this.$store.state.user.userId == -1) {
              this.$router.push("/");
      return;
    }
  },

  computed: {
    validatedfields: function () {
      if (this.mode == "create") {
        if (this.newPost != null) {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapGetters({ user: 'getUser'})
  },

  methods: {
    goToProfile: function () {
      this.$router.push("/profile");
    },
    switchToCreatePost: function () {
      this.mode = "create";
    },
    switchToCancelCreatePost: function () {
      this.mode = "view";
    },
    onFileChange() {
      this.newImage = this.$refs.file.files[0];
    },
    createNewPost: async function () {
      const formData = new FormData();
      formData.append("userId", this.user.userId);
      formData.append("body", this.newPost);
      formData.append("imagePost", this.newImage);

      await instance
        .post("/posts/", formData)
        .then((res) => {
          console.log(res);
          document.location.reload();
        })
        .catch((err) => console.log(err));
    },
    deletePost: async function (post) {
      this.post = post;
      let data = {
        userId: this.user.userId,
      };
      await instance
        .delete(`/posts/${this.post.uuid}`, { data })
        .then((res) => {
          document.location.reload();
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    chooseLike: async function (post) {
      this.post = post;
      let data = {
        userId: this.user.userId,
        like: true,
        dislike: false,
      };
      await instance
        .post(`/likes/posts/${this.post.uuid}`, data)
        .then((res) => {
          console.dir(post);
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    chooseDislike: async function (post) {
      this.post = post;
      let data = {
        userId: this.user.userId,
        like: false,
        dislike: true,
      };
      await instance
        .post(`/likes/posts/${this.post.uuid}`, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
.buttonGrise {
  opacity: 0.5;
}
.posts-box {
  margin: 20px;
  width: 600px;
  border: 2px solid black;
  border-radius: 4px;
  background-color: gainsboro;
}
.posts-user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.img-profil {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.imgOfPost {
  height: 350px;
  width: 590px;
  padding: 5px;
}
</style>