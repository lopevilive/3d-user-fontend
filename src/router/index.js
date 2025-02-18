import { createRouter, createWebHistory } from 'vue-router'
import { globalData } from '@/store'
import { getUserInfo } from '@/http'
import { isInApp, viewLog, toLogin, shopInfoManage, encryRefManage } from '@/util'

const router = createRouter({
  history: createWebHistory('/dist/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/index.vue')
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
        },
        {
          path: 'sys-setting',
          name: 'sys-setting',
          component: () => import('@/views/sys-setting/index.vue'),
          meta: {title: '画册设置'}
        },
        {
          path: 'inventory-list',
          name: 'inventory-list',
          component: () => import('@/views/inventory-list/index.vue'),
          meta: {title: '商品清单'}
        },
        {
          path: 'view-inventory/:id',
          name: 'view-inventory',
          component: () => import('@/views/view-inventory/index.vue'),
          meta: {title: '报价清单'}
        },
        {
          path: 'address-list',
          name: 'address-list',
          component: () => import('@/views/address-list/index.vue'),
          meta: {title: '地址列表'}
        },
        {
          path: 'mul-manage/:id',
          name: 'mul-manage',
          component: () => import('@/views/mul-manage/index.vue')
        },
        {
          path: 'feedback',
          name: 'feedback',
          component: () => import('@/views/feedback/index.vue'),
          meta: {title: '反馈建议'}
        },
        {
          path: 'watermark',
          name: 'watermark',
          component: () => import('@/views/watermark/index.vue'),
          meta: {title: '水印设置'}
        }
      ]
    },
    {
      path: '/album-list',
      name: 'album-list',
      component: () => import('@/views/album-list/index.vue'),
      meta: {needPhone: true}
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
      path: '/view-share',
      name: 'view-share',
      component: () => import('@/views/view-share/index.vue')
    },
    {
      path: '/album-illegal/:id',
      name: 'album-illegal',
      component: () => import('@/views/album-illegal/index.vue')
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

const toPhone = (to) => {
  wx.miniProgram.navigateTo({url: `../phone/phone?src_path=${encodeURIComponent(to.fullPath)}`})
}

const handleLogin = async (to) => {
  const inApp = isInApp()
  const { userId } = globalData.value.userInfo
  if (userId) return 
  const token = getToken(to.query)
  if (token) {
    try {
      globalData.value.isShowSke = true
      const {data} = await getUserInfo()
      globalData.value.userInfo = data
    } catch(e) {
      // localStorage.setItem('token', '')
      if (inApp) {
        toLogin(to.fullPath)
        return false
      }
    } finally {
      globalData.value.isShowSke = false
    }
  } else {
    if (inApp) {
      toLogin(to.fullPath)
      return false
    }
  }
}

const handleEncry = async (to) => {
  if (!['product-manage'].includes(to.name)) return true
  const shopId = + to.params.shopId
  const { rid, userInfo: {ownerList, adminList}, encryInfo } = globalData.value
  if (rid === 99) return true
  if (ownerList.includes(shopId)) return true
  if (adminList.includes(shopId)) return true
  if (encryInfo[shopId] === true) return true

  const encryDialogRef = encryRefManage.getRef()
  const ret = await encryDialogRef.value.show(shopId)
  if (ret === false) return {name: 'home'}
}

const init = async (to, from) => {
  const { needPhone } = to.meta
  const {shopId} = to.params
  const {isPC} = to.query
  if (isPC) {
    globalData.value.isPC = true
  }
  if (shopId) {
    shopInfoManage.getData(shopId)
  }
  let pass = await handleLogin(to)
  if (pass === false) return false
  if (needPhone) {
    const {hasPhone} = globalData.value.userInfo
    if (!hasPhone) {
      const inApp = isInApp()
      if (!inApp) return false // 这种情况不许打开页面
      toPhone(to)
      return false
    }
  }
  if (shopId) {
    // 这里判断画册是否被封禁
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0];
    if (shopInfo.status === 1) {
      return {name: 'album-illegal', params: {id: shopId}}
    } else {
      viewLog.setlog(shopId)
    }
    if (shopInfo.encry === 1) {
      const ret = await handleEncry(to)
      if (ret !== true) return ret
    }
  }
  wx.miniProgram.postMessage({ data: {type: 'router', name: to.name}})
  document.title = to?.query?.title || to?.meta?.title || '小果画册'
}

router.beforeEach(async (to, from) => {
  return await init(to, from)
})

router.afterEach((to, from) => {
  let pageCount = sessionStorage.getItem('pageCount')
  if (!pageCount) pageCount = 0
  pageCount =  Number(pageCount)
  pageCount += 1
  sessionStorage.setItem('pageCount', pageCount)
})

export default router
