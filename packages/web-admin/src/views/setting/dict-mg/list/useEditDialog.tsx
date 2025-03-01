import { reactive, ref } from 'vue'
import { type EmFormType } from '@/components'
import { addDict, updateDict } from '../api'
import type { Dict, OpenDialogFunc } from '../types'

interface BState {
  form: Partial<Dict>
  isShow: boolean
  isAdd: boolean
}

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
    const apiFunc = bState.isAdd ? addDict : updateDict
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
      label: '字典名称',
      field: 'name',
      render: () => <el-input v-model={bState.form.name} placeholder='请输入字典名称' />,
      rules: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
    },
    {
      label: '字典编码',
      field: 'code',
      render: () => (
        <el-input
          v-model={bState.form.code}
          placeholder='请输入字典编码'
          onInput={(code: string) => {
            bState.form.code = code.replace(/\W/g, '').toUpperCase()
          }}
        />
      ),
      rules: [{ required: true, message: '请输入字典编码', trigger: 'blur' }]
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
          title={bState.isAdd ? '新增字典' : '修改字典'}
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
