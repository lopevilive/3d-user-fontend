import { createRouter, createWebHistory } from 'vue-router'
import { globalData } from '@/store'
import { getUserInfo } from '@/http'
import { isInApp, viewLog, toLogin, shopInfoManage, encryRefManage, reportInstance } from '@/util'

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
          meta: {title: '图册设置'}
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
        },
        {
          path: 'cus-inventory',
          name: 'cus-inventory',
          component: () => import('@/views/cus-inventory/index.vue'),
          meta: {title: '客户清单'}
        },
        {
          path: 'banner-cfg',
          name: 'banner-cfg',
          component: () => import('@/views/banner-cfg/index.vue'),
          meta: {title: '轮播图设置'}
        },
        {
          path: 'spec-edit',
          name: 'spec-edit',
          component: () => import('@/views/spec-edit/index.vue'),
          meta: {title: '规格设置'}
        },
        {
          path: 'mul-spec-price',
          name: 'mul-spec-price',
          component: () => import('@/views/spec-edit/MulSpecPrice.vue'),
          meta: {title: '价格设置'}
        },
        {
          path: 'mul-type-manage',
          name: 'mul-type-manage',
          component: () => import('@/views/mul-type-manage/index.vue'),
          meta: {title: '分类设置'}
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
  if (userId) return // 已经登录
  const token = getToken(to.query)
  if (token) {
    try {
      globalData.value.isShowSke = true
      const {data} = await getUserInfo({wxEnv: globalData.value.wxEnv})
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

const handleEncry = async (shopId, to) => {
  if (!shopId) return
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0];
  if (shopInfo.encry !== 1) return
  if (!['product-manage'].includes(to.name)) return
  const { rid, userInfo: {ownerList, adminList}, encryInfo } = globalData.value
  if (rid === 99) return
  if (ownerList.includes(shopId)) return
  if (adminList.includes(shopId)) return
  if (encryInfo[shopId] === true) return

  const encryDialogRef = encryRefManage.getRef()
  const ret = await encryDialogRef.value.show(shopId)
  if (ret === false) return {name: 'home'}
}

const handleQuery = (to) => {
  const {isPC, wxEnv} = to.query
  if (isPC) {
    globalData.value.isPC = true
  }
  if (wxEnv) {
    globalData.value.wxEnv = wxEnv
  }
}

const handlePhone = (to) => {
  const { needPhone } = to.meta
  if (!needPhone) return
  const {hasPhone} = globalData.value.userInfo
  if (hasPhone) return
  const inApp = isInApp()
  if (!inApp) return false // 这种情况不许打开页面
  toPhone(to)
  return false
}

const handleIllegal = async (shopId) => {
  if (!shopId) return
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0];
  if (shopInfo.status !== 1) return
  const { rid } = globalData.value
  if (rid === 99) return // 超级管理员
  return {name: 'album-illegal', params: {id: shopId}}
}

const handleLog = (to, shopId) => {
  if (!shopId) return
  if (!['product-manage', 'product-detial'].includes(to.name)) return
  viewLog.setlog(shopId)
}

const handleReport = (payload) => {
  reportInstance.report(payload) // 处理上报
}

const forwardObj = {}
const handleForwardPermi = async (shopId) => {
  if (!shopId) return
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0];
  const { forwardPermi } = shopInfo
  const { rid } = globalData.value
  if (!forwardObj[shopId]) {
    if (forwardPermi !== 1) return
    forwardObj[shopId] = {done:false, forwardPermi}
  }
  const data = forwardObj[shopId]
  if (data.forwardPermi !== forwardPermi) {
    data.done = false
    data.forwardPermi = forwardPermi
  }
  if (data.done) return
  data.done = true
  const isAdmin = [2, 3, 99].includes(rid) ? 1: 0;
  wx.miniProgram.postMessage({ data: {type: 'forward', forwardPermi: data.forwardPermi, isAdmin, shopId}})
}


const init = async (to, from) => {
  let {shopId} = to.params
  if (shopId) {
    shopId = +shopId
    shopInfoManage.getData(shopId)
  }
  handleQuery(to) //  保存小程序传过来的参数

  let pass = await handleLogin(to) // 处理登录
  if (pass === false) return false

  pass = handlePhone(to) // 判断是否需要手机验证
  if (pass === false) return false

  pass = await handleIllegal(shopId) // 判断是否封禁画册
  if (pass && Object.prototype.toString(pass) === '[object Object]') return pass
  
  handleLog(to, shopId) // 写入浏览记录
  handleReport({to, shopId}) // 处理上报
  

  pass = await handleEncry(shopId, to) // 判断是否加密画册
  if (pass && Object.prototype.toString(pass) === '[object Object]') return pass

  handleForwardPermi(shopId) // 处理转发权限
  // 这里是把当前页面信息传给小程序
  wx.miniProgram.postMessage({ data: {type: 'router', name: to.name}})
  document.title = to?.query?.title || to?.meta?.title || '小果图册'
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
