import { type MaybeRef, type ComponentPublicInstance, type MaybeRefOrGetter } from 'vue'

export interface ConfigurableWindow {
  /*
   * Specify a custom `window` instance, e.g. working with iframes or in testing environments.
   */
  window?: Window
}

export interface ConfigurableDocument {
  /*
   * Specify a custom `document` instance, e.g. working with iframes or in testing environments.
   */
  document?: Document
}

export type VueInstance = ComponentPublicInstance
export type MaybeElement = Window | Document | HTMLElement | SVGElement | undefined | null

export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>

export type TargetRef = MaybeElementRef<MaybeElement> | MaybeRef<EventTarget>
