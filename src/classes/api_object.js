class ApiObject {
  constructor (val) {
    this.jsonObject = val
  }

  set jsonObject (newVal) {}

  get jsonObject () {
    return Object.keys(this)
      .filter(key => key[0] !== '_')
      .reduce((obj, key) => {
        obj[key] =
          this[key] instanceof ApiObject ? this[key].jsonObject : this[key]
        return obj
      }, {})
  }
}

export default ApiObject
