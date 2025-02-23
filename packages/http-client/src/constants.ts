/*
 *请求方法常量
 */
export const EnumMethod = {
  GET: 'get',
  POST: 'post',
  put: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const

/*
 *请求方法常量
 */
export enum EnumContentType {
  URL_ENCODED = 'application/x-www-form-urlencoded',
  JSON = 'application/json',
  FORM = 'multipart/form-data',
  TEXT = 'text/html',
}
