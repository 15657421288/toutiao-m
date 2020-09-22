import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'
Vue.use(Vuex)
const TOKEN = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    user: getItem(TOKEN)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      setItem(TOKEN, state.user)
    }
  },
  actions: {},
  modules: {}
})
