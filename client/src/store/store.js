import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import post from './modules/post';
import shared from './modules/shared';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    post,
    shared
  }
});
