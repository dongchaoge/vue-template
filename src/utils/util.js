export function formatDate (date, format) {
  if (typeof date === 'string' && date.indexOf('-') > -1) {
    date = new Date(date.replace(/-/g, '/'))
  } else if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = new Date(date)
  }
  if (date === 'Invalid Date') {
    return console.error('输入时间格式有误！')
  }
  const padNum = function (num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  // 指定格式字符
  const cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date
      .getFullYear()
      .toString()
      .substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: padNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: padNum(date.getDate()), // 日 : 如果1位的时候补0
    h: date.getHours(), // 时
    hh: padNum(date.getHours()), // 时
    mm: padNum(date.getMinutes()), // 分
    ss: padNum(date.getSeconds()) // 秒
  }
  format || (format = 'yyyy-MM-dd hh:mm:ss')
  return format.replace(/([a-z])(\1)*/gi, function (m) {
    return cfg[m]
  })
}
export function json2str (json) {
  if (typeof json === 'string') {
    return json
  }
  try {
    return JSON.stringify(json)
  } catch (e) {
    console.log(e)
    return json
  }
}

export function str2json (str) {
  if (!str) {
    return {}
  }
  if (typeof str === 'object') {
    return str
  }
  try {
    return JSON.parse(str)
  } catch (e) {
    console.log(e)
    return {}
  }
}
export function err (text) {
  uni.showToast({
    title: text,
    icon: 'none'
  })
}
export function success (text) {
  uni.showToast({
    title: text,
    icon: 'success'
  })
}

// 千分隔
export function milliFormat (num, count = 2, { empty = '--' } = {}) {
  num = num + ''
  if (isNaN(num) || num === null) {
    if (typeof num === 'string') {
      if (!isNaN(+num.replace(/,/g, ''))) {
        return num
      }
    }
    if (empty === 0) {
      num = 0
      return num.toFixed(count)
    }
    return empty
  }
  if (!count && count !== 0) {
    count = 2
  }
  num = rounding(num, count) + ''
  const [integer, numberDecimal] = num.split('.')
  let value = integer.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  if (numberDecimal) {
    value = `${value}.${numberDecimal}`
  }
  return value
}

// 格式化价格,小数点后2位
export function filterPrice (num, bit = 2, showZero) {
  if (!num && !showZero) return '--'
  const value = (+num).toFixed(bit)
  return isNaN(value) ? '--' : value
}

// 获取图片
export function transformImg (imgStr) {
  if (!imgStr) {
    return []
  }
  if (Array.isArray(imgStr)) {
    return imgStr
  }
  if (!imgStr.includes('[')) {
    if (imgStr.includes(',')) {
      return imgStr.split(',')
    }
    return [imgStr]
  }
  const imgList = str2json(imgStr)
  if (Array.isArray(imgList)) {
    return imgList
  } else {
    return [imgStr]
  }
}
// 数据脱敏
export function desensitization (str, type = 'text') {
  if (!str) {
    return str
  }
  str = '' + str
  if (type === 'phone') {
    return `${str.slice(0, 3)}***${str.slice(-4)}`
  }
  return `${str.slice(0, -4)}***${str.slice(-1)}`
}

// 转换为小数
export function filterDecimal (number) {
  if (!(+number)?.toFixed || number === null || number === undefined) {
    return console.error(`请传入数字${number}(util-decimal)`)
  }
  if (typeof number === 'string') {
    return +parseFloat((+number).toPrecision(12))
  }
  return +parseFloat(number.toPrecision(12))
}

export function rounding (number, digit = 3, rule = 4) {
  digit = +digit
  rule = +rule
  let sign = ''
  if (+number < 0) {
    sign = '-'
  }
  const numberStr = '' + filterDecimal(number)
  // 是否整数
  if (!numberStr.includes('.')) {
    let pad = ''
    if (digit > 0) {
      pad = '.' + pad.padEnd(digit, 0)
    }
    return `${numberStr}${pad}`
  }
  const reg = new RegExp(`(\\d+).(\\d{0,${digit + 1}})(.*)`)
  let integer = +numberStr.replace(reg, '$1')
  if (integer < 0) {
    integer = Math.abs(integer)
  }
  let decimal = '' + numberStr.replace(reg, '$2')
  decimal = decimal.replace('-', '')
  // 小数位数
  if (decimal.length <= digit) {
    return `${sign}${integer}.${decimal.padEnd(digit, 0)}`
  }
  // 舍入规则判断
  decimal = decimal.slice(0, digit + 1)
  if (decimal.slice(-1) <= rule) {
    return `${sign}${integer}.${decimal.slice(0, -1)}`
  } else {
    let isZero = false
    if (integer === 0) {
      integer += 1
      isZero = true
    }
    let result = '' + (+`${integer}${decimal.slice(0, -1)}` + 1)
    if (isZero) {
      result = `${+result.slice(0, 1) - 1}${result.slice(1)}`
    }
    if (digit > 0) {
      return `${sign}${result.slice(0, -digit) || 0}.${result.slice(-digit)}`
    } else {
      return `${sign}${result}`
    }
  }
}
