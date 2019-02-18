export function employeeInit(emp) {
  return {
    ...{
      access: true,
      j: {
        ...{
          services: [],
          schedule: {}
        },
        ...(emp.j || {})
      }
    },
    ...emp
  };
}
