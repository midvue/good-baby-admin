import { reactive } from 'vue'
import { ElInput } from 'element-plus'
import { deepClone } from '@mid-vue/shared'
import { EmTable, type EmTableType } from '@/components'
import { updateDict } from '../../api'
import type { Dict, DictInfo } from '../../types'

interface currState {
  id: number
  dictList: DictInfo[]
  isShow: boolean
}
/** 字典内容弹框 */
export const useDictTableDialog = (getSearchList: () => void) => {
  const currState: currState = reactive({
    id: 0,
    dictList: [],
    isShow: false
  })

  const handleSubmit = async () => {
    const list = currState.dictList.map((row, index) => {
      row.sort = index + 1
      return row
    })
    updateDict({ id: currState.id, list }).then(() => {
      getSearchList()
      $EmMsg.success('操作成功')
      handleCancel()
    })
  }

  const handleCancel = async () => {
    currState.isShow = false
  }

  const open = async (row: Dict) => {
    currState.id = row.id
    currState.dictList = deepClone(row.list.length ? row.list : [...row.list, {} as DictInfo])
    currState.isShow = true
  }

  const cols: EmTableType.Cols<DictInfo> = [
    {
      prop: 'sort',
      label: '排序',
      align: 'center',
      width: 60,
      render: ({ $index }) => <span>{$index + 1}</span>
    },
    {
      label: '编码(数字)',
      prop: 'code',
      align: 'center',
      render: ({ row }) => <ElInput v-model={row.code} placeholder='请输入编码' />
    },
    {
      label: '名称',
      prop: 'name',
      align: 'center',
      render: ({ row }) => <ElInput v-model={row.name} placeholder='请输入名称' />
    },
    {
      prop: 'ext',
      label: '其他',
      align: 'center',
      render: ({ row }) => <ElInput v-model={row.ext} placeholder='请输入其他' />
    }
  ]
  const tableAction: EmTableType.IAction<DictInfo> = {
    width: 100,
    buttons: [
      {
        icon: 'plus',
        type: 'primary',
        size: 'small',
        circle: true,
        click: () => {
          currState.dictList.push({} as DictInfo)
        }
      },
      {
        icon: 'delete',
        type: 'danger',
        size: 'small',
        circle: true,
        click: (scoped) => {
          currState.dictList.splice(scoped.$index, 1)
        }
      }
    ]
  }
  return {
    open,
    render: () => (
      <div class='form-dialog'>
        <el-dialog
          v-model={currState.isShow}
          title='修改字典内容'
          width='640px'
          center
          onClose={handleCancel}
        >
          {{
            default: () => (
              <EmTable data={currState.dictList} cols={cols} action={tableAction}></EmTable>
            ),
            footer: () => (
              <div class='form-footer'>
                <el-button onClick={() => handleCancel()}>取消</el-button>
                <el-button type='primary' onClick={() => handleSubmit()}>
                  确定
                </el-button>
              </div>
            )
          }}
        </el-dialog>
      </div>
    )
  }
}
