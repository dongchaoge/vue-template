/*  用于处理金价相关的变量以及函数
 * @Author: dcg
 * @Date: yyyy-11-Fr 02:24:32
 * @Last Modified by:   dcg
 * @Last Modified time: yyyy-11-Fr 02:24:32
 */
import { filterPrice } from '@/utils/util'
import { Function } from '@/utils/libs/canjs'

// 行情数据源msgType 与简称对应关系  剩下的需要特殊处理
export const SOURCE_NAME_CODE_MAP = {
  rtjPrice: 'RTJ',
  hkwfPrice: 'HKWF',
  djPrice: 'DJ',
  comexPrice: 'COMEX',
  nymexPrice: 'NYMEX',
  hkexPrice: 'HKEX',
  lmePrice: 'LME'
}
// 渠道简称对应的渠道code
export const SOURCE_TAG_MAP = {
  SGE: 'windPrice',
  SHF: 'windPrice',
  // WIND这个是socket里面有
  WIND: 'windPrice',
  CFETS: 'windPrice',
  RTJ: 'rtjPrice',
  HKWF: 'hkwfPrice',
  DJ: 'djPrice',
  USD: 'djPrice',
  LBMA: 'djPrice',
  COMEX: 'comexPrice',
  NYMEX: 'nymexPrice',
  HKEX: 'hkexPrice',
  LME: 'lmePrice'
}
// 纽交所
export const NYM_TO_CODE = {
  PA: '钯金',
  PL: '铂金',
  GC: '黄金',
  SI: '白银'
}
// 纽交所-合约年份
export const CONTRNCT_MON = {
  F: '01',
  G: '02',
  H: '03',
  J: '04',
  K: '05',
  M: '06',
  N: '07',
  Q: '08',
  U: '09',
  V: '10',
  X: '11',
  Z: '12'
}
// 港交所
export const HKEX_TO_CODE = {
  GDU: '美元黄金',
  GDR: '人民币黄金',
  CUS: '美元兑人民币'
}

// 伦敦金
export const LME_TO_CODE = {
  'AUSPTE.LME': 'LME黄金',
  'AGSPTE.LME': 'LME白银',
  'SPTAUUSDOZ.IDC': '伦敦金现',
  'SPTAGUSDOZ.IDC': '伦敦银现'
}

// 根据数据源构建需要使用的数据 list、map
export const filterSourceList = sourceMap => {
  let list = []
  const map = {}
  Object.keys(sourceMap).map(key => {
    // 过滤掉金仕达的数据源，用万德的
    if (key !== 'kingstarPrice') {
      const priceList = []
      sourceMap[key].map(price => {
        // 一个数据源分成买卖两个方向
        priceList.push(...filterSourceName(price, key))
      })
      if (key === 'windPrice') {
        // 分为上金、上期
        map.SGE = priceList.filter(item => item.gmCode.includes('SGE'))
        map.SHF = priceList.filter(item => item.gmCode.includes('SHF'))
        map.CFETS = priceList.filter(item => item.gmCode.includes('HKDCNY'))
      } else {
        // map[key] = priceList
        map[SOURCE_NAME_CODE_MAP[key] || key] = priceList
      }
      list = list.concat(priceList)
    }
  })
  return {
    list,
    map
  }
}
// 处理数据源信息，构建渠道名称和行情名称
function filterSourceName (price, sourceName) {
  let name = price.name
  const gmCode = price.gmCode
  let priceSourceName = ''
  // 这几个特殊处理
  if (gmCode.includes('SGE')) {
    priceSourceName = 'SGE'
  } else if (gmCode.includes('SHF')) {
    priceSourceName = 'SHF'
  } else if (gmCode.includes('HKDCNY')) {
    // 港元兑人民币
    priceSourceName = 'CFETS'
  } else {
    priceSourceName = SOURCE_NAME_CODE_MAP[sourceName]
  }
  // 融通金
  if (gmCode.includes('RTJ')) {
    name = name.replace('融通金-', '')
    name = `RTJ-${name}`
  }

  // 香港永丰
  if (
    gmCode.includes('HG') ||
    (gmCode.includes('X') && gmCode.includes('CNH'))
  ) {
    name = `香港永丰-${name}`
  }

  // 纽交所
  if (name.includes('NYM') || name.includes('CMX')) {
    const contract = name.slice(0, 2)
    const month = name.slice(2, 3)
    const year = name.slice(3, 5)
    name = `${NYM_TO_CODE[contract]}${year}${CONTRNCT_MON[month]}`
  }
  // 港交所
  if (name.includes('.HK')) {
    const contract = name.slice(0, 3)
    const number = name.slice(6, 8)
    name = `${HKEX_TO_CODE[contract]}${number}`
  }
  // 伦敦金
  if (name.includes('.LME') || name.includes('.IDC')) {
    name = `${LME_TO_CODE[name]}`
  }
  name = name.replace(/MAU/i, 'Mini黄金')
  name = name.replace(/AU/i, '黄金')
  name = name.replace(/AG/i, '白银')
  name = name.replace(/PT/i, '铂金')
  name = name.replace(/PD/i, '钯金')
  name = name.replace(/RH/i, '铑')
  name = name.replace(/IR/i, '铱')
  name = name.replace(/RU/i, '钌')
  // 去掉sge和shf标识
  name = name.replace(/(\.SGE|\.SHF)$/, '')
  const tagName = `${priceSourceName}_${gmCode.replace(
    /\.SGE|\.SHF|(RTJ_)|\.NYM|\.CMX|\.HK|\.LME/g,
    ''
  )}`
  // 一个数据源分成买卖两个方向
  return [
    {
      ...price,
      name: `${name}-回购（${tagName}_B）`,
      tagName: `${tagName}_B`
    },
    {
      ...price,
      name: `${name}-销售（${tagName}_S）`,
      tagName: `${tagName}_S`
    }
  ]
}
// 筛选数据源列表时用于匹配行情
export const matchSourceName = (value, sourceName) => {
  return (sourceName + '')
    .trim()
    .toLocaleLowerCase()
    .includes((value + '').trim().toLocaleLowerCase())
}
// 根据tagname获取数据源价格
export const getSourcePriceByTagName = (tagName, state) => {
  // 获取行情源价格
  const priceItem = getSourcePriceItem(state, getSourceInfoByTagName(tagName))
  return isNaN(priceItem.price) ? 0 : +priceItem.price
}
// 根据tagname获取对应的渠道和gmcode e.g. SGE_AU9995_B -> {sourceName:windPrice,gmCode:AU9995,direction:S}
export const getSourceInfoByTagName = tagName => {
  let result = {}
  tagName.replace(/^([^_]+)[_](.+)_(B|S)$/g, (match, p1, p2, p3) => {
    // 融通金渠道有黄金 一个 COMEX_Au 一个自己的 RTJ_Au 还有一个 HK_AU
    if (p1 === 'RTJ' && match.split('_').length === 3) {
      p2 = `${p1}_${p2}`
    } else if (p1 === 'SGE') {
      p2 = `${p2}.${p1}`
    } else if (p1 === 'SHF') {
      p2 = `${p2}.${p1}`
    }
    result = {
      sourceName: SOURCE_TAG_MAP[p1] || p1,
      gmCode: p2,
      direction: p3
    }
  })
  return result
}
// 根据行情源数据获取报价信息
export const getSourcePriceItem = (
  state,
  { sourceName, gmCode, direction }
) => {
  const price = state.sourcePriceMap[sourceName]?.find(price => {
    return price.gmCode.includes(gmCode)
  })
  if (!price) {
    return false
  }
  return price[direction === 'B' ? 'buyPrice' : 'sellPrice']
}

// 根据公式计算价格
export const computedPriceByFormula = (state, formulaContent) => {
  const computedFormula = formulaContent.replace(/{([^}]+)}/g, (match, p1) => {
    return getSourcePriceByTagName(p1, state)
  })
  return filterPrice(new Function(`return ${computedFormula}`)())
}
// 根据报价设置计算最终价格
export const computedPriceBySetting = (
  {
    followCategory,
    formulaType,
    manualPrice,
    formulaContent,
    priceSource,
    spreadType,
    spreadValue,
    stopTrading,
    biddingType
  },
  goods,
  goodsPrice,
  state
) => {
  // 不能报价类型(NO_SET_OFFER -> 没在时间段, PRICESOURCE_OVERDUE -> 行情源过期)
  if (stopTrading === 'NO_SET_OFFER' || stopTrading === 'PRICESOURCE_OVERDUE') {
    return {
      amount: '--',
      price: '--'
    }
  }
  let bit = 2
  if (goods.category === 'AG') {
    bit = 3
  }
  if (biddingType === 'ML') {
    // 手动报价
    // if (goods.goodsCode === '1279273112217856') {
    //   console.log(manualPrice)
    // }
    return {
      amount: '--',
      // amount: filterPrice(manualPrice - +goodsPrice.close),
      price: filterPrice(manualPrice, bit)
    }
  }
  if (formulaType === 'default') {
    // 自动跟随-跟随行情源
    const priceItem = getSourcePriceItem(
      state,
      getSourceInfoByTagName(followCategory)
    )
    // console.log(priceItem)
    // if (goods.goodsCode === '1279273112217856') {
    // }
    if (spreadType === 'percent') {
      // 百分比
      const price = +priceItem.price * (1 + spreadValue / 100)
      const amount = filterPrice(price - +goodsPrice.close)
      return {
        amount: +amount < 0 ? amount : `+${amount}`,
        price: filterPrice(price, bit)
      }
    } else {
      // 绝对值
      const price = +priceItem.price + spreadValue
      const amount = filterPrice(price - +goodsPrice.close)
      return {
        amount: +amount < 0 ? amount : `+${amount}`,
        price: filterPrice(price, bit)
      }
    }
  } else {
    // 自动跟随-自定义公式
    // formulaContent
    if (!formulaContent) {
      return {
        amount: '--',
        price: '--'
      }
    }
    const computedFormula = formulaContent.replace(
      /{([^}]+)}/g,
      (match, p1) => {
        return getSourcePriceByTagName(p1, state)
      }
    )
    const price = new Function(`return ${computedFormula}`)()
    return {
      amount: '--',
      // amount: filterPrice(price - +goodsPrice.close),
      price: filterPrice(price, bit)
    }
  }
}
