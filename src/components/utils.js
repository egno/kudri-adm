export function hash(s) {
  if (!s) {
    return 0;
  }
  return s.split('').reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export function hashColor(value, sat = 100, light = 50) {
  let h = hash(value) % 360;
  return `hsl(${h}, ${sat}%, ${light}%)`;
}
