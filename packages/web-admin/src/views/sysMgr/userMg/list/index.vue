<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { getUserList } from '../api'
import { getRoleList } from '../../../../api/role/roleApi'
import { useEditDialog } from './useEditDialog'
import { useList } from './useList'
import { useSearchForm } from './useSearchForm'
import type { UserListState } from '../types'

export default defineComponent({
  name: 'UserMg',
  setup() {
    const state: UserListState = reactive({
      listLoading: false,
      userList: [],
      searcForm: {},
      pagination: {
        current: 1,
        size: 20,
        total: 0
      },
      roleList: []
    })

    //获取用户列表
    const getSearchList = () => {
      const params = Object.assign({}, state.searcForm, state.pagination)
      state.listLoading = true
      getUserList(params)
        .then((res) => {
          state.listLoading = false
          state.userList = res.list || []
          state.pagination.total = res.count
        })
        .catch(() => {
          state.listLoading = false
        })
    }

    const getSelectRoleList = async () => {
      state.roleList = await getRoleList()
    }

    getSelectRoleList()

    const renderSearch = useSearchForm(state, getSearchList)
    const { render: renderDialog, openDialog } = useEditDialog(state, getSearchList)
    const renderList = useList(state, openDialog, getSearchList)

    return () => (
      <div class='user-list'>
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
