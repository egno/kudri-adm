export function hash(s) {
  return s.split('').reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export function hashColor(value, sat = 100, light = 50) {
  let h = hash(value);
  return `hsl(${h}, ${sat}%, ${light}%)`;
}
