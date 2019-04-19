<template>
  <PageLayout
    :is-button-visible="true"
    :template="{ headerText: 'Сотрудники', buttonText: 'Новый сотрудник' }"
    @add="
      $router.push({
        name: 'employeeProfile',
        params: { id: id, employee: 'new' }
      })
    "
  >
    <template slot="content">
      <div class="employees-list">
        <div class="filters">
          <div
            v-for="category in categories"
            :key="category"
            @click="toggleFilter(category)"
          >
            <div
              v-if="category"
              class="filters__item"
              :class="{ _active: selectedCategories.includes(category) }"
            >
              {{ category }}
            </div>
          </div>
          <div
            class="filters__item"
            :class="{
              _active:
                selectedCategories &&
                selectedCategories.length >= categories.length
            }"
            @click="toggleAll"
          >
            Все мастера
          </div>
        </div>
        <div class="filter-results">
          <div
            v-for="category in selectedCategories"
            :key="category"
            class="filter-results__group"
          >
            <template v-if="businessEmployees.some(e => e.j && e.j.category === category)">
              <div class="filter-results__group-name">
                {{ category ? category : '' }}
              </div>
              <div class="filter-results__cards">
                <div v-for="(employee, i) in businessEmployees" :key="i">
                  <EmployeeCard
                    v-if="employee.j.category === category"
                    :employee="employee"
                    :services-count="empServices(employee.id)"
                    @delete="showDeleteDialog(employee)"
                    @calendarClick="openRegistry"
                    @click="
                      $router.push({
                        name: 'employeeProfile',
                        params: { id: id, employee: employee.id }
                      })
                    "
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <Modal
        :visible="deleteModalVisible"
        :template="deleteTemplate"
        @close="deleteModalVisible = false"
        @leftButtonClick="
          deleteModalVisible = false;
          empToDelete = null;
        "
        @rightButtonClick="deleteEmployee"
      >
        <template slot="text">
          <div
            v-if="empToDelete && empToDelete.j && empToDelete.j.name"
            class="uno-modal__text"
          >
            Вы точно хотите удалить сотрудника <b>{{ empToDelete.j.name }}?</b>
          </div>
          <div v-else class="uno-modal__text">
            Вы точно хотите удалить сотрудника?
          </div>
        </template>
      </Modal>
    </template>
  </PageLayout>
</template>

<script>
import EmployeeCard from '@/components/employee/EmployeeCard.vue'
import Modal from '@/components/common/Modal'
import PageLayout from '@/components/common/PageLayout.vue'
import Api from '@/api/backend'
import { mapState, mapActions } from 'vuex'
import { employeeMixin } from '@/mixins/employee'
import { formatDate } from '@/components/calendar/utils'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { PageLayout, EmployeeCard, Modal },
  mixins: [employeeMixin],
  data () {
    return {
      edit: false,
      empToDelete: undefined,
      deleteModalVisible: false,
      deleteTemplate: {
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      },
      newEmp: undefined,
      selectedCategories: [],
      selectedOnStart: false
    }
  },
  computed: {
    ...mapState({ businessServices: state => state.business.businessServices }),
    ...mapState({ businessEmployees: state => state.business.businessEmployees }),
    id () {
      return this.$route.params.id
    },
    categories () {
      return [
        ...new Set(
          this.businessEmployees &&
            this.businessEmployees.map(x => x.j && x.j.category)
        )
      ].sort((a, b) => (a < b ? -1 : 1))
    },
  },
  watch: {
    categories: {
      handler (newVal) {
        if (this.selectedOnStart) {
          return
        }
        if (newVal && newVal.length) {
          this.selectAll()
          this.selectedOnStart = true
        }
      }
    }
  },
  mounted () {
    this.setActions()
  },
  methods: {
    ...mapActions(['setActions', 'loadBusinessEmployees']),
    deleteEmployee () {
      let empServices = this.businessServices.filter(s =>  s.j.employees && s.j.employees.includes(this.empToDelete.id))

      this.removeEmpServices(empServices, this.empToDelete.id).then(() => {
        Api()
          .delete(`employee?id=eq.${this.empToDelete.id}`)
          .then(() => {
            this.deleteModalVisible = false
            this.loadBusinessEmployees(this.id)
          })
          .catch((e) => {
            console.log('FAILURE!! ', e)
          })
      })
    },
    empServices (empId) {
      if (!this.businessServices || !this.businessServices.length) {
        return 0
      }
      return this.businessServices.filter(s => s.j.employees && s.j.employees.includes(empId)).length
    },
    openRegistry () {
      this.$router.push({
        name: 'businessVisit',
        params: {
          id: this.id,
          date: formatDate(new Date())
        }
      })
    },
    onSave (payload) {
      this.sendData(payload)
    },
    sendData (data) {
      data.j.phones = data.j.phones.filter(x => x > '')
      data.parent = this.id
      data.type = 'E'
      if (!data.id) {
        Api().post(`employee`, data)
      } else {
        Api().patch(`employee?id=eq.${data.id}`, data)
      }
    },
    selectAll () {
      if (!this.categories || !this.categories.length) {
        return
      }
      this.selectedCategories = this.categories.slice()
    },
    showDeleteDialog (emp) {
      this.deleteModalVisible = true
      this.empToDelete = emp
    },
    showEditPanel () {},
    toggleAll () {
      if (this.selectedCategories.length === this.categories.length) {
        this.selectedCategories = []
      } else {
        this.selectAll()
      }
    },
    toggleFilter (category) {
      const index = this.selectedCategories.indexOf(category)

      if (index !== -1) {
        this.selectedCategories.splice(index, 1)
      } else {
        this.selectedCategories.push(category)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';

  .employees-list {
    padding: 28px 28px 0;
    @media only screen and (min-width : $desktop) {
      padding: 38px 40px 0 122px;
    }
  }
</style>
