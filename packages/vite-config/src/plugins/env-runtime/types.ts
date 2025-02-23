export interface ViteEnvRuntimeOptions {
  /**
   * runtime唯一key,用来区分唯一环境
   */
  key?: RegExp | ((file: string) => boolean)
  /**
   * 需要排除的env变量
   * @example
   * ```ts
   *   excludes:[`import.meta.env.MODE`,`import.meta.env.BASE_URL`,`import.meta.env.PROD`,`import.meta.env.DEV`,`import.meta.env.SSR`]
   * ```
   */
  excludes?: string[]

  ruleResolve?: () => 'development' | 'production' | 'stg' | 'uat' | string
}
