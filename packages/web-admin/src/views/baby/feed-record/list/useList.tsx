import { ElButton } from 'element-plus'
import { useCtxState } from '@mid-vue/use'
import { copyTextToClipboard, dateFormat } from '@mid-vue/shared'
import { EmTable, type EmTableType } from '@/components'
import { deleteFeedRecord } from '../api'
import { useEditDialog } from './dialog/useEditDialog'
import { useFeedRecordTableDialog } from './dialog/useFeedRecordTableDialog'
import type { FeedRecord, FeedRecordListState } from '../types'

export const useList = (getSearchList: () => void) => {
  const [state] = useCtxState<FeedRecordListState>()
  const handleDelete = (id: number) => {
    $EmMsgBox.warning('确定永久删除当前喂养记录嘛,请谨慎操作!', {}).then(async () => {
      deleteFeedRecord({ id }).then(() => {
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

  const cols: EmTableType.Cols<FeedRecord> = [
    {
      label: '序号',
      prop: 'id',
      align: 'center',
      width: 55
    },
    {
      label: '喂养类型',
      prop: 'type',
      align: 'center'
    },
    {
      label: '喂养日期',
      prop: 'type',
      align: 'center'
    },
    {
      label: '内容',
      prop: 'content',
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

  const tableAction: EmTableType.IAction<FeedRecord> = {
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

  return () => (
    <>
      <div class='toolbar'>
        <ElButton type='primary' icon='plus' onClick={() => openDialog()}>
          添加喂养记录
        </ElButton>
      </div>
      <EmTable data={state.feedRecordList} cols={cols} action={tableAction}></EmTable>
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
    </>
  )
}
