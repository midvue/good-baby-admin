import { reactive, ref } from 'vue'
import { type EmFormType } from '@/components'
import { addFeedRecord, updateFeedRecord } from '../../api'
import type { FeedRecord, OpenDialogFunc } from '../../types'

interface BState {
  form: Partial<FeedRecord>
  isShow: boolean
  isAdd: boolean
}
/** 喂养记录编辑新增 */
export const useEditDialog = (getSearchList: () => void) => {
  const formRef = ref<HTMLFormElement>()
  const bState = reactive<BState>({
    form: {},
    isShow: false,
    isAdd: false
  })

  const handleSubmit = async () => {
    const res = await formRef.value?.validate().catch(() => false)
    if (!res) return
    const apiFunc = bState.isAdd ? addFeedRecord : updateFeedRecord
    apiFunc(bState.form).then(() => {
      getSearchList()
      $EmMsg.success('操作成功')
      handleCancel()
    })
  }

  const handleCancel = async () => {
    formRef.value?.clearValidate()
    bState.isShow = false
  }

  const openDialog: OpenDialogFunc = async (form = {}) => {
    bState.isAdd = !form.id
    bState.form = { ...form }
    bState.isShow = true
  }

  const items: EmFormType.Items = [
    {
      label: '记录类型',
      field: 'type',
      render: () => <el-input v-model={bState.form.type} placeholder='请输入喂养记录类型' />,
      rules: [{ required: true, message: '请输入喂养记录类型', trigger: 'blur' }]
    },
    {
      label: '喂养时间',
      field: 'feedTime',
      render: () => <el-input v-model={bState.form.feedTime} placeholder='请输入喂养时间' />,
      rules: [{ required: true, message: '请输入喂养时间', trigger: 'blur' }]
    },
    {
      label: '喂养内容',
      field: 'content',
      render: () => <el-input v-model={bState.form.content} placeholder='请输入喂养喂养内容' />,
      rules: [{ required: true, message: '请输入喂养内容', trigger: 'blur' }]
    },
    {
      label: '备注',
      field: 'remark',
      render: () => (
        <el-input
          type='textarea'
          rows={2}
          v-model={bState.form.remark}
          placeholder='请输入备注'
          maxlength={128}
        />
      )
    }
  ]
  return {
    openDialog,
    render: () => (
      <div class='form-dialog'>
        <el-dialog
          v-model={bState.isShow}
          title={bState.isAdd ? '新增喂养记录' : '修改喂养记录'}
          width='540px'
          center
          onClose={handleCancel}
        >
          {{
            default: () => <em-form ref={formRef} model={bState.form} items={items}></em-form>,
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
