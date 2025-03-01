export interface DictResp {
  count: number
  list: Dict[]
}

export interface DictInfo {
  code: string
  name: string
  ext: string
  sort: number
}

export interface Dict {
  id: number
  name: string
  code: string
  list: DictInfo[]
  remark: string
  createTime: number
  updateTime: number
}

export interface DictListState {
  listLoading: boolean
  dictList: Dict[]
  searchForm: Partial<Dict>
  pagination: {
    current: number
    size: number
    total: number
  }
  getSearchList?: () => void
}

export type OpenDialogFunc = (form?: Partial<Dict>) => void
