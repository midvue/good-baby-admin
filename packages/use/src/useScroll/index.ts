import { computed, reactive, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { debounce, throttle as throttleFn, isClient } from '@mid-vue/shared'
import { onMountedOrActivated } from '../onMountedOrActivated'
import {
  type ConfigurableWindow,
  type MaybeElement,
  type MaybeElementRef,
  type VueInstance,
} from '../types'
import { useEventListener } from '../useEventListener'

const noop = () => ({})

function unrefElement<T extends MaybeElement>(elRef: MaybeElementRef<T>) {
  const plain = toValue(elRef)
  return (plain as unknown as VueInstance)?.$el ?? plain
}

export interface UseScrollOptions extends ConfigurableWindow {
  /**
   * Throttle time for scroll event, it’s disabled by default.
   *
   * @defaultValue  0
   */
  throttle?: number

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
   *
   * @defaultValue  200
   */
  idle?: number

  /**
   * Offset arrived states by x pixels
   *
   */
  offset?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }

  /**
   * Trigger it when scrolling.
   *
   */
  onScroll?: (e: Event) => void

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: (e: Event) => void

  /**
   * Listener options for scroll event.
   *
   * @defaultValue  `{capture: false, passive: true}`
   */
  eventListenerOptions?: AddEventListenerOptions

  /**
   * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
   * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
   *
   * @defaultValue  'auto'
   */
  behavior?: MaybeRefOrGetter<ScrollBehavior>

  /**
   * On error callback
   *
   * Default log error to `console.error`
   */
  onError?: (error: unknown) => void
}

/**
 * We have to check if the scroll amount is close enough to some threshold in order to
 * more accurately calculate arrivedState. This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

/**
 * Reactive scroll.
 *
 * @see https://vueuse.org/useScroll
 */

const defaultWindow = isClient ? window : undefined

/**
 * 监听页面布局滚动 事件
 * @param element  -监听的元素,支持window,document,HTMLElement 以及 Ref引用
 * @param options -{@link UseScrollOptions}
 * @returns x,y轴滚动距离,方向,状态,以及是否到达边界
 */
export function useScroll(element: MaybeElementRef<MaybeElement>, options: UseScrollOptions = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    behavior = 'auto',
    window = defaultWindow,
    onError = (e) => {
      console.error(e)
    },
  } = options

  const internalX = ref(0)
  const internalY = ref(0)

  // Use a computed for x and y because we want to write the value to the refs
  // during a `scrollTo()` without firing additional `scrollTo()`s in the process.
  const x = computed({
    get() {
      return internalX.value
    },
    set(x) {
      scrollTo(x, undefined)
    },
  })

  const y = computed({
    get() {
      return internalY.value
    },
    set(y) {
      scrollTo(undefined, y)
    },
  })

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    if (!window) return

    const _element = toValue(element)
    if (!_element) return
    ;(_element instanceof Document ? window.document.body : _element)?.scrollTo({
      top: toValue(_y) ?? y.value,
      left: toValue(_x) ?? x.value,
      behavior: toValue(behavior),
    })
    const scrollContainer =
      (_element as Window)?.document?.documentElement ||
      (_element as Document)?.documentElement ||
      (_element as Element)
    if (x.value != null) internalX.value = scrollContainer.scrollLeft
    if (y.value != null) internalY.value = scrollContainer.scrollTop
  }

  const isScrolling = ref(false)
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })

  const onScrollEnd = (e: Event) => {
    // dedupe if support native scrollend event
    if (!isScrolling.value) return

    isScrolling.value = false
    directions.left = false
    directions.right = false
    directions.top = false
    directions.bottom = false
    onStop(e)
  }

  const onScrollEndDebounced = debounce(onScrollEnd, throttle + idle)

  const setArrivedState = (
    target: HTMLElement | SVGElement | Window | Document | null | undefined,
  ) => {
    if (!window) return

    const el: Element = ((target as Window)?.document?.documentElement ||
      (target as Document)?.documentElement ||
      unrefElement(target as HTMLElement | SVGElement)) as Element

    const { display, flexDirection } = getComputedStyle(el)

    const scrollLeft = el.scrollLeft
    directions.left = scrollLeft < internalX.value
    directions.right = scrollLeft > internalX.value

    const left = Math.abs(scrollLeft) <= (offset.left || 0)
    const right =
      Math.abs(scrollLeft) + el.clientWidth >=
      el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.left = right
      arrivedState.right = left
    } else {
      arrivedState.left = left
      arrivedState.right = right
    }

    internalX.value = scrollLeft

    let scrollTop = el.scrollTop

    // patch for mobile compatible
    if (target === window.document && !scrollTop) scrollTop = window.document.body.scrollTop

    directions.top = scrollTop < internalY.value
    directions.bottom = scrollTop > internalY.value
    const top = Math.abs(scrollTop) <= (offset.top || 0)
    const bottom =
      Math.abs(scrollTop) + el.clientHeight >=
      el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    /**
     * reverse columns and rows behave exactly the other way around,
     * bottom is treated as top and top is treated as the negative version of bottom
     */
    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.top = bottom
      arrivedState.bottom = top
    } else {
      arrivedState.top = top
      arrivedState.bottom = bottom
    }

    internalY.value = scrollTop
  }

  const onScrollHandler = (e: Event) => {
    if (!window) return

    const eventTarget = ((e.target as Document).documentElement ?? e.target) as HTMLElement

    setArrivedState(eventTarget)

    isScrolling.value = true
    onScrollEndDebounced(e)
    onScroll(e)
  }

  useEventListener('scroll', throttle ? throttleFn(onScrollHandler, throttle) : onScrollHandler, {
    target: element,
    ...eventListenerOptions,
  })

  onMountedOrActivated(() => {
    try {
      const _element = toValue(element)

      if (!_element) return
      setArrivedState(_element)
    } catch (e) {
      onError(e)
    }
  })

  useEventListener('scrollend', onScrollEnd, {
    target: element,
    ...eventListenerOptions,
  })

  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element)

      if (window && _element) setArrivedState(_element)
    },
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
