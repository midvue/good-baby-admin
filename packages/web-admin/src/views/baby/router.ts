import Layout from '@/layout/index.vue'

export default {
  path: '/baby',
  component: Layout,
  meta: { icon: 'user', title: '配置中心' },
  redirect: '/baby/feed-record',
  children: [
    {
      path: 'feed-record',
      name: 'feed-record',
      component: () => import('@/views/baby/feed-record/list/index.vue'),
      meta: {
        title: '喂养记录'
      }
    },
    {
      path: 'milk-powder',
      name: 'milk-powder',
      component: () => import('@/views/baby/milk-powder/list/index.vue'),
      meta: {
        title: '奶粉管理'
      }
    }
  ]
}
