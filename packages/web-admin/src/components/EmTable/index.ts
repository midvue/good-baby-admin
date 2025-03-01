import EmTable from './index.vue'
import type { App } from 'vue'
export * as EmTableType from './types'

EmTable.install = (app: App) => {
  if (EmTable.installed) return
  app.component(EmTable.name!, EmTable)
}
export { EmTable }
export default EmTable
