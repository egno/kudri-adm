export default {
  computed: {
    isEditorUser () {
      return this.userRole !== 'anon' && this.userRole !== 'client'
    }
  }
}
