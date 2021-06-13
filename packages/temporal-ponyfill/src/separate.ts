import { msToIsoDate } from './convert'
import { Duration } from './duration'
import { PlainDate, PlainDateTime, PlainTime } from './plainDateTime'
import { dateValue, msFor } from './utils'

export const extractTimeMs = ({
  isoHour,
  isoMinute,
  isoSecond,
  isoMillisecond,
}: PlainTime): number => {
  return (
    isoHour * msFor.hours +
    isoMinute * msFor.minutes +
    isoSecond * msFor.seconds +
    isoMillisecond * msFor.milliseconds
  )
}

export const extractTimeWithDaysMs = ({
  isoDay,
  ...isoTime
}: PlainTime & Pick<PlainDate, 'isoDay'>): number => {
  return extractTimeMs(isoTime) + isoDay * msFor.days
}

export const separateDuration = (
  duration: Duration
): [macroDuration: Duration, durationTimeMs: number] => {
  return [
    new Duration(
      duration.years,
      duration.months,
      duration.weeks,
      duration.days
    ),
    extractTimeMs({
      isoHour: duration.hours,
      isoMinute: duration.minutes,
      isoSecond: duration.seconds,
      isoMillisecond: duration.milliseconds,
    }),
  ]
}

export const separateDateTime = (
  date: PlainDateTime,
  minTimeMs = 0
): [isoDate: PlainDate, timeOfDayMs: number] => {
  const {
    isoYear,
    isoMonth,
    isoDay,
    isoHour,
    isoMinute,
    isoSecond,
    isoMillisecond,
  } = msToIsoDate(date.epochMilliseconds)
  const jsDate = new Date(dateValue({ isoYear, isoMonth, isoDay }))
  let ms = extractTimeMs({ isoHour, isoMinute, isoSecond, isoMillisecond })

  if (ms < minTimeMs) {
    jsDate.setUTCDate(jsDate.getUTCDate() - 1)
    ms += msFor.days
  }
  return [
    {
      isoYear: jsDate.getUTCFullYear(),
      isoMonth: jsDate.getUTCMonth() + 1,
      isoDay: jsDate.getUTCDate(),
    },
    ms,
  ]
}