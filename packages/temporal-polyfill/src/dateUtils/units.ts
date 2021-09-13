
export type TimeUnitInt = 0 | 1 | 2 | 3 | 4 | 5
export type DateUnitInt = 6 | 7 | 8 | 9
export type UnitInt = TimeUnitInt | DateUnitInt
export type DayTimeUnitInt = 6 | TimeUnitInt

export const NANOSECOND = 0
export const MICROSECOND = 1
export const MILLISECOND = 2
export const SECOND = 3
export const MINUTE = 4
export const HOUR = 5
export const DAY = 6
export const WEEK = 7
export const MONTH = 8
export const YEAR = 9

// TODO: make bigint versions of these? useful for division
export const nanoInMicro = 1000
export const nanoInMilli = 1000000
export const nanoInSecond = 1000000000
export const nanoInMinute = 60000000000
export const nanoInHour = 3600000000000
export const nanoInDay = 84600000000000
export const nanoIn = [
  1,
  nanoInMicro,
  nanoInMilli,
  nanoInSecond,
  nanoInMinute,
  nanoInHour,
  nanoInDay,
]
export const milliInDay = 84600000
export const milliInMin = 60000

export const unitDigitMap = [ // how many digits after the decimal point for a seconds value
  9, // nanoseconds
  6, // microseconds
  3, // milliseconds
]

export function isDayTimeUnit(unit: UnitInt): unit is DayTimeUnitInt {
  return unit <= DAY
}

export function isDateUnit(unit: UnitInt): unit is DateUnitInt {
  return unit >= DAY
}