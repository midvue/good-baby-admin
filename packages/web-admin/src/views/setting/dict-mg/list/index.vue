<script lang="tsx">
import { defineComponent } from 'vue'
import { defineCtxState } from '@mid-vue/use'
import { getDictList } from '../api'
import { useEditDialog } from './useEditDialog'
import { useList } from './useList'
import { useSearchForm } from './useSearchForm'
import type { DictListState } from '../types'

export default defineComponent({
  name: 'DictMg',
  setup() {
    const [state] = defineCtxState<DictListState>({
      listLoading: false,
      dictList: [],
      searchForm: {},
      pagination: {
        current: 1,
        size: 20,
        total: 0
      }
    })

    //获取用户列表
    const getSearchList = () => {
      const params = Object.assign({}, state.searchForm, state.pagination)
      state.listLoading = true
      getDictList(params)
        .then((res) => {
          state.listLoading = false
          state.dictList = res.list || []
          state.pagination.total = res.count
        })
        .catch(() => {
          state.listLoading = false
        })
    }

    const renderSearch = useSearchForm(getSearchList)
    const { render: renderDialog, openDialog } = useEditDialog(getSearchList)
    const renderList = useList(openDialog, getSearchList)

    return () => (
      <div class='dict-mg'>
        {renderSearch()}
        {renderList()}
        {renderDialog()}
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
