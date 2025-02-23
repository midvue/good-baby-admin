import { onBeforeUnmount, onMounted } from 'vue'

type visibleCbFunc = () => void

/**
 * 判断页面是否可见或者不可见
 * @example
 * ```ts
 *   let {onPageShow,onPageHidden}=usePageVisibility()
 *   //页面显示可见
 *   onPageShow(()=>{})
 *   //页面隐藏
 *   onPageHidden(()=>{})
 * ```
 */
export const usePageVisibility = () => {
  let onShowCb: visibleCbFunc
  let onHiddenCb: visibleCbFunc
  const onPageShow = (cb: visibleCbFunc) => {
    onShowCb = cb
  }
  const onPageHidden = (cb: visibleCbFunc) => {
    onHiddenCb = cb
  }

  const onVisibilitychangeListener = () => {
    if (document.visibilityState === 'hidden') {
      onHiddenCb && onHiddenCb()
      return
    }
    onShowCb && onShowCb()
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilitychangeListener)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibilitychangeListener)
  })

  return {
    onPageShow,
    onPageHidden,
  }
}
