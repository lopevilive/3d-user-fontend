export const E_business = [
  {key: 999, val: '其他'},
  {key: 3, val: '烘焙/蛋糕'},
  {key: 1, val: '全屋定制/衣柜定制'},
  {key: 2, val: '玉石翡翠'}
]

export const E_type3D = [
  {key: 0, val: '无'},
  {key: 1, val: '自动生成'},
  {key: 2, val: '扫二维码'},
]

export const E_model3D = [
  {key: 1, val: '衣柜'},
  {key: 2, val: '地板'},
  {key: 3, val: '瓷砖'}
]


// 行业个性化配置
export const business_cfgs = [
  {
    businessId: 999,
    attrCfg: [
      {
        name: '发货方式',
        type: 'single',
        opts: ['包邮','邮费自理','仅自提']
      },
      {
        name: '品牌',
        type: 'single',
        opts: ['其他']
      }
    ]
  },
  {
    businessId: 1, // 行业id
    type3D: [], // 720 模式
    model3D: [1], // 720 场景
    attrCfg: [
      {
        name: '板材等级',
        type: 'single',
        opts: ['ENF级','E0级','E1级']
      },
      {
        name: '板材品牌',
        type: 'single',
        opts: ['东奥','兔宝宝','林氏木业']
      },
      {
        name: '风格',
        type: 'single',
        opts: ['现代简约','北欧风格','新中式','轻奢','复古风','意式极简','原木风','奶油风','地中海'],
      }
    ],
  },
  {
    businessId: 2,
    attrCfg: [
      {
        name: '材质',
        type: 'single',
        opts: ['和田玉','翡翠','独山玉','青玉','天然水晶','半宝石']
      },
      {
        name: '主题',
        type: 'single',
        opts: ['山水','花鸟','人物','神话','文字']
      },
      {
        name: '种类',
        type: 'single',
        opts: ['手镯','吊坠','手把件','耳饰','戒指','项链','手链']
      }
    ]
  },
  {
    businessId: 3,
    attrCfg: [
      {
        name: '奶油',
        type: 'single',
        opts: ['动物奶油','植物奶油'],
      },
      {
        name: '口味',
        type: 'single',
        opts: ['水果','巧克力','奶油','香草','抹茶','咖啡']
      },
      {
        name: '适用场合',
        type: 'single',
        opts: ['生日','婚礼','母亲节','纪念日']
      }
    ]
  }
]

export const getBusinessCfg = (businessId) => {
  for (const item of business_cfgs) {
    if (item.businessId === businessId) return item
  }
  return {}
}

export const watermark_cfg_def = {
  type: 2, // 1-图片水印、2-文字水印
  text: '',
  fontsize: 40,
  fill: '#3D3D3D',
  degree: 0,
  gravity: 'southeast',
  configkey: '',
  dissolve: 90,
  batch: 0,
  previewUrl: '',
  fileid: ''
}

export const E_vip_map = [
  {level: 0, name: '普通用户', isVip: false},
  {level: 1, name: '300 容量会员', isVip: true},
  {level: 2, name: '600 容量会员', isVip: true},
  {level: 3, name: '1000 容量会员', isVip: true},
  {level: 4, name: '1500 容量会员', isVip: true},
  {level: 5, name: '2000 容量会员', isVip: true},
]

export const E_illegal_reg = [
  ['辟','邪'],
]

