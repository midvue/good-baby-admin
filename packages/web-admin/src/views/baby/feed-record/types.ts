export interface FeedRecordResp {
  count: number
  list: FeedRecord[]
}

export interface FeedRecordInfo {
  code: string
  name: string
  ext: string
  sort: number
}

export interface FeedRecord {
  id: number
  type: string | number
  feedTime: string
  content: string
  remark: string
  createTime: number
  updateTime: number
}

export interface FeedRecordListState {
  listLoading: boolean
  feedRecordList: FeedRecord[]
  searchForm: Partial<FeedRecord>
  pagination: {
    current: number
    size: number
    total: number
  }
  getSearchList?: () => void
}

export type OpenDialogFunc = (form?: Partial<FeedRecord>) => void
