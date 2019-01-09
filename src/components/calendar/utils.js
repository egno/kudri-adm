export function valueDate(value, format) {
  return value ? this.parseDateString(value, format) : undefined;
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

export function periodDates(year, month) {
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
    day.dateKey = [
      day.date.getFullYear(),
      ('0' + (day.date.getMonth() + 1)).slice(-2),
      ('0' + day.date.getDate()).slice(-2)
    ].join('-');
  });
  return chunkArray(days, 7);
}
