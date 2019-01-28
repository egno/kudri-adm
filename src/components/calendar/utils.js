export function dateInTimeZone(date, tz) {
  if (!tz) {
    return date;
  }
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 60000 * tz);
}

export function dateInLocalTimeZone(date) {
  const d = new Date(date);
  const l = d.getTime() - d.getTimezoneOffset() * 60000;
  return new Date(l);
}

export function fixLocalTimeZone(date, tz) {
  if (!tz) {
    return date;
  }
  const d = new Date(date);
  const utc = d.getTime() - d.getTimezoneOffset() * 60000;
  return new Date(utc - 60000 * tz);
}

export function getISOTimeZoneOffset(s) {
  let t = s.slice(-6);
  return +(t.slice(0, 1) + '1') * (+t.slice(1, 3) * 60 + +t.slice(-2));
}

export function valueDate(value) {
  return value ? Date.parse(value) : undefined;
}

export function formatDate(date) {
  if (!date) return;
  let d = date;
  return [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-');
}

export function formatTime(date) {
  if (!date) return;
  let d = date;
  // console.log(date, d);
  return [
    ('0' + d.getHours()).slice(-2),
    ('0' + d.getMinutes()).slice(-2)
  ].join(':');
}

export function areSameDates(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function chunkArray(inputArray, chunkSize) {
  const results = [];
  while (inputArray.length) {
    results.push(inputArray.splice(0, chunkSize));
  }
  return results;
}

export function getRESTTime(s) {
  if (!s) {
    return;
  }
  return s.slice(11, 16);
}

export function monthDates(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  const today = new Date();
  // append prev month dates
  const startDay = date.getDay() || 7;
  if (startDay > 1) {
    for (let i = startDay - 2; i >= 0; i--) {
      const prevDate = new Date(date);
      prevDate.setDate(-i);
      days.push({ outOfRange: true, date: prevDate });
    }
  }
  while (date.getMonth() === month) {
    days.push({ date: new Date(date) });
    date.setDate(date.getDate() + 1);
  }
  // append next month dates
  const daysLeft = 7 - (days.length % 7);
  for (let i = 1; i <= daysLeft; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(i);
    days.push({ outOfRange: true, date: nextDate });
  }
  // define day states
  days.forEach(day => {
    day.today = areSameDates(day.date, today);
    day.display = day.date.getDate();
    day.dateKey = formatDate(day.date);
  });
  return chunkArray(days, 7);
}

export function visitInit(visit) {
  console.log(visit);
  return {
    business_id: null,
    client: {
      name: '',
      phone: '',
      service: { name: '', category: '', duration: null }
    },
    ts_begin: null,
    ts_end: null
  };
}

export function dowDisplay(dt, format = 0) {
  const dow = [
    ['воскресенье', 'вс'],
    ['понедельник', 'пн'],
    ['вторник', 'вт'],
    ['среда', 'ср'],
    ['четверг', 'чт'],
    ['пятница', 'пт'],
    ['суббота', 'сб']
  ];
  return dow[dt.getDay()][format];
}

export function monthDisplay(dt) {
  return dt.toLocaleString('ru-RU', { month: 'long' }) + ' ' + dt.getFullYear();
}
