import Layout from '@/layout/index.vue'

export default {
  path: '/setting',
  component: Layout,
  meta: { icon: 'user', title: '配置中心' },
  redirect: '/setting/dict-mg',
  children: [
    {
      path: 'dict-mg',
      name: 'dict-mg',
      component: () => import('@/views/setting/dict-mg/list/index.vue'),
      meta: {
        title: '字典管理'
      }
    }
  ]
}
