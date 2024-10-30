import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { globalData } from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/album-mod/:shopId?',
      name: 'album-mod',
      component: () => import('@/views/album-mod/index.vue')
    },
    {
      path: '/product-manage/:shopId',
      component:  () => import('@/components/ComRouterView.vue'),
      children: [
        {
          path: '',
          name: 'product-manage',
          component:  () => import('@/views/product-manage/index.vue'),
        },
        {
          path: 'product-detial/:id',
          name: 'product-detial',
          component: () => import('@/views/product-detial/index.vue'),
        },
        {
          path: 'product-edit/:id?',
          name: 'product-edit',
          component: () => import('@/views/product-edit/index.vue'),
        },
        {
          path: 'type-manage',
          name: 'type-manage',
          component: () => import('@/views/type-manage/index.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/contact/index.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component:  () => import('@/views/test/index.vue'),
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }
  ]
})

const init = async () => {
  // todo
  globalData.value.done = true
  console.log('init')
}

router.beforeEach(async (to, from) => {
  const {done} = globalData.value
  if (done) return // 初始化完成
  await init()
})

export default router
