import { defineStore } from 'pinia'
import { type loginReq, type UserInfo } from '@/api/user/types'
import { getInfo, login } from '@/api/user/userApi'
import { store } from '@/store'
import { getUserInfo, setToken, setUserInfo } from '@/utils/storage'

interface userStore {
  userInfo: Partial<UserInfo> | null
  username: string
  token?: string
}

export const useUserStore = defineStore('app-user', {
  state: (): userStore => ({
    userInfo: getUserInfo() || {},
    username: 'vite',
    // token
    token: undefined
  }),
  getters: {},
  actions: {
    /**
     * @description: 根据账户密码获取token
     */
    async getToken(loginReq: loginReq) {
      const res = await login(loginReq)
      if (res && res.data) {
        setToken(res.data.token)
        return await this.getInfo()
      } else {
        return res
      }
    },
    // 根据token获取用户信息
    async getInfo() {
      return getInfo().then((res) => {
        const { data, code, msg } = res
        this.userInfo = data
        setUserInfo(data)
        return { msg, code }
      })
    },

    async logout() {
      return true
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
