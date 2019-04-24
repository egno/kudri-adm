import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['userRole']),
    isEditorUser () {
      return this.userRole !== 'anon' && this.userRole !== 'client'
    }
  }
}
