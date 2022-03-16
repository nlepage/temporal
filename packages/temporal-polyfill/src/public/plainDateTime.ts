import { extractCalendar, getStrangerCalendar } from '../argParse/calendar'
import { parseCalendarDisplayOption } from '../argParse/calendarDisplay'
import { dateTimeFieldMap } from '../argParse/fieldStr'
import { parseTimeToStringOptions } from '../argParse/isoFormatOptions'
import { OVERFLOW_REJECT, parseOverflowOption } from '../argParse/overflowHandling'
import { refineFields, refineOverrideFields } from '../argParse/refine'
import { timeUnitNames } from '../argParse/unitStr'
import { AbstractISOObj, ensureObj } from '../dateUtils/abstract'
import { createDate } from '../dateUtils/date'
import {
  addToDateTime,
  compareDateTimes,
  constrainDateTimeISO,
  createDateTime,
  dateTimeFieldsToISO,
  diffDateTimes,
  overrideDateTimeFields,
  roundDateTime,
  roundDateTimeWithOptions,
} from '../dateUtils/dateTime'
import { validateDateTime } from '../dateUtils/isoFieldValidation'
import { formatCalendarID, formatDateTimeISO } from '../dateUtils/isoFormat'
import {
  DateCalendarFields,
  dateCalendarFields,
  mixinCalendarFields,
  mixinISOFields,
} from '../dateUtils/mixins'
import { parseDateTimeISO, refineDateTimeParse } from '../dateUtils/parse'
import { TimeFields, createTime, ensureLooseTime } from '../dateUtils/time'
import { createYearMonth } from '../dateUtils/yearMonth'
import { FormatConfig, buildPlainFormatConfig } from '../native/intlFactory'
import { ToLocaleStringMethods, mixinLocaleStringMethods } from '../native/intlMixins'
import { Calendar, createDefaultCalendar } from './calendar'
import { Duration } from './duration'
import { PlainDate } from './plainDate'
import { PlainMonthDay } from './plainMonthDay'
import { PlainTime } from './plainTime'
import { PlainYearMonth } from './plainYearMonth'
import { TimeZone } from './timeZone'
import {
  CalendarArg,
  CompareResult,
  DateArg,
  DateTimeArg,
  DateTimeISOFields,
  DateTimeLikeFields,
  DateTimeOverrides,
  DateTimeRoundingOptions,
  DateTimeToStringOptions,
  DiffOptions,
  Disambiguation,
  DurationArg,
  OverflowOptions,
  TimeArg,
  TimeZoneArg,
} from './types'
import { ZonedDateTime } from './zonedDateTime'

export class PlainDateTime extends AbstractISOObj<DateTimeISOFields> {
  constructor(
    isoYear: number,
    isoMonth: number,
    isoDay: number,
    isoHour = 0,
    isoMinute = 0,
    isoSecond = 0,
    isoMillisecond = 0,
    isoMicrosecond = 0,
    isoNanosecond = 0,
    calendarArg: CalendarArg = createDefaultCalendar(),
  ) {
    const constrained = constrainDateTimeISO({
      isoYear,
      isoMonth,
      isoDay,
      isoHour,
      isoMinute,
      isoSecond,
      isoMillisecond,
      isoMicrosecond,
      isoNanosecond,
    }, OVERFLOW_REJECT)
    const calendar = ensureObj(Calendar, calendarArg)

    validateDateTime(constrained, calendar.id)

    super({
      ...constrained,
      calendar,
    })
  }

  static from(arg: DateTimeArg, options?: OverflowOptions): PlainDateTime {
    const overflowHandling = parseOverflowOption(options)

    return createDateTime(
      arg instanceof PlainDateTime
        ? arg.getISOFields() // optimization
        : typeof arg === 'object'
          ? dateTimeFieldsToISO(
            refineFields(arg, dateTimeFieldMap) as DateTimeLikeFields,
            options,
            overflowHandling,
            extractCalendar(arg),
          )
          : refineDateTimeParse(parseDateTimeISO(String(arg))),
    )
  }

  static compare(a: DateTimeArg, b: DateTimeArg): CompareResult {
    return compareDateTimes(
      ensureObj(PlainDateTime, a),
      ensureObj(PlainDateTime, b),
    )
  }

  with(fields: DateTimeOverrides, options?: OverflowOptions): PlainDateTime {
    const refinedFields = refineOverrideFields(fields, dateTimeFieldMap)
    const mergedFields = overrideDateTimeFields(refinedFields, this)
    return createDateTime(
      dateTimeFieldsToISO(
        mergedFields,
        options,
        parseOverflowOption(options),
        this.calendar,
      ),
    )
  }

  withPlainDate(dateArg: DateArg): PlainDateTime {
    const date = ensureObj(PlainDate, dateArg)
    return createDateTime({
      ...this.getISOFields(), // provides time fields
      ...date.getISOFields(),
      calendar: getStrangerCalendar(this, date),
    })
  }

  withPlainTime(timeArg?: TimeArg): PlainDateTime {
    return createDateTime({
      ...this.getISOFields(), // provides date & calendar fields
      ...ensureLooseTime(timeArg).getISOFields(),
    })
  }

  withCalendar(calendarArg: CalendarArg): PlainDateTime {
    return createDateTime({
      ...this.getISOFields(),
      calendar: ensureObj(Calendar, calendarArg),
    })
  }

  add(durationArg: DurationArg, options?: OverflowOptions): PlainDateTime {
    return addToDateTime(this, ensureObj(Duration, durationArg), options)
  }

  subtract(durationArg: DurationArg, options?: OverflowOptions): PlainDateTime {
    return addToDateTime(this, ensureObj(Duration, durationArg).negated(), options)
  }

  until(other: DateTimeArg, options?: DiffOptions): Duration {
    return diffDateTimes(this, ensureObj(PlainDateTime, other), options)
  }

  since(other: DateTimeArg, options?: DiffOptions): Duration {
    return diffDateTimes(this, ensureObj(PlainDateTime, other), options, true)
  }

  round(options: DateTimeRoundingOptions): PlainDateTime {
    return roundDateTimeWithOptions(this, options)
  }

  equals(other: DateTimeArg): boolean {
    return compareDateTimes(this, ensureObj(PlainDateTime, other)) === 0
  }

  toString(options?: DateTimeToStringOptions): string {
    const formatConfig = parseTimeToStringOptions(options)
    const calendarDisplay = parseCalendarDisplayOption(options)
    const isoFields = roundDateTime(
      this,
      formatConfig.roundingIncrement,
      formatConfig.roundingMode,
    ).getISOFields() // TODO: somehow have ISO fields returned directly

    return formatDateTimeISO(isoFields, formatConfig) +
      formatCalendarID(isoFields.calendar.id, calendarDisplay)
  }

  // workhorse for converting to ZonedDateTime for other objects
  toZonedDateTime(
    timeZoneArg: TimeZoneArg,
    options?: { disambiguation?: Disambiguation },
  ): ZonedDateTime {
    const timeZone = ensureObj(TimeZone, timeZoneArg)
    const instant = timeZone.getInstantFor(this, options)

    return new ZonedDateTime(
      instant.epochNanoseconds,
      timeZone,
      this.calendar,
    )
  }

  toPlainYearMonth(): PlainYearMonth { return createYearMonth(this.getISOFields()) }
  toPlainMonthDay(): PlainMonthDay { return this.calendar.monthDayFromFields(this) }
  toPlainDate(): PlainDate { return createDate(this.getISOFields()) }
  toPlainTime(): PlainTime { return createTime(this.getISOFields()) }
}

// mixin
export interface PlainDateTime extends DateCalendarFields { calendar: Calendar }
export interface PlainDateTime extends TimeFields {}
export interface PlainDateTime extends ToLocaleStringMethods {}
mixinISOFields(PlainDateTime, timeUnitNames)
mixinCalendarFields(PlainDateTime, dateCalendarFields)
mixinLocaleStringMethods(PlainDateTime, buildFormatConfig)

// toLocaleString
function buildFormatConfig(
  locales: string[],
  options: Intl.DateTimeFormatOptions,
): FormatConfig<PlainDateTime> {
  return buildPlainFormatConfig(locales, options, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: undefined,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }, {})
}
