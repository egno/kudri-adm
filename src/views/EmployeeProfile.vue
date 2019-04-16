<template>
  <PageLayout
    :is-edit-mode="isEditMode || isCreating"
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
    <template v-if="!isEditMode && !isCreating" slot="content">
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
              <div v-if="phone" class="top-bordered">
                <div class="infocard__field-value">
                  <span class=" infocard__phone">
                    {{ phone | phone }}
                  </span><!--todo -->
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
    <template v-else slot="content">
      <AppTabs v-model="activeTab">
        <v-tab
          :key="0"
          ripple
        >
          Профиль
        </v-tab>
        <v-tab
          :key="1"
          ripple
        >
          Услуги
        </v-tab>
        <v-tab
          :key="2"
          ripple
        >
          График работы
        </v-tab>
      </AppTabs>
      <div class="tab-content">
        <v-form
          ref="form"
          v-model="valid"
        >
          <div v-show="activeTab === 0" class="infocard _edit">
            <div class="infocard__content">
              <EmployeeEdit
                v-if="employee"
                :employee="employee"
                @onImageUpload="onImageUpload($event)"
              />
              <MainButton
                color="success"
                class="businesscard-form__next"
                :class="{ button_disabled: hasErrors }"
                @click.native.prevent="activeTab = 1"
              >
                Далее
              </MainButton>
            </div>
          </div>
          <div v-show="activeTab === 1" class="infocard _edit">
            <div class="infocard__content">
              <!--<EmployeeServices
              v-if="employee"
              :item="employee"
              @onSave="onServiceSave($event)"
            />-->
            </div>
          </div>
          <div v-show="activeTab === 2" class="infocard _edit">
            <div class="infocard__content">
              <EmployeeSchedule
                v-if="employee"
                :item="employee"
              />
            </div>
          </div>
        </v-form>
      </div>
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
import MainButton from '@/components/common/MainButton.vue'

export default {
  components: {
    Avatar,
    // AppBtn,
    // AppCardTitle,
    AppTabs,
    EmployeeEdit,
    // EmployeeServices,
    EmployeeSchedule,
    MainButton,
    PageLayout
  },
  mixins: [businessMixins],
  data () {
    return {
      activeTab: 0,
      employee: undefined,
      dialog: false,
      isEditMode: false,
      scheduleExpanded: false,
      valid: false
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
    hasCategory () {
      return !!(this.employee && this.employee.j && this.employee.j.category)
    },
    hasErrors () {
      return !(this.hasName && this.hasCategory)
    },
    hasName () {
      return !!(this.employee && this.employee.j && this.employee.j.name)
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
    employee_id: 'loadEmployee'
  },
  mounted () {
    this.loadEmployee()
  },
  methods: {
    ...mapActions(['alert', 'deleteEmployee']),
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

.tab-content {
  @media only screen and (min-width : $desktop) {
    padding-left: 122px;
  }
}
</style>
