import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { globalData } from '@/store'
import { getUserInfo } from '@/http'
import { isInApp } from '@/util'

const router = createRouter({
  history: createWebHistory('/dist/'),
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
      meta: {needPhone: true} // 需要手机认证
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
          meta: {needPhone: true}
        },
        {
          path: 'type-manage',
          name: 'type-manage',
          component: () => import('@/views/type-manage/index.vue'),
          meta: {needPhone: true}
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
          meta: {needPhone: true}
        },
        {
          path: 'staff-verify/:id',
          name: 'staff-verify',
          component: () => import('@/views/staff-verify/index.vue'),
          meta: {needPhone: true}
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


const tologin = async (to) => {
  const bool = await isInApp()
  if (!bool) return
  wx.miniProgram.redirectTo({url: `../login/login?src_path=${encodeURIComponent(to.path)}`})
}

const handleLogin = async (to) => {
  const { userId } = globalData.value.userInfo
  if (userId) return
  const token = getToken(to.query)
  if (token) {
    try {
      const {data} = await getUserInfo()
      globalData.value.userInfo = data
    } catch(e) {
      localStorage.setItem('token', '')
      await tologin(to)
    }
  } else {
    await tologin(to)
  }
}

const init = async (to, from) => {
  const { needPhone } = to.meta
  await handleLogin(to)
  // tologin(to)
}

router.beforeEach(async (to, from) => {
  return await init(to, from)
})

export default router
