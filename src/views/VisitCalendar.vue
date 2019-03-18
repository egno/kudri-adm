<template>
  <div>
    <VCalendar
      kind="full"
      period="week"
      :employee="selectedEmployee"
      :show-header="false"
      :business-info="businessInfo"
      :new-visit="newVisit"
      @closeEdit="newVisit=false"
    />
  </div>
</template>

<script>
import VCalendar from '@/components/calendar/VCalendar.vue'
import { mapActions, mapGetters } from 'vuex'
import Api from '@/api/backend'

export default {
  components: { VCalendar },
  data () {
    return {
      businessInfo: {},
      selectedEmployee: [],
      newVisit: false,
      formActions: [
        { label: 'Добавить запись', action: 'newVisit', default: true }
      ]
    }
  },
  computed: {
    ...mapGetters(['businessId']),
    business () {
      return this.$route.params.id
    }
  },
  watch: {
    business: 'fetchData'
  },
  mounted () {
    // TODO проверить, не утекает ли память
    this.$root.$on('onAction', this.onAction)
    this.$root.$on('onSelectEmployee', this.onSelectEmployee)
    this.fetchData()
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
    this.$root.$off('onSelectEmployee', this.onSelectEmployee)
  },
  methods: {
    ...mapActions(['setActions', 'setBusiness']),
    fetchData () {
      if(!this.business) return
      this.setActions(this.formActions)
      this.setBusiness(this.business)
      Api()
        .get(`business?id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.businessInfo = res[0]
        })
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.newVisit = true
      }
    },
    onSelectEmployee (payload) {
      this.selectedEmployee = payload
    }
  }
}
</script>
