import router from '../../router';

import { defaultClient as apolloClient } from '../../main';
import { GET_POSTS, INFINITE_SCROLL_POSTS, SEARCH_POSTS, ADD_POST } from '../../queries';

const state = {
  posts: [],
  searchResults: []
};

const mutations = {
  setPosts: (state, payload) => {
    state.posts = payload;
  },
  setSearchResults: (state, payload) => {
    if (payload !== null) {
      state.searchResults = payload;
    }
  },
  clearSearchResults: (state) => (state.searchResults = [])
};

const actions = {
  getPosts: ({ commit }) => {
    commit('setLoading', true);
    return apolloClient
      .query({
        query: GET_POSTS
      })
      .then(({ data }) => {
        commit('setPosts', data.getPosts);
        commit('setLoading', false);
      })
      .catch((err) => {
        commit('setLoading', false);
        console.error('error: ', err);
      });
  },
  searchPosts: ({ commit }, payload) => {
    return apolloClient
      .query({
        query: SEARCH_POSTS,
        variables: {
          searchTerm: payload
        }
      })
      .then(({ data }) => {
        commit('setSearchResults', data.searchPosts);
      })
      .catch((err) => {
        console.error('error: ', err);
      });
  },
  addPost: ({ commit }, payload) => {
    commit('setLoading', true);
    return apolloClient
      .mutate({
        mutation: ADD_POST,
        variables: payload,
        update: (cache, { data: { addPost } }) => {
          // First read the query you want to update
          const data = cache.readQuery({ query: GET_POSTS });

          // Create updated data
          data.getPosts.unshift(addPost);

          // Write updated data back to query
          cache.writeQuery({
            query: GET_POSTS,
            data
          });
        },
        // optimistic response ensures data is added immediately as we specified for the update function
        optimisticResponse: {
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        },
        // Rerun specified queries after performing the mutation in order to get fresh data
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 2
            }
          }
        ]
      })
      .then(({ data }) => {
        commit('setLoading', false);
        router.push('/');
        console.log('NEW_POST:', data.addPost);
      })
      .catch((err) => {
        commit('setLoading', false);
        console.error('error: ', err);
      });
  }
};

const getters = {
  posts: (state) => state.posts,
  searchResults: (state) => state.searchResults
};

export default {
  state,
  mutations,
  actions,
  getters
};
