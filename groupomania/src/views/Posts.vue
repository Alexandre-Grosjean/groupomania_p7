<template>
  <div class="posts-page">
    <!-- go to profils -->
    <div class="salutation-Profile">
      <p>
        Bonjour
        <span @click="goToProfile" class="name-profile">{{
          this.user.userName
        }}</span>
      </p>
      <img
        @click="goToProfile"
        class="link-profile"
        :src="this.user.userImage"
        alt="👨‍💻"
      />
    </div>

    <!-- post creation -->
    <div>
      <fa
        icon="plus"
        class="createPost"
        @click="switchToCreatePost"
        v-if="mode == 'view'"
      />
      <div class="create-box" v-if="mode == 'create'">
        <textarea
          v-model="newPost"
          type="text"
          placeholder="quel sera ton message"
        />
        <input type="file" name="imagePost" ref="file" @change="onFileChange" />
        <div class="button-create-box">
          <button
            @click="createNewPost"
            :class="{ buttonGrisePost: !validatedfields }"
          >
            valider
          </button>
          <button @click="switchToCancelCreatePost">annuler</button>
        </div>
      </div>
    </div>

    <div>
      <fa icon="circle-up" class="scroll-top" @click="moveUp" />
    </div>
    <!-- list of posts -->
    <div
      class="posts-box"
      v-for="post in posts.slice().reverse()"
      :key="post.uuid"
    >
      <div v-if="post.user.active === true">
        <div class="posts-user-box">
          <img class="img-profil" :src="post.user.imageUrl" alt="img-Profil" />
          <p v-if="post.user.isAdmin === true" class="admin-post">
            {{ post.user.name }}
          </p>
          <p v-else class="user-post">{{ post.user.name }}</p>
          <p>
            {{ post.createdAt.split("T").join(" | ").split(".000Z").join("") }}
          </p>
        </div>
        <div v-if="mode == 'view'" class="deletePost">
          <fa icon="trash" class="trash-icon" @click="deletePost(post)" />
        </div>
        <div class="post-img-box" v-if="post.imageUrl !== null">
          <img class="imgOfPost" :src="post.imageUrl" alt="image de post" />
        </div>
        <div class="posts-body-text">
          <p>{{ post.body }}</p>
        </div>
        <div></div>
        <div class="posts-likes-box">
          <div v-if="post.likes !== [] && allLikes">
            <p class="hide-p">{{ calculateLikes(post) }}</p>
            <p class="hide-p">{{ calculateDislikes(post) }}</p>
            <div class="like-box">
              <p>
                <fa
                  icon="thumbs-up"
                  class="like-Choice"
                  @click="chooseLike(post)"
                />
                {{ likes }}
              </p>
              <p>
                <fa
                  icon="thumbs-down"
                  class="dislike-Choice"
                  @click="chooseDislike(post)"
                />
                {{ dislikes }}
              </p>
              <p>
                <fa
                  @click="switchToViewComment"
                  class="comment-view"
                  icon="comment"
                />
                {{ post.comment.length }}
              </p>
            </div>
            <div @click="switchToCreateComment" class="create-comment-button">
              <p>
                <fa icon="comment" class="create-comment" />
                commenter
              </p>
            </div>
            <div class="create-comment" v-if="mode == 'comment'">
              <textarea
                v-model="newComment"
                type="text"
                placeholder="quel sera ton commentaire"
              />
              <div class="button-create-box">
                <button
                  @click="createNewComment(post)"
                  :class="{ buttonGrisePost: !validatedCommentfields }"
                >
                  valider
                </button>
                <button @click="switchToCancelComment">annuler</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="commentMode == 'comment'">
          <div
            v-for="comment in post.comment"
            :key="comment.id"
            class="comment-box"
          >
            <div class="comment-name">
              <p>{{ comment.userName }}</p>
              <fa
                @click="deleteComment(comment)"
                icon="trash"
                class="trash-icon"
              />
            </div>
            <div class="comment-body">
              <p>{{ comment.body }}</p>
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
  name: "posts",
  data: function () {
    return {
      mode: "view",
      commentMode: "view",
      posts: [],
      post: [],
      newPost: null,
      newComment: null,
      newImage: null,
      allLike: [],
      allDislike: [],
      likes: 0,
      dislikes: 0,
    };
  },

  created: async function () {
    let data = { userId: this.user.userId };
    await instance
      .get("/posts/", {
        data,
        headers: {
          authorization: "Bearer " + this.user.token,
        },
      })
      .then((res) => {
        this.posts = res.data;
      })
      .catch((err) => console.log(err));
  },

  mounted: async function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
  },

  computed: {
    allLikes: async function () {
      let i;
      let a;
      let b;
      let c;
      let arrayLikes = [];
      let arrayDislikes = [];
      let allLikes = [];
      let allDislikes = [];
      for (i = 0; i < this.posts.length; i++) {
        for (a = 0; a < this.posts[i].likes.length; a++) {
          if (this.posts[i].likes[a].userLike == true) {
            arrayLikes.push(this.posts[i].uuid);
          }

          if (this.posts[i].likes[a].userDislike == true) {
            arrayDislikes.push(this.posts[i].uuid);
          }
        }
      }

      for (b = 0; b < arrayLikes.length; b++) {
        arrayLikes[b];
        allLikes.push(arrayLikes[b]);
      }
      for (c = 0; c < arrayDislikes.length; c++) {
        arrayDislikes[c];
        allDislikes.push(arrayDislikes[c]);
      }
      this.allLike = allLikes;
      this.allDislike = allDislikes;
    },
    validatedfields: function () {
      if (this.mode == "create") {
        if (this.newPost != null) {
          return true;
        } else {
          return false;
        }
      }
    },
    validatedCommentfields: function () {
      if (this.mode == "comment") {
        if (this.newComment != null) {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapGetters({ user: "getUser" }),
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
    switchToCreateComment: function () {
      this.mode = "comment";
      this.commentMode = "comment";
    },
    switchToCancelComment: function () {
      this.mode = "view";
    },
    switchToViewComment: function () {
      if (this.commentMode == "comment") {
        this.commentMode = "view";
      } else if (this.commentMode == "view") {
        this.commentMode = "comment";
      }
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
        .post("/posts/", formData, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          document.location.reload();
        })
        .catch((err) => console.log(err));
    },
    deletePost: async function (post) {
      this.post = post;
      let data = { userId: this.user.userId };
      await instance
        .delete(`/posts/${this.post.uuid}`, {
          data,
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          document.location.reload();
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    createNewComment: async function (post) {
      let data = {
        userId: this.user.userId,
        body: this.newComment,
      };
      await instance
        .post(`comment/posts/${post.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          document.location.reload();
        })
        .catch((err) => console.log(err));
    },
    deleteComment: async function (comment) {
      let data = { userId: this.user.userId };
      await instance
        .delete(`/comment/${comment.id}`, {
          data,
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          document.location.reload();
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    calculateLikes: async function (post) {
      let result = 0;
      let i;
      for (i = 0; i < this.allLike.length; i++) {
        if (post.uuid == this.allLike[i]) {
          result++;
        }
      }
      this.likes = result;
    },
    calculateDislikes: async function (post) {
      let result = 0;
      let i;
      for (i = 0; i < this.allDislike.length; i++) {
        if (post.uuid == this.allDislike[i]) {
          result++;
        }
      }
      this.dislikes = result;
    },
    chooseLike: async function (post) {
      this.post = post;
      let data = {
        userId: this.user.userId,
        like: true,
        dislike: false,
      };
      await instance
        .post(`/likes/posts/${this.post.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          document.location.reload();
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
        .post(`/likes/posts/${this.post.uuid}`, data, {
          headers: {
            authorization: "Bearer " + this.user.token,
          },
        })
        .then((res) => {
          console.log(res);
          document.location.reload();
        })
        .catch((err) => console.log(err));
    },
    moveUp: async function () {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  background-color: rgb(239, 242, 251);
}

.posts-page {
  margin-top: -150px;
}

.salutation-Profile {
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-right: 15px;
  font-weight: 500;
}

.link-profile {
  width: 35px;
  height: 35px;
  padding: 2px;
  border: 0.5px solid grey;
  border-radius: 50%;
  cursor: pointer;
}

.name-profile {
  margin-right: 5px;
  font-size: 18px;
  font-weight: bold;
  color: blue;
  cursor: pointer;
}

.createPost {
  position: absolute;
  cursor: pointer;
  margin: -40px 0 0 10px;
  padding: 0px;
  font-size: 35px;
  color: gray;
}

.createPost:hover {
  color: blue;
}

.create-box {
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background-color: rgb(224, 224, 224);
  max-width: 340px;
  margin: 0 5px 0 5px;
}

.create-box textarea {
  height: 70px;
  max-width: 340px;
  margin-bottom: 15px;
  border: none;
  padding: 2px;
  border-radius: 5px;
}

.button-create-box button {
  display: unset;
  margin-top: 10px;
  margin-right: 15px;
  padding: 5px;
  border-radius: 15px;
  background-color: white;
}

.hide-p {
  display: none;
}

.buttonGrisePost {
  opacity: 0.5;
}

.posts-box {
  margin: 20px;
  padding-bottom: 1px;
  width: 350px;
  border-radius: 10px;
  background-color: gainsboro;
}

.posts-user-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 5px 0 15px;
  margin: 0;
  font-size: 12px;
}

.admin-post {
  color: rgb(187, 74, 74);
  font-size: 20px;
  font-weight: bold;
  padding-left: 51px;
}

.user-post {
  font-size: 20px;
  font-weight: bold;
  padding-left: 51px;
}

.img-profil {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 0.5px solid grey;
  border-radius: 50%;
}

.deletePost {
  position: absolute;
  height: fit-content;
  margin: -32px 0 0 320px;
}

.trash-icon {
  cursor: pointer;
  font-size: 16px;
  margin-top: 0px;
  color: rgb(220, 94, 94);
}

.trash-icon:hover {
  color: rgb(221, 66, 66);
}

.imgOfPost {
  height: 350px;
  width: 350px;
  background-color: white;
}

.posts-body-text {
  margin: -5px 0;
  padding: 7px 10px;
  background-color: white;
  border-top: 2px solid rgb(239, 242, 251);
  font-weight: 500;
}

.posts-likes-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.like-box {
  display: flex;
  flex-direction: row;
  margin: -10px;
  max-width: 350px;
}

.like-box p {
  padding: 0 35px;
  font-size: 16px;
  font-weight: bold;
}

.like-Choice {
  font-size: 25px;
  padding-right: 7px;
  margin: 5px;
  color: blue;
  cursor: pointer;
}

.like-Choice:hover {
  color: rgb(36, 149, 220);
}

.dislike-Choice {
  font-size: 25px;
  padding-right: 7px;
  margin-top: 5px;
  color: rgb(226, 103, 103);
  cursor: pointer;
}

.dislike-Choice:hover {
  color: rgb(221, 66, 66);
}

.comment-view {
  font-size: 25px;
  padding-right: 7px;
  margin-top: 5px;
  color: rgb(255, 255, 255);
  cursor: pointer;
}

.comment-view:hover {
  color: rgb(165, 155, 193);
}

.comment-box {
  margin: 10px 10px;
  padding: 10px;
  border-radius: 10px;
}

.create-comment {
  font-size: 14px;
  cursor: pointer;
}

.create-comment-button {
  cursor: pointer;
  width: 300px;
}

.create-comment-button:hover {
  color: rgb(113, 113, 113);
}

.create-comment textarea {
  width: 325px;
  height: 30px;
  border: none;
  border-radius: 5px;
}

.comment-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4px;
  margin: 0px;
  height: fit-content;
  font-weight: bold;
  border-top: 1px solid rgb(184, 184, 184);
}

.comment-body {
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  margin: 0px;
  padding: 5px 5px;
}

.scroll-top {
  color: rgb(171, 171, 171);
  opacity: 0.6;
  z-index: 999;
  cursor: pointer;
  width: 50px;
  height: 50px;
  position: fixed;
  margin: 620px 0 0 330px;
}

.scroll-top:hover {
  color: grey;
}

@media screen and (min-width: 580px) {
  .create-box {
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background-color: rgb(224, 224, 224);
    max-width: 550px;
    margin: 0 5px 0 5px;
  }

  .create-box textarea {
    height: 50px;
    max-width: 550px;
    margin-bottom: 15px;
  }
  .deletePost {
    position: absolute;
    height: fit-content;
    margin: -32px 0 0 520px;
  }

  .posts-box {
    margin: 20px;
    width: 550px;
    border-radius: 10px;
    background-color: gainsboro;
  }

  .imgOfPost {
    height: 350px;
    width: 550px;
    background-color: white;
  }

  .like-box {
    display: flex;
    flex-direction: row;
    margin: -10px;
  }

  .create-comment-button {
    margin: 0 0 0 -80px;
    padding: 0px;
  }

  .create-comment textarea {
    height: 30px;
    border: none;
    border-radius: 5px;
    max-width: 320px;
  }
  .scroll-top {
    color: rgb(193, 193, 193);
    opacity: 0.6;
    z-index: 999;
    cursor: pointer;
    width: 50px;
    height: 50px;
    position: fixed;
    margin: 650px;
  }
}
</style>