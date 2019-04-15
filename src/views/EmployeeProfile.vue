<template>
  <PageLayout
    :is-edit-mode="isEditMode"
    :is-edit-visible="!isCreating"
    :template="layoutText"
    @add="
      $router.push({
        name: 'employeeProfile',
        params: { id: id, employee: 'new' }
      })
    "
    @changeMode="isEditMode = $event"
  >
    <template v-if="!isEditMode" slot="content">
      <div class="infocard _view">
        <div v-if="employee && employee.j" class="infocard__content">
          <VLayout align-center justify-center column>
            <div>
              <Avatar
                size="12em"
                :src="employee.j.avatar"
                :is-company-avatar="true"
                :name="employee.j.name"
              />
            </div>
            <VLayout column>
              <div />
              <div v-if="phones && phones.length" class="top-bordered">
                <div
                  v-for="(item, i) in phones"
                  :key="i"
                  class="infocard__field-value"
                >
                  <span class=" infocard__phone">
                    {{ item | phone }}
                  </span>
                </div>
              </div>
              <div v-if="employee.j.schedule">
                <BusinessSchedule
                  :caption-class="captionClass"
                  :week-schedule="employee.j.schedule"
                  :expanded="scheduleExpanded"
                  @toggleSchedule="scheduleExpanded = !scheduleExpanded"
                />
              </div>
              <div v-if="employee.j.notes">
                <div class="infocard__field-title top-bordered">
                  Дополнительные сведения
                </div>
                <div class="infocard__field-value">
                  {{ employee.j.notes }}
                </div>
              </div>
            </VLayout>
          </VLayout>
        </div>
      </div>
    </template>
    <template v-if="isEditMode" slot="content">
      <AppTabs v-model="activeTab">
        <v-flex>
          <v-tab
            key="0"
            ripple
          >
            Профиль
          </v-tab>
        </v-flex>
        <v-flex>
          <v-tab
            key="1"
            ripple
            :disabled="!(employee && employee.id)"
          >
            Услуги
          </v-tab>
        </v-flex>
        <v-flex>
          <v-tab
            key="2"
            ripple
            :disabled="!(employee && employee.id)"
          >
            График работы
          </v-tab>
        </v-flex>
        <v-tab-item key="0">
          <EmployeeEdit
            v-if="employee"
            :employee="employee"
            @onImageUpload="onImageUpload($event)"
          />
        </v-tab-item>
        <v-tab-item key="1">
          <!--<EmployeeServices
            v-if="employee"
            :item="employee"
            @onSave="onServiceSave($event)"
          />-->
        </v-tab-item>
        <v-tab-item key="2">
          <EmployeeSchedule
            v-if="employee"
            :item="employee"
          />
        </v-tab-item>
      </AppTabs>
    </template>
  </PageLayout>
</template>

<script>
import PageLayout from '@/components/common/PageLayout.vue'
import { businessMixins } from '@/components/business/mixins'
import { mapGetters, mapActions } from 'vuex'
import { fullName } from '@/components/business/utils'
import Employee from '@/classes/employee'
/*import AppBtn from '@/components/common/AppBtn.vue'
import AppCardTitle from '@/components/common/AppCardTitle.vue'*/
import AppTabs from '@/components/common/AppTabs.vue'
import EmployeeEdit from '@/components/employee/EmployeeEdit.vue'
// import EmployeeServices from '@/components/employee/EmployeeServices.vue'
import EmployeeSchedule from '@/components/employee/EmployeeSchedule.vue'
import Avatar from '@/components/avatar/Avatar.vue'

export default {
  components: {
    Avatar,
    // AppBtn,
    // AppCardTitle,
    AppTabs,
    EmployeeEdit,
    // EmployeeServices,
    EmployeeSchedule,
    PageLayout
  },
  mixins: [businessMixins],
  data () {
    return {
      activeTab: 0,
      employee: undefined,
      dialog: false,
      isEditMode: false,
      scheduleExpanded: false
    }
  },
  computed: {
    ...mapGetters(['businessId']),
    fullName () {
      return fullName(this.employee)
    },
    isCreating () {
      return (
        this.$route &&
        this.$route.params &&
        this.$route.params.employee &&
        this.$route.params.employee === 'new'
      )
    },
    layoutText () {
      return this.isCreating
        ? { headerText: 'Новый сотрудник', buttonText: '' }
        : { headerText: 'Профиль сотрудника', buttonText: '' }
    },
    phones () {
      return this.employee.j && this.employee.j.phones
    }
  },
  watch: {
    id: 'loadBusiness',
    employee_id: 'loadEmployee'
  },
  mounted () {
    this.load()
  },
  methods: {
    ...mapActions(['alert', 'deleteEmployee', 'setBusiness']),
    deleteItem () {
      if (this.employee_id && this.employee_id !== 'new') {
        this.deleteEmployee(this.employee_id)
        this.exit()
      } else {
        this.exit()
      }
    },
    exit () {
      this.$router.back()
    },
    load () {
      this.loadBusiness()
      this.loadEmployee()
    },
    loadBusiness () {
      if (!this.id) return
      if (this.id !== this.businessId) {
        this.setBusiness(this.id)
      }
    },
    loadEmployee () {
      if (!this.employee_id) return
      this.employee = new Employee(
        this.employee_id === 'new' ? { parent: this.id } : {}
      )
      if (this.employee && this.employee.id === this.employee_id) return
      this.employee.load(this.employee_id)
    },
    onImageUpload (payload) {
      this.employee.image = payload
    },
    onServiceSave (payload) {
      this.employee.services = payload
      this.save()
    },
    save () {
      if (!this.employee_id) return
      this.employee.save().then(id => {
        if (this.employee_id === 'new') {
          this.$router.replace({
            name: 'employeeProfile',
            params: { id: this.id, employee: id }
          })
        }
      })
      return
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/infocard';
</style>
