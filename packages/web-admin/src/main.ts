import { createApp } from 'vue'
import Http from '@mid-vue/http-client'
import { useRouter } from '@/router'
import { useStore } from '@/store'
import { useElementPlus } from '@/lib/elementPlus'
import emUI from '@/components'
import { userDirective } from '@/directive'
import icons from '@/icons'
import App from './App.vue'
import { getToken } from './utils'
import '@/styles/base.scss'
import 'virtual:svg-icons-register'

//初始化配置
Http.init({
  baseURL: '/api',
  token: () => getToken(),
  showErrorMsg: (msg) => $EmMsg.error(msg)
})

const app = createApp(App)

useRouter(app)
useElementPlus(app)
useStore(app)
userDirective(app)
app.use(emUI)
app.use(icons)
app.mount('#app')
