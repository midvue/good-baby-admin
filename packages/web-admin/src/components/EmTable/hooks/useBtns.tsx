import { isFunction } from '@mid-vue/shared'
import type { IProps } from '../props'
import type { RowScoped } from '../types'

export const useBtns = (props: IProps) => {
  return () => {
    if (!props.cols.length || !props.action.buttons.length) return
    return (
      <el-table-column
        prop='em-oprerate'
        label='操作'
        align='center'
        width={props.action.width}
        fixed={props.action.fixed}
      >
        {{
          default: (scoped: RowScoped) => {
            const buttons = isFunction(props.action.buttons)
              ? props.action.buttons(scoped)
              : props.action.buttons

            return buttons.map((btn) => {
              const slot = btn.title ? { default: () => btn.title } : null
              return (
                <el-button
                  type={btn.type || 'primary'}
                  size={btn.size || 'small'}
                  icon={btn.icon}
                  circle={btn.circle || false}
                  {...btn.attr}
                  onClick={(e: PointerEvent) => {
                    e.stopPropagation()
                    btn.click?.(scoped)
                  }}
                  v-permission={btn.permission}
                  v-slots={slot}
                ></el-button>
              )
            })
          }
        }}
      </el-table-column>
    )
  }
}
