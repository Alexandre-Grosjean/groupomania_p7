import { createStore } from 'vuex'
const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
});

let localUser = localStorage.getItem('user')
if (!localUser) {
  localUser = {
    userId: -1,
    token: ''
  }
}
else {
  try {
    localUser = JSON.parse(localUser)
    instance.defaults.headers.common['authorization'] = localUser.token;
  } catch (ex) {
    localUser = {
      userId: -1,
      token: ''
    }
  }
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
        token: '',
        userImage: '',
        userName: '',
      }
      localStorage.removeItem('user');
    },
  },
  actions: {
    setUser: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', user)
          .then(async function (res) {
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
