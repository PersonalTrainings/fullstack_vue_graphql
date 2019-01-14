import router from '../../router';

import { defaultClient as apolloClient } from '../../main';
import {
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER
} from '../../queries';

const state = {
  userPosts: [],
  user: null
};

const mutations = {
  setUserPosts: (state, payload) => {
    state.userPosts = payload;
  },
  setUser: (state, payload) => {
    state.user = payload;
  },
  clearUser: (state) => (state.user = null)
};

const actions = {
  getCurrentUser: ({ commit }) => {
    commit('setLoading', true);
    return apolloClient
      .query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        commit('setLoading', false);
        // Add user data to state
        console.log('CURRENT_USER: ', data.getCurrentUser);
        commit('setUser', data.getCurrentUser);
        return data.getCurrentUser;
      })
      .catch((err) => {
        commit('setLoading', false);
        console.error('error: ', err);
      });
  },
  getUserPosts: ({ commit }, payload) => {
    return apolloClient
      .query({
        query: GET_USER_POSTS,
        variables: payload
      })
      .then(({ data }) => {
        commit('setUserPosts', data.getUserPosts);
      })
      .catch((err) => {
        console.error('error: ', err);
      });
  },
  updateUserPost: ({ state, commit }, payload) => {
    return apolloClient
      .mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      })
      .then(({ data }) => {
        const index = state.userPosts.findIndex((post) => post._id === data.updateUserPost._id);
        const userPosts = [
          ...state.userPosts.slice(0, index),
          data.updateUserPost,
          ...state.userPosts.slice(index + 1)
        ];
        commit('setUserPosts', userPosts);
      })
      .catch((err) => {
        console.error('error: ', err);
      });
  },
  deleteUserPost: ({ state, commit }, payload) => {
    commit('setLoading', true);
    return apolloClient
      .mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      })
      .then(({ data }) => {
        const index = state.userPosts.findIndex((post) => post._id === data.deleteUserPost._id);
        const userPosts = [...state.userPosts.slice(0, index), ...state.userPosts.slice(index + 1)];
        commit('setUserPosts', userPosts);
      })
      .catch((err) => {
        console.error('error: ', err);
      });
  },
  signupUser: ({ commit }, payload) => {
    commit('clearError');
    commit('setLoading', true);
    return apolloClient
      .mutate({
        mutation: SIGNUP_USER,
        variables: payload
      })
      .then(({ data }) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signupUser.token);
        // to make sure created method is run in main.js (we run getCurrentUser), reload the page
        router.go();
      })
      .catch((err) => {
        commit('setLoading', false);
        commit('setError', err);
        console.error('error: ', err);
      });
  },
  signinUser: ({ commit }, payload) => {
    commit('clearError');
    commit('setLoading', true);
    return apolloClient
      .mutate({
        mutation: SIGNIN_USER,
        variables: payload
      })
      .then(({ data }) => {
        commit('setLoading', false);
        localStorage.setItem('token', data.signinUser.token);
        // to make sure created method is run in main.js (we run getCurrentUser), reload the page
        router.go();
      })
      .catch((err) => {
        commit('setLoading', false);
        commit('setError', err);
        console.error('error: ', err);
      });
  },
  signOutUser: async ({ commit }) => {
    commit('clearUser');
    localStorage.setItem('token', '');
    // end session
    await apolloClient.resetStore();
    // redirect home - kick users out of private pages (i.e profile)
    router.push('/');
  }
};

const getters = {
  user: (state) => state.user,
  userPosts: (state) => state.userPosts,
  userFavorites: (state) => state.user && state.user.favorites
};

export default {
  state,
  mutations,
  actions,
  getters
};
