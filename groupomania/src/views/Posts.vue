<template>
  <div>
    <div @click="goToProfile" class="goToProfile">
      <p>
        bonjour <span>{{ user }}</span>
      </p>
      <img class="img-profil" :src="image" />
    </div>
    <div>
      <p @click="switchToCreatePost">create</p>
      <div v-if="mode == 'create'">
        <input
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
    <div
      class="posts-box"
      v-for="post in posts.slice().reverse()"
      :key="post.uuid"
    >
      <div v-if="mode == 'view'">
        <button @click="deletePost(post)">delete post</button>
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
        <p>{{ likes }}</p>
        <button @click="chooseLike(post)">👍</button>
        <p>{{ dislikes }}</p>
        <button @click="chooseDislike(post)">👎</button>
      </div>
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
  name: "posts",
  data: function () {
    return {
      mode: "view",
      user: this.$store.state.userInfos.name,
      email: this.$store.state.userInfos.email,
      image: this.$store.state.userInfos.imageUrl,
      admin: this.$store.state.userInfos.isAdmin,
      posts: [],
      post: [],
      newPost: null,
      newImage: null,
      likes: 0,
      dislikes: 0,
    };
  },

  created: async function () {
    await instance
      .get("/posts/")
      .then((res) => {
        this.posts = res.data;
      })
      .catch((err) => console.log(err));

        let data = JSON.parse(localStorage.getItem('user'))
        console.log(data.email)

    await instance
      .get("/auth/myprofile", {email: data.email})
      .then((res) => {
        this.user = data.name;
        this.image = data.imageUrl;
        this.email = data.email;
        this.admin = data.name;
      })
      .catch((err) => console.log(err));

      
  },


  test: async function () {
    console.log('test')
  },

  // updateLike: async function (post) {
  //   this.post = post;
  //   try {
  //     const allLikes = await instance.get(`/likes/posts/${this.post.uuid}`);
  //     const allDislikes = await instance.get(
  //       `/likes/dislikes/posts/${this.post.uuid}`
  //     );

  //     this.likes = allLikes.data;
  //     this.dislikes = allDislikes.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  mounted: function () {
    if (this.$store.state.user.uuid == "") {
      this.$router.push("/");
      return;
    }
  },
  computed: {
    // likeAndDislikeChoice: async function (post) {
    //   this.post = post;
    //   try {
    //     const allLikes = await instance.get(`/likes/posts/${this.post.uuid}`);
    //     const allDislikes = await instance.get(
    //       `/likes/dislikes/posts/${this.post.uuid}`
    //     );

    //     this.likes = allLikes.data;
    //     this.dislikes = allDislikes.data;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    validatedfields: function () {
      if (this.mode == "create") {
        if (this.newPost != null) {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["userInfos"]),
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
      formData.append("userUuid", this.$store.state.userInfos.uuid);
      formData.append("body", this.newPost);
      formData.append("imagePost", this.newImage);

      await instance
        .post("/posts/", formData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    deletePost: async function (post) {
      this.post = post;
      let data = { email: this.email };
      await instance
        .delete(`/posts/${this.post.uuid}`, { data })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },

    chooseLike: async function (post) {
      this.post = post;
      let data = {
        userUuid: this.$store.state.userInfos.uuid,
        like: true,
        dislike: false,
      };
      await instance
        .post(`/likes/posts/${this.post.uuid}`, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    chooseDislike: async function (post) {
      this.post = post;
      let data = {
        userUuid: this.$store.state.userInfos.uuid,
        like: true,
        dislike: false,
      };
      await instance
        .post(`/likes/posts/${this.post.uuid}`, data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    updateLike: async function (post) {
      this.post = post;
      await instance
        .get(`/likes/posts/${this.post.uuid}`)
        .then((res) => {
          this.likes = res.length;
        })
        .catch((err) => console.log(err));
      // await instance.get(
      //   `/likes/dislikes/posts/${this.post.uuid}`
      // ).then((res) => {
      //   console.log(res);
      //   this.dislikes = res.length
      // })
      // .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
.goToProfile {
  display: flex;
  max-width: fit-content;
}

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