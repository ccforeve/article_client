import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
    check_visitor: false,
    surplus_profit: null,
  },
  mutations: {
    setTokenAndUser(state, user) {
      state.token = user.meta.access_token
      state.user = user
    },
    checkVisitor (state) {
      state.check_visitor = !state.check_visitor
    },
    updateSurplusProfit (state, profit) {
      state.surplus_profit = profit
    }
  },
  actions: {

  }
})
