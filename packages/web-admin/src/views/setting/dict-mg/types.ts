export interface DictResp {
  count: number
  list: Dict[]
}

export interface Dict {
  id: number
  name: string
  code: string
  content: { code: string; name: string; ext: string }[]
  remark: string
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
