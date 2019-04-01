<template>
  <ServicesLayout @add="showCreate = true">
    <template slot="content">
      <template v-if="!businessServices.length">
        <div class="services__empty-notification">
          Cоздайте свою первую услугу
        </div>
      </template>
      <template v-else>
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
                <ServiceCard
                  v-for="(service, i) in services"
                  :key="i" :service="service"
                  @click="onEdit(service)"
                  @delete="deleteService(service)"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
      <EditService
        :visible="showCreate"
        :create="true"
        @close="showCreate = false"
        @save="createService"
      />
      <EditService
        :visible="showEdit"
        :create="false"
        :service="editingService"
        @close="showEdit = false; editingService = null"
        @save="editService"
      />
    </template>
  </ServicesLayout>
</template>

<script>
import ServicesLayout from '@/components/services/ServicesLayout.vue'
import EditService from '@/components/services/EditService.vue'
import ServiceCard from '@/components/services/ServiceCard.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import Api from '@/api/backend'

export default {
  components: {
    ServicesLayout,
    ServiceCard,
    EditService
  },
  data () {
    return {
      searchString: '',
      formActions: [
        { label: 'Добавить услугу', action: 'newService', default: false }
      ],
      branchInfo: { j: {} },
      edit: false,
      newService: {},
      selectedGroups: [],
      showCreate: false,
      showEdit: false,
      editingService: undefined
    }
  },
  computed: {
    ...mapState({ businessServices: state => state.business.businessServices }),
    ...mapGetters(['serviceList', 'serviceGroups', 'businessServiceCategories', 'businessInfo']),
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
    'businessServiceCategories': 'selectAll',
    'businessInfo' () {
      this.businessInfo && this.businessInfo.j && this.businessInfo.j.inn && this.loadBusinessServices(this.businessInfo.j.inn)
    }
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
    ...mapActions(['setActions', 'loadBusinessServices']),
    createService (newService) {
      Api().post(`business_service`, {
        business_id: this.id,
        name: newService.name,
        inn: this.businessInfo.j.inn,
        j: {
          ...newService
        }
      })
        .then(() => {
          this.showCreate = false
          this.loadBusinessServices(this.businessInfo.j.inn)
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
        })
    },
    deleteService (service) {
      Api().delete(`business_service?id=eq.${service.id}`)
        .then(() => {
          this.showEdit = false
          this.loadBusinessServices(this.businessInfo.j.inn)
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
        })
    },
    editService (service) {
      Api().patch(`business_service`, {
        id: service.id,
        business_id: this.id,
        name: service.name,
        access: true,
        inn: this.businessInfo.j.inn,
        j: {
          ...service
        }
      })
        .then(() => {
          this.showEdit = false
          this.loadBusinessServices(this.businessInfo.j.inn)
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
        })

    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true
      }
    },
    onEdit (service) {
      if (this.showEdit) {
        return
      }
      this.showEdit = true
      this.editingService = service
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
    }
  }
}
</script>

