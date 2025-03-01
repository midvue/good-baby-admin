import { ElButton } from 'element-plus'
import { useCtxState } from '@mid-vue/use'
import { copyTextToClipboard, dateFormat } from '@mid-vue/shared'
import { EmTable, type EmTableType } from '@/components'
import { deleteDict } from '../api'
import { useEditDialog } from './dialog/useEditDialog'
import { useDictTableDialog } from './dialog/useDictTableDialog'
import type { Dict, DictListState } from '../types'

export const useList = (getSearchList: () => void) => {
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
      align: 'center',
      render: ({ row }) => (
        <>
          <span>{row.code}</span>
          <ElButton
            class='ml-8'
            size='small'
            circle
            icon='CopyDocument'
            onClick={() => {
              copyTextToClipboard(row.code)
              $EmMsg.success('复制成功')
            }}
          ></ElButton>
        </>
      )
    },
    {
      label: '内容',
      prop: 'content',
      align: 'center',
      render: (scoped) => (
        <ElButton type='primary' size='small' plain onClick={() => openDictDialog(scoped.row)}>
          添加/编辑内容
        </ElButton>
      )
    },
    {
      prop: 'remark',
      label: '备注',
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      render: ({ row }) => <span>{dateFormat(row.createTime)}</span>
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      align: 'center',
      render: ({ row }) => <span>{dateFormat(row.updateTime)}</span>
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
  const { render: renderDialog, openDialog } = useEditDialog(getSearchList)
  const { render: renderDictTableDialog, open: openDictDialog } = useDictTableDialog(getSearchList)
  return () => (
    <>
      <div class='toolbar'>
        <ElButton type='primary' icon='plus' onClick={() => openDialog()}>
          添加字典
        </ElButton>
      </div>
      <EmTable data={state.dictList} cols={cols} action={tableAction}></EmTable>
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
      {renderDialog()}
      {renderDictTableDialog()}
    </>
  )
}
