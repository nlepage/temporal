import { mstoIsoDate } from './convert'
import { Calendar } from './calendar'
import { PlainDateTime } from './plainDateTime'
import { TimeZone } from './timeZone'
import { CalendarId, TimeZoneId } from './types'
import { ZonedDateTime } from './zonedDateTime'

export class Now {
  static instant(): number {
    return Date.now()
  }
  static epochMilliseconds(): number {
    return this.instant()
  }

  static timeZone(): TimeZone {
    return new TimeZone(
      Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZoneId
    )
  }

  static zonedDateTime(calendar?: CalendarId | Calendar): ZonedDateTime {
    return new ZonedDateTime(this.instant(), undefined, calendar)
  }

  static zonedDateTimeISO(): ZonedDateTime {
    return this.zonedDateTime()
  }

  static plainDateTime(calendar?: CalendarId | Calendar): PlainDateTime {
    const {
      isoYear,
      isoMonth,
      isoDay,
      isoHour,
      isoMinute,
      isoSecond,
      isoMillisecond,
    } = mstoIsoDate(this.instant())
    return new PlainDateTime(
      isoYear,
      isoMonth + 1,
      isoDay,
      isoHour,
      isoMinute,
      isoSecond,
      isoMillisecond,
      calendar
    )
  }

  static plainDateTimeISO(): PlainDateTime {
    return this.plainDateTime()
  }
}
