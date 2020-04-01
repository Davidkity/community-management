import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import app from "./modules/app";
import home from "./modules/home";
import common from "./modules/common";
import community from "./modules/community";
import permission from "./modules/permission";

export default new Vuex.Store({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    app,
    home,
    common,
    community,
    permission
  }

});
