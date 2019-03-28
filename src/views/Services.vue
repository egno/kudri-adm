<template>
  <ServicesLayout>
    <template slot="content">
      <VLayout wrap class="filters">
        <div v-for="group in serviceGroups" :key="group" class="filters__item" :class="{ _active: selectedGroups[group] }" @click="toggleFilter(group)">
          {{ group }}
        </div>
        <div class="filters__item" :class="{ _active: selectedGroups && selectedGroups.length === serviceGroups.length }" @click="toggleAll">
          Все категории
        </div>
      </VLayout>
      <div class="filter-results">
        <!--<div v-for="group in selectedGroups" class="filter-results__group">-->
        <!--<template v-for="(services, group) in selectedGroups">
          <div class="filter-results__group-name">
            {{ group }}
          </div>

          <template v-for="service in services ">
            <ServiceCard :service="service" />
          </template>
        </template>-->
        <!--</div>-->
      </div>
    </template>
  </ServicesLayout>
</template>

<script>
import ServicesLayout from '@/components/services/ServicesLayout.vue'
import { businessMixins } from '@/components/business/mixins'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ServicesLayout,
  },
  mixins: [businessMixins],
  data () {
    return {
      searchString: '',
      formActions: [
        { label: 'Добавить услугу', action: 'newService', default: false }
      ],
      data: { j: {} },
      edit: false,
      newService: {},
      selectedGroups: {}
    }
  },
  computed: {
    ...mapState({ businessServices: state => state.business.businessServices }),
    ...mapGetters(['serviceList', 'serviceGroups', 'businessServiceCategories']),
    id () {
      return this.$route.params.id
    },
  },
  watch: {
    'serviceGroups': 'selectAll'
  },
  mounted () {
    this.setActions(this.formActions)
    this.$root.$on('onAction', this.onAction)
    this.selectAll()
  },
  beforeDestroy () {
    this.$root.$off('onAction', this.onAction)
  },
  methods: {
    ...mapActions(['setActions']),
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true
      }
    },
    servicesInGroup (grp) {
      return this.services && this.services.filter(x => x.group === grp)
    },
    selectAll () {
      if (!this.businessServices || !this.businessServices.length) {
        return
      }
      this.selectedGroups = this.businessServices.map(service => service.j && service.j.group)
    },
    toggleAll () {
      if (this.selectedGroups.length === this.serviceGroups.length) {
        this.selectedGroups = []
      } else {
        this.selectAll()
      }
    },
    toggleFilter (group) {
      if (this.selectedGroups[group]) {
        delete this.selectedGroups[group]
      } else {
        this.selectedGroups[group] = this.businessServices.filter(serv => serv.j.group === group)
      }

      if (!Object.keys(this.selectedGroups).length) {
        this.selectAll()
      }
    }
  }
}
</script>

