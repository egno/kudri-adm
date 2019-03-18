class ApiObject {
  constructor (val) {
    this.object = val
  }

  set object (newVal) {}

  get object () {
    return Object.keys(this)
      .filter(key => key[0] !== '_')
      .reduce((obj, key) => {
        obj[key] = this[key]
        if (obj instanceof ApiObject) {
            return obj.object
        }
        return obj
      }, {})
  }
}

export default ApiObject
