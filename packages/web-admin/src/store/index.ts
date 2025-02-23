import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

export function useStore(app: App<Element>) {
  app.use(store)
}

export { store }
