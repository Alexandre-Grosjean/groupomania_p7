import { createStore } from 'vuex'
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

let localUser = localStorage.getItem('user')
if (!localUser) {
  localUser = {
    userId: -1,
    token: ""
  }
} else {
  localUser = JSON.parse(localUser)
}

export default createStore({
  state: {
    user: localUser
  },
  getters: {
    getUser: state => state.user
  },
  mutations: {
    updateUser(state, payload) {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: ''
      }
      localStorage.removeItem('user');
    },
  },
  actions: {
    setUser: async ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', user)
          .then(function (res) {
            commit('updateUser', res.data);
            resolve(res);
          })
          .catch(function (err) {
            reject(err);
          });
      });
      },
},
  modules: {
  }
})
