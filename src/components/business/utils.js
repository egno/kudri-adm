export function fullName(obj) {
  return obj && obj.j && [obj.j.name, obj.j.surname].filter(x => !!x).join(' ');
}
