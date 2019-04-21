import Api from '@/api/backend'

export const employeeMixin = {
  methods: {
    removeEmpServices (empServices, empId) {
      let p = []

      if (empId === 'new' || !empServices.length) {
        return Promise.resolve()
      }

      empServices.forEach(service => {
        let employees = service.j && service.j.employees

        employees.splice(employees.indexOf(empId), 1)
        p.push(Api()
          .patch(`business_service?id=eq.${service.id}`, {
            id: service.id,
            business_id: this.id,
            name: service.name,
            access: true,
            j: {
              ...service.j
            }
          })
          .catch(err => {
            console.error(err)
          })
        )
      })

      return Promise.all(p)
    }
  }
}
