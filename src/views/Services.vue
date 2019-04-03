<template>
  <ServicesLayout @add="showCreate = true">
    <template slot="content">
      <template v-if="!branchServices.length">
        <div class="services__empty-notification">
          Cоздайте свою первую услугу
        </div>
      </template>
      <template v-else>
        <div class="filters">
          <div v-for="group in branchServiceCategories" :key="group" class="filters__item" :class="{ _active: selectedGroups.includes(group) }" @click="toggleFilter(group)">
            {{ group }}
          </div>
          <div class="filters__item" :class="{ _active: selectedGroups && selectedGroups.length === branchServiceCategories.length }" @click="toggleAll">
            Все категории
          </div>
        </div>
        <div class="filter-results">
          <div v-for="(services, group) in groupedBranchServices" :key="group" class="filter-results__group">
            <template v-if="selectedGroups.includes(group)">
              <div class="filter-results__group-name">
                {{ group }}
              </div>
              <div class="filter-results__cards">
                <ServiceCard
                  v-for="(service, i) in services"
                  :key="i" :service="service"
                  @click="showEditPanel(service)"
                  @delete="showDeleteModal(service)"
                />
              </div>
            </template>
          </div>
        </div>
      </template>
      <EditService
        :visible="showCreate"
        :branch-id="id"
        :create="true"
        :error-message="errorMessage"
        @close="showCreate = false"
        @save="createService"
      />
      <EditService
        :visible="showEdit"
        :branch-id="id"
        :create="false"
        :service="editingService"
        :error-message="errorMessage"
        @close="showEdit = false; editingService = null"
        @save="editService"
      />
      <Modal
        :visible="showDelete"
        :template="deleteModalTemplate"
        @rightButtonClick="deleteService(deletingService)"
        @leftButtonClick="showDelete = false; deletingService = null"
        @close="showDelete = false; deletingService = null"
      >
        <template slot="text">
          <div
            v-if="deletingService && deletingService.name && deletingService.j && deletingService.j.employees && deletingService.j.employees.length"
            class="uno-modal__text"
          >
            Это приведет к удалению услуги <b>{{ deletingService.name }}</b>. <b>{{ deletingService.j.employees.length }} мастеров</b> больше не будут оказывать данную услугу.
          </div>
          <div v-else class="uno-modal__text">
            Это приведет к удалению услуги.
          </div>
        </template>
      </Modal>
    </template>
  </ServicesLayout>
</template>

<script>
import ServicesLayout from '@/components/services/ServicesLayout.vue'
import EditService from '@/components/services/EditService.vue'
import ServiceCard from '@/components/services/ServiceCard.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import Api from '@/api/backend'
import Modal from '@/components/common/Modal'

export default {
  components: {
    ServicesLayout,
    ServiceCard,
    EditService,
    Modal
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
      showDelete: false,
      editingService: undefined,
      deletingService: undefined,
      errorMessage: ''
    }
  },
  computed: {
    ...mapState({ businessServices: state => state.business.businessServices }),
    ...mapGetters(['serviceGroups', 'businessServiceCategories', 'businessInfo']),
    id () {
      return this.$route.params.id
    },
    branchServices () {
      return this.businessServices.filter(s => s.business_id === this.id)
    },
    groupedBranchServices () {
      let obj = {}

      this.branchServices.forEach(s => {
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
    },
    branchServiceCategories () {
      let res = []

      for (let key in this.groupedBranchServices) {
        res.push(key)
      }

      return res      
    },
    deleteModalTemplate () {
      if (!this.deletingService || !this.deletingService.j || !this.deletingService.j.employees) {
        return {
          header: 'Удалить услугу?',
          text: `Это приведет к удалению услуги. Мастера больше не будут оказывать данную услугу.`,
          leftButton: 'ОТМЕНА',
          rightButton: 'УДАЛИТЬ'
        }
      }
      return {
        header: 'Удалить услугу?',
        text: `Это приведет к удалению услуги <b>${this.deletingService.name}</b>. <b>${ this.deletingService.j.employees.length }</b> мастеров больше не будут оказывать данную услугу.`,
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      }
    }
  },
  watch: {
    'businessServiceCategories': 'selectAll',
    'businessInfo': 'loadCompanyServices'
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
      this.errorMessage = ''
      const group = this.serviceGroups.find(gr => gr.name === newService.group)
      let groupImg

      group && group.j && (groupImg = group.j.image)

      Api().post(`business_service`, {
        business_id: this.id,
        name: newService.name,
        j: {
          ...newService,
          groupImg
        }
      })
        .then(() => {
          this.showCreate = false
          this.loadCompanyServices()
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
          if (e.response && e.response.data &&
            (e.response.data.message === 'duplicate key value violates unique constraint "business_service_un"')) {
            this.errorMessage = 'Услуга с таким названием уже существует. Пожалуйста, выберите другое название'
          }
        })
    },
    deleteService (service) {
      Api().delete(`business_service?id=eq.${service.id}`)
        .then(() => {
          this.showEdit = false
          this.loadCompanyServices()
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
        })
    },
    editService (service) {
      const serviceId = this.editingService.id

      Api().patch(`business_service?id=eq.${serviceId}`, {
        id: serviceId,
        business_id: this.id,
        name: service.name,
        access: true,
        j: {
          ...service
        }
      })
        .then(() => {
          this.showEdit = false
          this.loadCompanyServices()
        })
        .catch((e) => {
          console.log('FAILURE!! ', e)
          if (e.response && e.response.data &&
            (e.response.data.message === 'duplicate key value violates unique constraint "business_service_un"')) {
            this.errorMessage = 'Услуга с таким названием уже существует. Пожалуйста, выберите другое название'
          }
        })
    },
    loadCompanyServices () {
      if (this.businessInfo && this.businessInfo.parent) {
        this.loadBusinessServices(this.businessInfo.parent)
      }
    },
    onAction (payload) {
      if (payload === this.formActions[0].action) {
        this.showCreate = true
      }
    },
    showEditPanel (service) {
      if (this.showEdit) {
        return
      }
      this.showEdit = true
      this.editingService = service
    },
    selectAll () {
      if (!this.branchServiceCategories || !this.branchServiceCategories.length) {
        return
      }
      this.selectedGroups = this.branchServiceCategories.slice()
    },
    showDeleteModal (service) {
      if (this.showDelete) {
        return
      }
      this.showDelete = true
      this.deletingService = service
    },
    toggleAll () {
      if (this.selectedGroups.length === this.branchServiceCategories.length) {
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

