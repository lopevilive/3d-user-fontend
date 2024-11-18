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
          meta: {title: '产品列表'}
        },
        {
          path: 'product-detial/:id',
          name: 'product-detial',
          component: () => import('@/views/product-detial/index.vue'),
          meta: {title: '产品详情'}
        },
        {
          path: 'product-edit/:id?',
          name: 'product-edit',
          component: () => import('@/views/product-edit/index.vue'),
          meta: {needPhone: true, title: '编辑产品'}
        },
        {
          path: 'type-manage',
          name: 'type-manage',
          component: () => import('@/views/type-manage/index.vue'),
          meta: {needPhone: true, title: '分类管理'}
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
          meta: {needPhone: true, title: '人员管理'}
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
      path: '/user-protocol',
      name: 'user-protocol',
      component:  () => import('@/views/user-protocol/index.vue'),
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


const tologin = (to) => {
  wx.miniProgram.redirectTo({url: `../login/login?src_path=${encodeURIComponent(to.path)}`})
}

const toPhone = (to) => {
  wx.miniProgram.navigateTo({url: `../phone/phone?src_path=${encodeURIComponent(to.path)}`})
}

const handleLogin = async (to) => {
  const inApp = await isInApp()
  const { userId } = globalData.value.userInfo
  if (userId) return true
  const token = getToken(to.query)
  if (token) {
    try {
      const {data} = await getUserInfo()
      globalData.value.userInfo = data
    } catch(e) {
      localStorage.setItem('token', '')
      if (inApp) {
        await tologin(to)
        return false
      } else {
        return true
      }
    }
  } else {
    if (inApp) {
      await tologin(to)
      return false
    } else {
      return true
    }
  }
}

const init = async (to, from) => {
  const { needPhone, title } = to.meta
  let pass = await handleLogin(to)
  if (pass === false) return false
  if (needPhone) {
    const {hasPhone} = globalData.value.userInfo
    if (!hasPhone) {
      const inApp = await isInApp()
      if (!inApp) return false // 这种情况不许打开页面
      toPhone(to)
      return false
    }
  }
  document.title = title || '小果图册'
}

router.beforeEach(async (to, from) => {
  return await init(to, from)
})

export default router
