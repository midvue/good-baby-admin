import dayjs, { ManipulateType, OpUnitType, QUnitType } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type { DurationUnitType } from 'dayjs/plugin/duration'
dayjs.extend(duration)

/**
 * 使用dayjs的实例
 * @param  date - 日期
 * @param  fmt -格式 YYYY-MM-DD HH:mm:ss
 * @example
 * ```ts
 *  //默认当前时间,返回dayjs()实例,可以format,diff,subtract等方法
 *  useDate().format('YYYY-MM-DD HH:mm:ss')
 *  //指定时间戳
 *  useDate(1709286300000).format('YYYY-MM-DD HH:mm:ss')
 *  useDate(2024-03-02 00:00)
 *  useDate(new Date(2024, 2, 1))
 * ```
 */
export const useDate = (date?: dayjs.ConfigType, format?: dayjs.OptionType, strict?: boolean) => {
  const dateNum = Number(date)
  const d = isNaN(dateNum) ? date : dateNum
  return dayjs(d, format, strict)
}

/**
 * 给定日期转成特点格式字符串
 * @param  date - 日期
 * @param  fmt -格式 YYYY-MM-DD HH:mm:ss
 * @example
 * ```ts
 *  dateFormat(1709286300000,'YYYY-MM-DD')
 *  dateFormat(2024-03-02 00:00,'YYYY-MM-DD')
 *  dateFormat(new Date(2024, 2, 1),'YYYY-MM-DD HH:mm')
 * ```
 */
export const dateFormat = (date: dayjs.ConfigType, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (date === null || date === '') return ''
  return useDate(date).format(fmt)
}

/**
 * 返回当前时间,默认到分钟的格式
 * @param date - 日期
 * @param fmt - 格式
 * @returns date-日期 YYYY-MM-DD HH:mm
 * @example
 * ```ts
 *  minute(1709286300000)
 *  minute(2024-03-02 00:00)
 *  minute(new Date(2024, 2, 1))
 * ```
 */
export const minute = (date: dayjs.ConfigType, fmt = 'YYYY-MM-DD HH:mm') => {
  if (date === null || date === '') return ''
  return useDate(date).format(fmt)
}

/**
 * 返回月份天数
 * @param date -  日期
 * @returns 天数
 */
export const dateMonthDays = (date?: dayjs.ConfigType) => {
  return dayjs(date).daysInMonth()
}

/**
 * 返回前后i天的日期字符串
 * @param  i - 0返回今天的日期、1返回明天的日期，2返回后天得日期，依次类推
 * @param format- 格式 YYYY-MM-DD
 * @returns  format 格式的起始日期字符串
 * ```ts
 *  getCurrDate()
 *  getCurrDate(1)
 * ```
 */
export function getCurrDate(i = 0, format = 'YYYY-MM-DD'): string {
  return dateFormat(dayjs().add(i, 'day'), format)
}

/**
 * 返回指定单位下两个日期时间之间的差异。
 * @param  date1 -第一个时间
 * @param  date2 -第二个时间,默认是今天
 * @returns  两个日期时间之间的差异时间戳
 * @example
 * ```ts
 *  dateDiff(1709286300000)
 *  dateDiff(1709286300000,1709286400000)
 * ```
 */
export function dateDiff(
  date1: dayjs.ConfigType,
  date2?: dayjs.ConfigType,
  unit?: QUnitType | OpUnitType
): number {
  if (!date1) return 0
  if (!date2) date2 = undefined
  const _date1 = useDate(date1)
  const _date2 = useDate(date2)
  return useDate(_date1).diff(_date2, unit)
}

type Format = {
  minuteAgo?: string
  today?: string
  yesterday?: string
  future?: string
  other?: string
}

/**
 * 根据指定日期距今天日期的时间差,展示不同格式。
 * - 时间差小于1小时，展示为 X分钟前
 * - 时间差-今天内，展示为 今天 HH:MM
 * - 时间差-昨天的时间，展示为 昨天 HH:MM
 * - 其他，展示为 YYYY/MM/DD
 * @param  date - 指定日期
 * @example
 * ```ts
 *  dateFromNow('2024-03-02 00:00')
 *  dateFromNow('2024-03-02 00:00',{ minuteAgo: '${m} 分钟前'})
 *  dateFromNow('2024-03-02 00:00', { other: `${YYYY-MM-DD}`})
 * ```
 */
export function dateFromNow(date: dayjs.ConfigType, _format?: Format): string {
  const format = {
    zero: '刚刚',
    minuteAgo: '${m}分钟前',
    today: '今天 ${HH:mm}',
    yesterday: '昨天 ${HH:mm}',
    other: '${YYYY/MM/DD}',
    future: '${YYYY/MM/DD}',
    ..._format,
  }
  const now = dayjs()
  const targetDate = useDate(date)

  const diffMinutes = now.diff(targetDate, 'minute')

  const formatString = (formatStr: string) => {
    if (formatStr === format.zero) return formatStr
    return formatStr.replace(/\${(.*?)}/g, (_, p1) => targetDate.format(p1))
  }

  if (diffMinutes < 0) {
    // 如果传入的时间大于今天，展示格式：future
    return formatString(format.future)
  } else if (diffMinutes < 60) {
    return format.minuteAgo.replace('${m}', `${Math.abs(diffMinutes)}`)
  } else if (targetDate.isSame(now, 'day')) {
    // 超过1小时且为当天的：格式示例：今天 12:23
    return formatString(format.today)
  } else if (targetDate.isSame(now.subtract(1, 'day'), 'day')) {
    // 过了当天的展示格式示例：昨天 12:33
    return formatString(format.yesterday)
  } else {
    return formatString(format.other)
  }
}

/**
 * 计算两个日期之间的差值(自然年月日)
 * @param  startDate - 起始日期，格式为 'YYYY-MM-DD HH:mm:ss'
 * @param  endDate - 结束日期，格式为 'YYYY-MM-DD HH:mm:ss'
 * @param format - 输出格式，如 'YY年MM月DD日', 'HH小时mm分钟ss秒' 等 (默认YY年MM个月DD天)
 * @returns  根据格式包含差值的字符串
 */
export function dateDiffFormat(
  startDate: string | number | Date,
  endDate?: string | number | Date,
  format = 'YY年MM个月DD天'
) {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const units = {
    YY: 'year',
    MM: 'month',
    DD: 'day',
    HH: 'hour',
    mm: 'minute',
    ss: 'second',
  } as Record<string, any>

  let result = format
  let currentStart = start

  for (const [key, value] of Object.entries(units)) {
    if (result.includes(key)) {
      const diff = end.diff(currentStart, value)
      result = result.replace(key, diff > 0 ? '' + diff : '0')
      currentStart = currentStart.add(diff, value)
    }
  }
  return result.trim().replace(/\s+/g, ' ') // 去掉多余的空格
}

export function durationFormat(
  duration: string | number,
  config?: {
    unit?: DurationUnitType
    format?: string
  }
): string

export function durationFormat(
  duration: string | number,
  config?: {
    unit?: DurationUnitType
    format: Array<string>
  }
): Array<string>

/**
 * 根据传入的数值，返回格式化后的时间
 * @param  duration -传入的数值
 * @param  config - 可选的配置项(默认 unit='ms',format=''HH小时mm分钟')
 * 
 * - unit 代表duration的值是什么单位, ('d' | 'D' | 'M' | 'y' |'H' | 'h' | 'm' | 's' | 'ms')
   - format 返回的数据格式 (比如:'HH小时mm分钟',  ['D','H','m']等)
 * @returns  格式化后的时间
 * @example
 * ```ts
    const m = durationFormat(61, {
      unit: 'm',
    })
    const _date = durationFormat(61, {
      unit: 'm',
      format: 'HH:mm',
    })
 * ``` 
 */
export function durationFormat(
  duration: string | number,
  config?: {
    unit?: DurationUnitType
    format?: Array<string> | string
  }
): Array<string> | string {
  if (!duration) return ''
  const { format = 'HH小时mm分钟', unit = 'ms' } = config || {}
  const _duration = dayjs.duration(Number(duration), unit)
  if (Array.isArray(format)) {
    return format.map((key) => {
      return _duration.format(key)
    })
  }
  return formatDate(format, duration, unit)
}

/**
 * 根据传入的数值，返回格式化后的时间(会自动去掉为0的格式)
 * @param  duration -传入的数值
 * @param  config - 可选的配置项(默认 unit='ms',format=''HH小时mm分钟')
 * 
 * - unit 代表duration的值是什么单位, ('d' | 'D' | 'M' | 'y' |'H' | 'h' | 'm' | 's' | 'ms')
   - format 返回的数据格式 (比如:'HH小时mm分钟',  ['D','H','m']等)
 * @returns  格式化后的时间
 * @example
 * ```ts
    const m = durationFormatNoZero(61, {
      unit: 'm',
    })
    const _date = durationFormatNoZero(61, {
      unit: 'm',
      format: 'HH:mm',
    })
 * ``` 
 */
export function durationFormatNoZero(
  duration: string | number,
  config?: {
    unit?: DurationUnitType
    format?: string
  }
): Array<string> | string {
  if (!duration) return ''
  const { format = 'D天H小时m分钟', unit = 'ms' } = config || {}
  const dateStr = formatDate(format, duration, unit)
  return dateStr.replace(/(?<![1-9]\d*)0+([^\d]+)/g, '').trim()
}

/** 格式化时间 */
function formatDate(format = 'HH小时mm分钟', duration: string | number, unit: DurationUnitType) {
  const _duration = dayjs.duration(Number(duration), unit)

  if (format.includes('D') && format.includes('H')) {
    const hours = Math.floor(_duration.asHours() % 24) + ''
    format = format.includes('HH')
      ? format.replace('HH', hours.padStart(2, '0'))
      : format.replace('H', hours)
  }

  const reqArray = format.match(/[YMDHms]/g) || []
  let dateStr = _duration.format(format)

  const _replaceDuration = (dateStr: string, source: string) => {
    return dateStr.replace(/\d+/, `${Math.floor(+source)}`)
  }
  switch (reqArray[0]) {
    case 'Y':
      break
    case 'M':
      if (_duration.asMonths() >= 12) {
        dateStr = _replaceDuration(dateStr, `${_duration.asMonths()}`)
      }
      break
    case 'D':
      if (_duration.asDays() >= 30) {
        dateStr = _replaceDuration(dateStr, `${_duration.asDays()}`)
      }
      break
    case 'H':
      if (_duration.asHours() >= 24) {
        dateStr = _replaceDuration(dateStr, `${_duration.asHours()}`)
      }
      break
    case 'm':
      if (_duration.asMinutes() >= 60) {
        dateStr = _replaceDuration(dateStr, `${_duration.asMinutes()}`)
      }
      break
    case 's':
      if (_duration.asSeconds() >= 60) {
        dateStr = _replaceDuration(dateStr, `${_duration.asSeconds()}`)
      }
      break
  }
  return dateStr
}
