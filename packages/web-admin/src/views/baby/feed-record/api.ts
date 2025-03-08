import http from '@mid-vue/http-client'
import { type FeedRecord, type FeedRecordResp } from './types'

/**
 * 获取喂养记录列表
 * @param data 参数
 */
export const getFeedRecordList = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/page',
    data: data
  }
  return http.post<FeedRecordResp>(option)
}

/**
 * 添加喂养记录
 * @param {FeedRecord} data 参数
 */
export const addFeedRecord = (data: Partial<FeedRecord>) => {
  const option = {
    url: '/baby/feedRecord/create',
    data
  }
  return http.post<FeedRecord>(option)
}

/**
 * 更新喂养记录
 * @param {FeedRecord} data 参数
 */
export const updateFeedRecord = (data: Partial<FeedRecord>) => {
  const option = {
    url: '/baby/feedRecord/update',
    data
  }
  return http.put(option)
}

/**
 * 删除喂养记录
 * @param {FeedRecord} data 参数
 */
export const deleteFeedRecord = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/delete/',
    params: data
  }
  return http.delete(option)
}
