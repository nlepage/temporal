/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { assert } from 'chai'
import { Calendar, PlainDate, PlainMonthDay } from '../impl'

declare const Temporal: never // don't use global
type InvalidArg = any
type ValidArg = any

const { throws, equal, notEqual } = assert

describe('MonthDay', () => {
  describe('Construction', () => {
    it('Leap day', () => equal(`${new PlainMonthDay(2, 29)}`, '02-29'))
    describe('.from()', () => {
      it('MonthDay.from(10-01) == 10-01', () => equal(`${PlainMonthDay.from('10-01')}`, '10-01'))
      it('MonthDay.from(2019-10-01T09:00:00Z) == 10-01', () =>
        equal(`${PlainMonthDay.from('2019-10-01T09:00:00Z')}`, '10-01'))
      it("MonthDay.from('11-18') == (11-18)", () => equal(`${PlainMonthDay.from('11-18')}`, '11-18'))
      it("MonthDay.from('1976-11-18') == (11-18)", () => equal(`${PlainMonthDay.from('1976-11-18')}`, '11-18'))
      it('MonthDay.from({ monthCode: "M11", day: 18 }) == 11-18', () =>
        equal(`${PlainMonthDay.from({ monthCode: 'M11', day: 18 })}`, '11-18'))
      it('ignores year when determining the ISO reference year from month/day', () => {
        const one = PlainMonthDay.from({ year: 2019, month: 11, day: 18 })
        const two = PlainMonthDay.from({ year: 1979, month: 11, day: 18 })
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('ignores era/eraYear when determining the ISO reference year from month/day', () => {
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, month: 11, day: 18, calendar: 'gregory' } as ValidArg)
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, month: 11, day: 18, calendar: 'gregory' } as ValidArg)
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('ignores year when determining the ISO reference year from monthCode/day', () => {
        const one = PlainMonthDay.from({ year: 2019, monthCode: 'M11', day: 18 } as ValidArg)
        const two = PlainMonthDay.from({ year: 1979, monthCode: 'M11', day: 18 } as ValidArg)
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('ignores era/eraYear when determining the ISO reference year from monthCode/day', () => {
        const one = PlainMonthDay.from({ era: 'ce', eraYear: 2019, monthCode: 'M11', day: 18, calendar: 'gregory' } as ValidArg)
        const two = PlainMonthDay.from({ era: 'ce', eraYear: 1979, monthCode: 'M11', day: 18, calendar: 'gregory' } as ValidArg)
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('MonthDay.from(11-18) is not the same object', () => {
        const orig = new PlainMonthDay(11, 18)
        const actu = PlainMonthDay.from(orig)
        notEqual(actu, orig)
      })
      it('ignores year when determining the ISO reference year from other Temporal object', () => {
        const plainDate1 = PlainDate.from('2019-11-18')
        const plainDate2 = PlainDate.from('1976-11-18')
        const one = PlainMonthDay.from(plainDate1)
        const two = PlainMonthDay.from(plainDate2)
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('MonthDay.from({month, day}) allowed if calendar absent', () =>
        equal(`${PlainMonthDay.from({ month: 11, day: 18 })}`, '11-18'))
      it('MonthDay.from({month, day}) not allowed in explicit ISO calendar', () =>
        throws(() => PlainMonthDay.from({ month: 11, day: 18, calendar: 'iso8601' } as InvalidArg), TypeError))
      it('MonthDay.from({month, day}) not allowed in other calendar', () =>
        throws(() => PlainMonthDay.from({ month: 11, day: 18, calendar: 'gregory' } as InvalidArg), TypeError))
      it('MonthDay.from({year, month, day}) allowed in other calendar', () => {
        equal(
          `${PlainMonthDay.from({ year: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]',
        )
      })
      it('MonthDay.from({era, eraYear, month, day}) allowed in other calendar', () => {
        equal(
          `${PlainMonthDay.from({ era: 'ce', eraYear: 1970, month: 11, day: 18, calendar: 'gregory' })}`,
          '1972-11-18[u-ca=gregory]',
        )
      })
      it('MonthDay.from({ day: 15 }) throws', () => throws(() => PlainMonthDay.from({ day: 15 } as InvalidArg), TypeError))
      it('MonthDay.from({ monthCode: "M12" }) throws', () =>
        throws(() => PlainMonthDay.from({ monthCode: 'M12' } as InvalidArg), TypeError))
      it('MonthDay.from({}) throws', () => throws(() => PlainMonthDay.from({} as InvalidArg), TypeError))
      it('MonthDay.from(required prop undefined) throws', () =>
        throws(() => PlainMonthDay.from({ monthCode: undefined, day: 15 } as InvalidArg), TypeError))
      it('MonthDay.from(number) is converted to string', () =>
        assert(PlainMonthDay.from(1201 as ValidArg).equals(PlainMonthDay.from('12-01'))))
      it('basic format', () => {
        equal(`${PlainMonthDay.from('1118')}`, '11-18')
      })
      it('mixture of basic and extended format', () => {
        equal(`${PlainMonthDay.from('1976-11-18T152330.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('19761118T15:23:30.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('1976-11-18T15:23:30.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('1976-11-18T152330.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('19761118T15:23:30.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('19761118T152330.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('19761118T152330.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('+001976-11-18T152330.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('+0019761118T15:23:30.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('+001976-11-18T15:23:30.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('+001976-11-18T152330.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('+0019761118T15:23:30.1+0000')}`, '11-18')
        equal(`${PlainMonthDay.from('+0019761118T152330.1+00:00')}`, '11-18')
        equal(`${PlainMonthDay.from('+0019761118T152330.1+0000')}`, '11-18')
      })
      it('optional parts', () => {
        equal(`${PlainMonthDay.from('1976-11-18T15:23')}`, '11-18')
        equal(`${PlainMonthDay.from('1976-11-18T15')}`, '11-18')
        equal(`${PlainMonthDay.from('1976-11-18')}`, '11-18')
      })
      it('RFC 3339 month-day syntax', () => {
        equal(`${PlainMonthDay.from('--11-18')}`, '11-18')
        equal(`${PlainMonthDay.from('--1118')}`, '11-18')
      })
      it('ignores year when determining the ISO reference year from string', () => {
        const one = PlainMonthDay.from('2019-11-18')
        const two = PlainMonthDay.from('1976-11-18')
        equal(one.getISOFields().isoYear, two.getISOFields().isoYear)
      })
      it('no junk at end of string', () => throws(() => PlainMonthDay.from('11-18junk'), RangeError))
      it('options may only be an object or undefined', () => {
        [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions: InvalidArg) =>
          throws(() => PlainMonthDay.from({ month: 11, day: 18 }, badOptions), TypeError),
        );
        [{}, () => {}, undefined].forEach((options) =>
          equal(`${PlainMonthDay.from({ month: 11, day: 18 }, options)}`, '11-18'),
        )
      })
      describe('Overflow', () => {
        const bad = { month: 1, day: 32 }
        it('reject', () => throws(() => PlainMonthDay.from(bad, { overflow: 'reject' }), RangeError))
        it('constrain', () => {
          equal(`${PlainMonthDay.from(bad)}`, '01-31')
          equal(`${PlainMonthDay.from(bad, { overflow: 'constrain' })}`, '01-31')
        })
        it('throw on bad overflow', () => {
          [new PlainMonthDay(11, 18), { month: 1, day: 1 }, '01-31'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow: InvalidArg) =>
              throws(() => PlainMonthDay.from(input, { overflow }), RangeError),
            )
          })
        })
        it('constrain has no effect on invalid ISO string', () => {
          throws(() => PlainMonthDay.from('13-34', { overflow: 'constrain' }), RangeError)
        })
      })
      describe('Leap day', () => {
        ['reject', 'constrain'].forEach((overflow: any) =>
          it(overflow, () => equal(`${PlainMonthDay.from({ month: 2, day: 29 }, { overflow })}`, '02-29')),
        )
        it("rejects when year isn't a leap year", () =>
          throws(() => PlainMonthDay.from({ month: 2, day: 29, year: 2001 }, { overflow: 'reject' }), RangeError))
        it('constrains non-leap year', () =>
          equal(`${PlainMonthDay.from({ month: 2, day: 29, year: 2001 }, { overflow: 'constrain' })}`, '02-28'))
      })
      describe('Leap day with calendar', () => {
        it('requires year with calendar', () =>
          throws(
            () => PlainMonthDay.from({ month: 2, day: 29, calendar: 'iso8601' } as InvalidArg, { overflow: 'reject' }),
            TypeError,
          ))
        it('rejects leap day with non-leap year', () =>
          throws(
            () => PlainMonthDay.from({ month: 2, day: 29, year: 2001, calendar: 'iso8601' }, { overflow: 'reject' }),
            RangeError,
          ))
        it('constrains leap day', () =>
          equal(
            `${PlainMonthDay.from({ month: 2, day: 29, year: 2001, calendar: 'iso8601' }, { overflow: 'constrain' })}`,
            '02-28',
          ))
        it('accepts leap day with monthCode', () =>
          equal(
            `${PlainMonthDay.from({ monthCode: 'M02', day: 29, calendar: 'iso8601' }, { overflow: 'reject' })}`,
            '02-29',
          ))
      })
      it('object must contain at least the required correctly-spelled properties', () => {
        throws(() => PlainMonthDay.from({} as InvalidArg), TypeError)
        throws(() => PlainMonthDay.from({ months: 12, day: 31 } as InvalidArg), TypeError)
      })
      it('incorrectly-spelled properties are ignored', () => {
        equal(`${PlainMonthDay.from({ month: 12, day: 1, days: 31 } as ValidArg)}`, '12-01')
      })
    })
    describe('getters', () => {
      const md = new PlainMonthDay(1, 15)
      it("(1-15).monthCode === '1'", () => {
        equal(md.monthCode, 'M01')
      })
      it("(1-15).day === '15'", () => {
        equal(`${md.day}`, '15')
      })
      it('month is undefined', () => equal((md as InvalidArg).month, undefined))
    })
    describe('.with()', () => {
      const md = PlainMonthDay.from('01-22')
      it('with(12-)', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-22'))
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'))
    })
  })
  describe('MonthDay.with()', () => {
    const md = PlainMonthDay.from('01-15')
    it('with({monthCode})', () => equal(`${md.with({ monthCode: 'M12' })}`, '12-15'))
    it('with({month}) not accepted', () => {
      throws(() => md.with({ month: 12 }), TypeError)
    })
    it('with({month, monthCode}) accepted', () => equal(`${md.with({ month: 12, monthCode: 'M12' })}`, '12-15'))
    it('month and monthCode must agree', () => {
      throws(() => md.with({ month: 12, monthCode: 'M11' }), RangeError)
    })
    it('with({year, month}) accepted', () => equal(`${md.with({ year: 2000, month: 12 })}`, '12-15'))
    it('throws on bad overflow', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow: InvalidArg) =>
        throws(() => md.with({ day: 1 }, { overflow }), RangeError),
      )
    })
    it('throws with calendar property', () => {
      throws(() => md.with({ day: 1, calendar: 'iso8601' } as InvalidArg), TypeError)
    })
    it('throws with timeZone property', () => {
      throws(() => md.with({ day: 1, timeZone: 'UTC' } as InvalidArg), TypeError)
    })
    it('options may only be an object or undefined', () => {
      [null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions: InvalidArg) =>
        throws(() => md.with({ day: 1 }, badOptions), TypeError),
      );
      [{}, () => {}, undefined].forEach((options) => equal(`${md.with({ day: 1 }, options)}`, '01-01'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      throws(() => md.with({}), TypeError)
      throws(() => md.with({ months: 12 } as InvalidArg), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      equal(`${md.with({ monthCode: 'M12', days: 1 } as ValidArg)}`, '12-15')
    })
    it('year is ignored when determining ISO reference year', () => {
      equal(md.with({ year: 1900 }).getISOFields().isoYear, md.getISOFields().isoYear)
    })
  })
  describe('MonthDay.equals()', () => {
    const md1 = PlainMonthDay.from('01-22')
    const md2 = PlainMonthDay.from('12-15')
    it('equal', () => assert(md1.equals(md1)))
    it('unequal', () => assert(!md1.equals(md2)))
    it('casts argument', () => {
      assert(md1.equals('01-22'))
      assert(md1.equals({ month: 1, day: 22 }))
    })
    it('object must contain at least the required properties', () => {
      throws(() => md1.equals({ month: 1 } as InvalidArg), TypeError)
    })
    it('takes [[ISOYear]] into account', () => {
      const iso = Calendar.from('iso8601')
      const md1 = new PlainMonthDay(1, 1, iso, 1972)
      const md2 = new PlainMonthDay(1, 1, iso, 2000)
      assert(!md1.equals(md2))
    })
  })
  describe("Comparison operators don't work", () => {
    const md1 = PlainMonthDay.from('02-13')
    const md1again = PlainMonthDay.from('02-13')
    const md2 = PlainMonthDay.from('11-18')
    it('=== is object equality', () => equal(md1, md1))
    it('!== is object equality', () => notEqual(md1, md1again))
    it('<', () => throws(() => md1 < md2))
    it('>', () => throws(() => md1 > md2))
    it('<=', () => throws(() => md1 <= md2))
    it('>=', () => throws(() => md1 >= md2))
  })
  describe('MonthDay.toPlainDate()', () => {
    const md = PlainMonthDay.from('01-22')
    it("doesn't take a primitive argument", () => {
      [2002, '2002', false, 2002n, Symbol('2002'), null].forEach((bad: InvalidArg) => {
        throws(() => md.toPlainDate(bad), TypeError)
      })
    })
    it('takes an object argument with year property', () => {
      equal(`${md.toPlainDate({ year: 2002 })}`, '2002-01-22')
    })
    it('needs at least a year property on the object in the ISO calendar', () => {
      throws(() => md.toPlainDate({ something: 'nothing' } as InvalidArg), TypeError)
    })
    it("constrains if the MonthDay doesn't exist in the year", () => {
      const leapDay = PlainMonthDay.from('02-29')
      equal(`${leapDay.toPlainDate({ year: 2019 })}`, '2019-02-28')
      equal(`${leapDay.toPlainDate({ year: 2019 }, { overflow: 'constrain' })}`, '2019-02-28')
    })
  })
  describe('MonthDay.toString()', () => {
    const md1 = PlainMonthDay.from('11-18')
    const md2 = PlainMonthDay.from({ monthCode: 'M11', day: 18, calendar: 'gregory' })
    it('shows only non-ISO calendar if calendarName = auto', () => {
      equal(md1.toString({ calendarName: 'auto' }), '11-18')
      equal(md2.toString({ calendarName: 'auto' }), '1972-11-18[u-ca=gregory]')
    })
    it('shows ISO calendar if calendarName = always', () => {
      equal(md1.toString({ calendarName: 'always' }), '11-18[u-ca=iso8601]')
    })
    it('omits non-ISO calendar, but not year, if calendarName = never', () => {
      equal(md1.toString({ calendarName: 'never' }), '11-18')
      equal(md2.toString({ calendarName: 'never' }), '1972-11-18')
    })
    it('default is calendar = auto', () => {
      equal(md1.toString(), '11-18')
      equal(md2.toString(), '1972-11-18[u-ca=gregory]')
    })
    it('throws on invalid calendar', () => {
      ['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName: InvalidArg) => {
        throws(() => md1.toString({ calendarName }), RangeError)
      })
    })
  })
  describe('monthDay.getISOFields() works', () => {
    const md1 = PlainMonthDay.from('11-18')
    const fields = md1.getISOFields()
    it('fields', () => {
      equal(fields.isoMonth, 11)
      equal(fields.isoDay, 18)
      equal(fields.calendar.id, 'iso8601')
      equal(typeof fields.isoYear, 'number')
    })
    it('enumerable', () => {
      const fields2 = { ...fields }
      equal(fields2.isoMonth, 11)
      equal(fields2.isoDay, 18)
      equal(fields2.calendar, fields.calendar)
      equal(typeof fields2.isoYear, 'number')
    })
    it('as input to constructor', () => {
      const md2 = new PlainMonthDay(fields.isoMonth, fields.isoDay, fields.calendar, fields.isoYear)
      assert(md2.equals(md1))
    })
  })
})
