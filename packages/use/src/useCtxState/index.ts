import { getCurrentInstance, reactive } from 'vue'
import type { ComponentInternalInstance } from 'vue'

type CtxComponentInternalInstance = ComponentInternalInstance & {
  provides: Record<string, any>
  type: {
    name?: string
    __scopeId?: string
    __name?: string
  }
}
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type IStateTuple<T> = readonly [
  Readonly<T>,
  (state: DeepPartial<T> | ((newState: T) => void)) => void,
]
/**
 * 定义当前组件作用域的共享数据
 * @param data - 需要共享的数据
 * @returns  [state, setState]
 * @example
 * ```ts
 * // state: 共享数据的只读代理
 * const [state, setState] = defineCtxState({ count: 0 })
 *
 * //setState: 更新共享数据的方法,会合并旧数据
 * setState({ count: 2 })
 * //推荐函数写法
 * setState((state) => {state.count = 2})
 *
 * ```
 *
 */
export const defineCtxState = <T extends Record<string, any>>(data: T) => {
  const state = reactive(data) as T
  const setState = (newState: DeepPartial<T> | ((newState: T) => void)) => {
    if (typeof newState === 'function') {
      newState(state as T)
      return
    }
    Object.assign(state, newState)
  }
  const stateTuple = [state as T, setState] as const
  const instance = getCurrentInstance() as CtxComponentInternalInstance
  if (!instance) {
    console.error('useCtxState must be called within a setup function')
    return stateTuple
  }
  const { provides = {}, uid, type } = instance
  const key = `state_${uid}_${type.name || type.__name || ''}`
  provides[key] = stateTuple
  return stateTuple
}

/**
 * 获取当前组件作用域{@link defineCtxState}定义的共享数据
 *
 * @see defineCtxState
 * @returns  [state, setState]
 * @example
 *
 * ```ts
 * // state: 共享数据的只读代理
 * const [state, setState] = usCtxState({ count: 0 })
 *
 * //setState: 更新共享数据的方法
 * setState({ count: 2 })
 * setState((state) => {state.count = 2})
 *
 * ```
 *
 */
export const useCtxState = <T = Record<string, any>>() => {
  const instance = getCurrentInstance() as CtxComponentInternalInstance
  if (!instance) {
    throw new Error(
      'useCtxState is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup()',
    )
  }
  const { provides = {}, uid, type } = instance
  const key = `state_${uid}_${type.name || type.__name || ''}`
  const stateTuple = provides[key] || []
  return stateTuple as IStateTuple<T>
}
