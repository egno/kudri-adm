<template>
  <ServicesLayout>
    <template slot="content">
      <div class="filters">
        <div v-for="group in businessServiceCategories" :key="group" class="filters__item" :class="{ _active: selectedGroups.includes(group) }" @click="toggleFilter(group)">
          {{ group }}
        </div>
        <div class="filters__item" :class="{ _active: selectedGroups && selectedGroups.length === businessServiceCategories.length }" @click="toggleAll">
          Все категории
        </div>
      </div>
      <div class="filter-results">
        <div v-for="(services, group) in groupedBusinessServices" :key="group" class="filter-results__group">
          <template v-if="selectedGroups.includes(group)">
            <div class="filter-results__group-name">
              {{ group }}
            </div>
            <div class="filter-results__cards">
              <ServiceCard v-for="(service, i) in services" :key="i" :service="service" />
            </div>
          </template>
        </div>
      </div>
    </template>
  </ServicesLayout>
</template>

<script>
import ServicesLayout from '@/components/services/ServicesLayout.vue'
import ServiceCard from '@/components/services/ServiceCard.vue'
import { businessMixins } from '@/components/business/mixins'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ServicesLayout,
    ServiceCard
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
      selectedGroups: []
    }
  },
  computed: {
    ...mapState({ businessServices: state => state.business.businessServices }),
    ...mapGetters(['serviceList', 'serviceGroups', 'businessServiceCategories']),
    id () {
      return this.$route.params.id
    },
    groupedBusinessServices () {
      let obj = {}

      this.businessServices.forEach(s => {
        if (!s.j || !s.j.group) {
          return
        }
        const category = s.j.group

        if (!obj[category]) {
          obj[category] = []
        }

        if (!obj[category].includes(s)) {
          obj[category].push(s)
        }
      })

      return obj
    }
  },
  watch: {
    'businessServiceCategories': 'selectAll'
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
      if (!this.businessServiceCategories || !this.businessServiceCategories.length) {
        return
      }
      this.selectedGroups = this.businessServiceCategories.slice()
    },
    toggleAll () {
      if (this.selectedGroups.length === this.businessServiceCategories.length) {
        this.selectedGroups = []
      } else {
        this.selectAll()
      }
    },
    toggleFilter (group) {
      const index = this.selectedGroups.indexOf(group)

      if (index !== -1) {
        this.selectedGroups.splice(index, 1)
      } else {
        this.selectedGroups.push(group)
      }

      if (!this.selectedGroups.length) {
        this.selectAll()
      }
    }
  }
}
</script>

