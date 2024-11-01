import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { globalData } from '@/store'
import { login, getUserInfo } from '@/http'

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

const init = async (to, from) => {
  const {query: token} = to
  if (!token) { // 无token 信息, todo
    globalData.value.done = true
    return
  }
  const userInfo = await getUserInfo()

  const res = await login()
  console.log(res)
  console.log(to)
}

router.beforeEach(async (to, from) => {
  const {done} = globalData.value
  if (done) return // 初始化完成
  await init(to, from)
})

export default router
