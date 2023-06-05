import { HebrewCalendar, Location, gematriya } from '@hebcal/core';

const EREV = 1048576;
const skip = [
  'תענית בכורות',
  'צום גדליה',
  'צום תמוז',
  "תענית אסתר",
  "עשרה בטבת",

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

const options = {
  start: new Date("2021/01/01"),
  end: new Date("2023/01/01"),
  isHebrewYear: false,
  candlelighting: false,
  location: Location.lookup('Jerusalem'),
  sedrot: false,
  omer: false,
  noSpecialShabbat: true,
  noModern: false,
  noRoshChodesh: true,
  noMinorFast: true,
  addHebrewDates: true,
};

const events = HebrewCalendar.calendar(options);

const days = {}

for (const ev of events) {
  const hd = ev.getDate();
  const key = hd.greg().toLocaleDateString("en-GB")

  let dateRow = false;
  if (!days[key]) {
    days[key] = []
    dateRow = true;
  }

  const data = ev.render('he-x-NoNikud');

  if (!dateRow) {
    if (ev.chanukahDay) {
      days[key].push("חנוכה " + gematriya(ev.chanukahDay))
    }
    else if (skip.indexOf(data) < 0 && data.indexOf("חנוכה:") < 0 && (ev.mask & EREV) === 0) {
      days[key].push(data)
    }
  }
  else {
    const datArr = data.split(" ");

    if (datArr.length == 4) {
      datArr[1] = datArr[1] + " " + datArr[2];
      datArr.splice(2, 1);
    }
    days[key] = datArr
  }
}

for (let nxt in days) {
  console.log(nxt + ";" + days[nxt].concat(new Array(5 - days[nxt].length)).join(";") + ";")
}
