import router from '@/router'
import { USER_DATA } from '@/utils/const'
import * as cookieUtil from '@/utils/cookieutil'
import {logout} from '@/api/user'
import {Toast} from 'vant'

const SetUserData = 'SetUserData'
const ClearUserData = 'ClearUserData'

export default {
  namespaced: true,
  state: {
    user: JSON.parse(cookieUtil.get(USER_DATA) || null)
  },
  mutations: {
    [SetUserData] (state, userData = {}) {
      state.user = userData
      cookieUtil.set(USER_DATA, JSON.stringify(userData))
    },

    [ClearUserData] (state) {
      state.user = null
      cookieUtil.remove(USER_DATA)
      // resetRouter()
    }

  },
  actions: {
    login ({commit}, data) {
      commit(SetUserData, data)
    },

    logOut ({commit}) {
      logout().then(res => {
        if(res.code === 1) {
          commit(ClearUserData)
          router.push({path: '/login'})
        }
      }).catch(error => {
        Toast('服务器异常: ' + error)
      })
    },
  },

  getters: {
    getUserName (state) {
      return (state.user && state.user.userName) || ''
    }
  }
}
