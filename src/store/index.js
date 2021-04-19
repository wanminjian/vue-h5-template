import Vue from 'vue'
import Vuex from 'vuex'
import createLoadingPlugin from '../utils/vuex-loading'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default new Vuex.Store({
  plugins: [createLoadingPlugin()],
  state: {
    direction: 'forward'
  },
  getters:[],
  mutations: {
    // 更新页面切换方向
    updateDirection (state, direction) {
      state.direction = direction
    }
  },
  actions: {},
  modules
})

