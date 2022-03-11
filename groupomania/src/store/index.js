import { createStore } from 'vuex'
const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/'
});

let user = localStorage.getItem('user');
if (!user) {
  user = {
    uuid: '',
    token: ''
  };
} else {
  try {
    user = JSON.parse(user);
  } catch (ex) {
    user = {
      uuid: '',
      token: ''
    };
  }
}

export default createStore({
  state: {
    status: '',
    user: user,
    userInfos: {
      name: '',
      email: '',
      uuid: '',
      imageUrl: '',
      isAdmin: '',
    },
  },
  getters: {

  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
          uuid: '',
          token: ''
      }
      localStorage.removeItem('user');
    },
  },
  actions: {
    loginAccount: ({ commit }, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/auth/login', userInfos)
          .then(function (response) {
            commit('logUser', response.data);
            commit('userInfos', response.data);
            commit('setStatus', 'logged');
            resolve(response);
          })
          .catch(function (error) {
            commit('setStatus', 'error_login');
            reject(error);
          });
      });
    },
    createAccount: ({ commit }, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instance.post('/auth/register', userInfos)
          .then(function (response) {
            commit('setStatus', 'created');
            resolve(response);
          })
          .catch(function (error) {
            commit('setStatus', 'error_create');
            reject(error);
          });
      });
    },
    
  }
})
modules: {

}
