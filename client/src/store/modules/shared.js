const state = {
  loading: false,
  authError: null,
  error: null
};

const mutations = {
  setLoading: (state, payload) => {
    state.loading = payload;
  },
  setAuthError: (state, payload) => {
    state.authError = payload;
  },
  setError: (state, payload) => {
    state.error = payload;
  },
  clearError: (state) => (state.error = null)
};

const actions = {};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  authError: (state) => state.authError
};

export default {
  state,
  mutations,
  actions,
  getters
};
