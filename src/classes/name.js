class Name {
  constructor (val) {
    this.fullName = val
  }

  get object () {
    return this
  }

  set fullName (val) {
    if (typeof val === 'object') {
      this.forename = val.forename
      this.surname = val.surname
      this.fullname = val.fullname
      return
    }
    if (typeof val === 'string') {
      [this.forename, this.surname] = val.split(' ')
      this.fullname = val
      return
    }
  }

  get fullName () {
    return (
      [this.forename, this.surname].filter(x => !!x).join(' ') || this.fullname
    )
  }
}

export default Name
