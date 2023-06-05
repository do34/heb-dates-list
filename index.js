import { HebrewCalendar, Location, gematriya } from '@hebcal/core';
import dateFormat from "dateformat";

const dateOutputFormat = "yyyy-mm-dd";
const mainOptions = {
  start: new Date("2021/01/01"),
  end: new Date("2023/12/31"),
  location: Location.lookup('Jerusalem'),
  sedrot: false,
  omer: false,
  noModern: false,
  noSpecialShabbat: true,
  noRoshChodesh: true,
  noMinorFast: true
}

const skip = [
  'צום גדליה',
  "עשרה בטבת",
  "תענית אסתר",
  'תענית בכורות',
  'צום תמוז',

  "טו בשבט",
  "פורים קטן",
  "שושן פורים קטן",
  "פורים משולש",
  'פסח שני',
  "ל״ג בעומר",
  "טו באב",
  'סליחות',

  'ראש השנה למעשר בהמה',

  'חג הבנות',
  "סיגד",
  "יום בן־גוריון",
  "יום העליה",
  "יום הרצל",
  "יום ז׳בוטינסקי",
  "יום הזכרון ליצחק רבין",
  "שמירת בית הספר ליום העליה",
  "יום המשפחה"
]

const EREV = 1048576;

const options = Object.assign(mainOptions, {
  isHebrewYear: false,
  candlelighting: false,
  addHebrewDates: true,
});

const events = HebrewCalendar.calendar(options);
const days = {}

for (const ev of events) {
  const hd = ev.getDate();
  const commonDate = dateFormat(hd.greg(), dateOutputFormat);
  const data = ev.render('he-x-NoNikud');

  if (!days[commonDate]) {
    days[commonDate] = []
    // split by first and last space (needed for adar alef/beth)
    const regex = /^([^ ]*) | (?=[^ ]*$)/g;
    days[commonDate] = data.split(regex).filter(n => n);
  }
  else {
    if (ev.chanukahDay) {
      days[commonDate].push("חנוכה " + gematriya(ev.chanukahDay))
    }
    else if (skip.indexOf(data) < 0 && data.indexOf("חנוכה:") < 0 && (ev.mask & EREV) === 0) {
      days[commonDate].push(data)
    }
  }
}

for (let nxt in days) {
  console.log([nxt].concat(days[nxt], new Array(6 - days[nxt].length)).join(";"))
}