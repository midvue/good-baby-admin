import { useCtxState } from '@mid-vue/use'
import type { DictListState } from '../types'

export const useSearchForm = (getSearchList: () => void) => {
  const [state, setState] = useCtxState<DictListState>()
  const handleSearch = () => {
    getSearchList()
  }
  handleSearch()

  const handleReset = () => {
    setState((state) => (state.searchForm = {}))
    getSearchList()
  }

  return () => (
    <div class='search-form'>
      <el-form class='el-form' model={state.searchForm} label-width='100px'>
        <el-form-item label='字典id'>
          <el-input v-model={state.searchForm.id} placeholder='请输入用户id' clearable />
        </el-form-item>
        <el-form-item label='字典名称'>
          <el-input v-model={state.searchForm.name} placeholder='请输入用户名称' clearable />
        </el-form-item>
        <el-form-item label='字典编码'>
          <el-input v-model={state.searchForm.code} placeholder='请输入用户名称' clearable />
        </el-form-item>
        <el-form-item>
          <el-button type='primary' onClick={() => handleSearch()}>
            查询
          </el-button>
          <el-button onClick={() => handleReset()}>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  )
}
