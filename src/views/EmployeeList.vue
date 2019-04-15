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
              selectedCategories.length === categories.length
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
          <div class="filter-results__group-name">
            {{ category ? category : '' }}
          </div>
          <div class="filter-results__cards">
            <div v-for="(employee, i) in businessEmployees" :key="i">
              <EmployeeCard
                v-if="employee.j.category === category"
                :employee="employee"
                @click="
                  $router.push({
                    name: 'employeeProfile',
                    params: { id: id, employee: employee.id }
                  })
                "
                @delete="showDeleteDialog(employee)"
              />
            </div>
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
import PageLayout from '@/components/common/PageLayout.vue'
import Api from '@/api/backend'
import EmployeeCard from '@/components/employee/EmployeeCard.vue'
import { mapActions } from 'vuex'
import Modal from '@/components/common/Modal'

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { PageLayout, EmployeeCard, Modal },
  data () {
    return {
      businessEmployees: [],
      edit: false,
      empToDelete: undefined,
      deleteModalVisible: false,
      deleteTemplate: {
        leftButton: 'ОТМЕНА',
        rightButton: 'УДАЛИТЬ'
      },
      newEmp: undefined,
      selectedCategories: []
    }
  },
  computed: {
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
    queryService () {
      return this.$route && this.$route.query && this.$route.query.service
    }
  },
  mounted () {
    this.fetchData()
    this.setActions()
  },
  methods: {
    ...mapActions(['setActions']),
    categoryItems (category) {
      return (
        this.businessEmployees &&
        this.businessEmployees.filter(
          x =>
            x.j &&
            x.j.category === category &&
            (!this.queryService ||
              (x.j.services &&
                x.j.services.length > 0 &&
                x.j.services.some(s => (s.name || s) === this.queryService))) &&
            (!this.searchString ||
              (x.j.category &&
                x.j.category
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              // (x.j.phone &&
              //   x.j.phone
              //     .toUpperCase()
              //     .indexOf(this.searchString.toUpperCase()) > -1) ||
              // (x.j.email &&
              //   x.j.email
              //     .toUpperCase()
              //     .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.surname &&
                x.j.surname
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.name &&
                x.j.name
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.services &&
                x.j.services.length > 0 &&
                x.j.services.some(
                  s =>
                    (s.name || s)
                      .toUpperCase()
                      .indexOf(this.searchString.toUpperCase()) > -1
                )))
        )
      )
    },
    deleteEmployee () {},
    fetchData () {
      Api()
        .get(`employee?parent=eq.${this.id}`)
        .then(res => res.data)
        .then(res => {
          this.businessEmployees = res
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
