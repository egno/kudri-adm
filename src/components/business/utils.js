export function fullName(obj) {
  return obj && obj.j && [obj.j.name, obj.j.surname].filter(x => !!x).join(' ');
}

export function serviceInit(service) {
  return {
    ...(typeof service !== 'object' ? { name: service } : service),
    ...{ category: undefined, price: 0, duration: 60, notes: undefined }
  };
}
