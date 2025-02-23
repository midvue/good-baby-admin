import { isRef, onDeactivated, onUnmounted, unref, watch, type WatchStopHandle } from 'vue'
import { isClient } from '@mid-vue/shared'
import { onMountedOrActivated } from '../onMountedOrActivated'
import { type TargetRef } from '../types'

export type UseEventListenerOptions = {
  target?: TargetRef
  capture?: boolean
  passive?: boolean
}

export function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener(
  type: string,
  listener: EventListener,
  options?: UseEventListenerOptions,
): () => void

/**
 * useEventListener 事件监听,支持vue缓存,页面销毁自动回收
 * @param type - 事件类型(scroll, resize, click, etc.)
 * @param listener - 监听函数
 * @param options - 选项
 */
export function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {},
) {
  if (!isClient) {
    return
  }

  const { target = window, passive = false, capture = false } = options

  let cleaned = false
  let attached: boolean

  const add = (target?: TargetRef) => {
    if (cleaned) {
      return
    }

    const element = unref(target)
    if (element && !attached) {
      element.addEventListener(type, listener, {
        capture,
        passive,
      })
      attached = true
    }
  }

  const remove = (target?: TargetRef) => {
    if (cleaned) {
      return
    }
    const element = unref(target)

    if (element && attached) {
      element.removeEventListener(type, listener, capture)
      attached = false
    }
  }

  onUnmounted(() => remove(target))
  onDeactivated(() => remove(target))
  onMountedOrActivated(() => add(target))

  let stopWatch: WatchStopHandle

  if (isRef(target)) {
    stopWatch = watch(target, (val, oldVal) => {
      remove(oldVal)
      add(val)
    })
  }

  /**
   * Clean up the event listener
   */
  return () => {
    stopWatch?.()
    remove(target)
    cleaned = true
  }
}
