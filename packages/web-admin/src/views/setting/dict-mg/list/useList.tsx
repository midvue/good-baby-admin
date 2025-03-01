import { useCtxState } from '@mid-vue/use'
import { deleteDict } from '../api'
import type { EmTableType } from '@/components'
import type { Dict, DictListState, OpenDialogFunc } from '../types'

export const useList = (openDialog: OpenDialogFunc, getSearchList: () => void) => {
  const [state] = useCtxState<DictListState>()
  const handleDelete = (id: number) => {
    $EmMsgBox.warning('确定永久删除当前字典嘛,请谨慎操作!', {}).then(async () => {
      deleteDict({ id }).then(() => {
        getSearchList()
        $EmMsg.success('删除成功')
      })
    })
  }

  const handleSizeChange = (size: number) => {
    state.pagination.size = size
    getSearchList()
  }
  const handleCurrentChange = (current: number) => {
    state.pagination.current = current
    getSearchList()
  }

  const cols: EmTableType.Cols<Dict> = [
    {
      label: '序号',
      prop: 'id',
      align: 'center',
      width: 55
    },
    {
      label: '名称',
      prop: 'name',
      align: 'center'
    },
    {
      label: '编码',
      prop: 'code',
      align: 'center'
    },

    {
      prop: 'remark',
      label: '备注',
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center'
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      align: 'center'
    }
  ]

  const tableAction: EmTableType.IAction<Dict> = {
    width: 210,
    buttons: [
      {
        title: '编辑',
        type: 'primary',
        click: ({ row }) => openDialog(row)
      },
      {
        title: '删除',
        type: 'danger',
        click: ({ row }) => handleDelete(row.id)
      }
    ]
  }

  return () => (
    <>
      <div class='toolbar'>
        <el-button type='primary' icon='plus' onClick={() => openDialog()}>
          添加字典
        </el-button>
      </div>
      <em-table data={state.dictList} cols={cols} action={tableAction}></em-table>
      <div class='footer'>
        <el-pagination
          v-model:currentPage={state.pagination.current}
          v-model:page-size={state.pagination.size}
          total={state.pagination.total}
          pageSizes={[10, 20, 30, 50, 100]}
          onSizeChange={handleSizeChange}
          onCurrentChange={handleCurrentChange}
        ></el-pagination>
      </div>
    </>
  )
}
