export const E_business = [
  {key: 1, val: '全屋定制/衣柜定制'},
  {key: 999, val: '其他'},
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
    businessId: 1, // 行业id
    type3D: [], // 720 模式
    model3D: [1], // 720 场景
    fields: [
      {
        name: '板材等级',
        opts: ['ENF','E0','E1']
      },
      {
        name: '板材品牌',
        opts: ['东奥','兔宝宝','林氏木业']
      },
      {
        name: '风格',
        opts: ['现代简约','北欧风格','新中式','轻奢','复古风','意式极简','原木风','奶油风','地中海'],
      }
    ],
    recommendNames: ['衣柜','鞋柜','酒柜','电视柜']
  }
]

export const getBusinessCfg = (businessId) => {
  for (const item of business_cfgs) {
    if (item.businessId === businessId) return item
  }
  return {}
}

