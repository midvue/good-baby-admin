import http from '@mid-vue/http-client'
import { type Dict, type DictResp } from './types'

/**
 * 获取字典列表
 * @param data 参数
 */
export const getDictList = (data = {}) => {
  const option = {
    url: '/dict/page',
    data: data
  }
  return http.post<DictResp>(option)
}

/**
 * 添加字典
 * @param {Dict} data 参数
 */
export const addDict = (data: Partial<Dict>) => {
  const option = {
    url: '/dict/create',
    data
  }
  return http.post<Dict>(option)
}

/**
 * 更新字典
 * @param {Dict} data 参数
 */
export const updateDict = (data: Partial<Dict>) => {
  const option = {
    url: '/dict/update',
    data
  }
  return http.put(option)
}

/**
 * 删除字典
 * @param {Dict} data 参数
 */
export const deleteDict = (data = {}) => {
  const option = {
    url: '/dict/delete/',
    params: data
  }
  return http.delete(option)
}
