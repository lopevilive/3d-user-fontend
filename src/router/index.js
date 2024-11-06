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
      component: () => import('@/views/album-mod/index.vue'),
      meta: {needLogin: true}
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
          meta: {needLogin: true}
        },
        {
          path: 'type-manage',
          name: 'type-manage',
          component: () => import('@/views/type-manage/index.vue'),
          meta: {needLogin: true}
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/contact/index.vue')
        },
        {
          path: 'staff-manage',
          name: 'staff-manage',
          component: () => import('@/views/staff-manage/index.vue'),
          meta: {needLogin: true}
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

const getToken = (query) => {
  const {token: queryToken} = query
  const storageToken = localStorage.getItem('token')
  if (queryToken) {
    if (storageToken !== queryToken) {
      localStorage.setItem('token', queryToken)
    }
  }
  return queryToken || storageToken || '' // 优先从 url 取
}

const init = async (to, from) => {
  // const res = await login()
  const token = getToken(to.query)
  const { needLogin } = to.meta
  if (!token) { // 无token 信息
    if (needLogin) {
      // todo ，此处应前往登录
      return false
    }
    return
  }
  if (globalData.value?.userInfo?.userId) { // 已经登录
    return true
  }

  try {
    const {data} = await getUserInfo()
    if (!data.userId && needLogin) {
      // 获取用户信息失败，说明 token 失效了，此处应前往登录 todo
      return false
    }
    globalData.value.userInfo = data
  } catch(e) {
    localStorage.setItem('token', '') // 登录失效清空本地缓存
    if (needLogin) {
      // todo ，此处应前往登录
      return false
    }
  }
  
}

router.beforeEach(async (to, from) => {
  return await init(to, from)
})

export default router
