<template>
  <v-container>
    <v-card>
      <v-layout row>
        <v-flex>
          <v-card flat>
            <AppCardTitle @close="exit">
              <v-layout
                row
                wrap
              >
                <v-flex>
                  <div class="caption grey--text">
                    Сотрудник
                  </div>
                  <div v-if="fullName">
                    {{ fullName }}
                  </div>
                  <div
                    v-else
                    class="grey--text"
                  >
                    [{{ employee_id || 'новый' }}]
                  </div>
                </v-flex>
              </v-layout>
            </AppCardTitle>
            <v-divider />
            <v-card-text>
              <v-layout column>
                <v-flex xs12>
                  <AppTabs v-model="activeTab">
                    <v-tab
                      key="0"
                      ripple
                    >
                      Профиль
                    </v-tab>
                    <v-tab
                      key="1"
                      ripple
                      :disabled="!(data && data.id)"
                    >
                      Услуги
                    </v-tab>
                    <v-tab
                      key="2"
                      ripple
                      :disabled="!(data && data.id)"
                    >
                      График работы
                    </v-tab>
                    <v-tab-item key="0">
                      <EmployeeProfile
                        v-if="data"
                        :item="data"
                        @onImageUpload="onImageUpload($event)"
                      />
                    </v-tab-item>
                    <v-tab-item key="1">
                      <EmployeeServices
                        v-if="data"
                        :item="data"
                        @onSave="onServiceSave($event)"
                      />
                    </v-tab-item>
                    <v-tab-item key="2">
                      <EmployeeSchedule
                        v-if="data"
                        :item="data"
                      />
                    </v-tab-item>
                  </AppTabs>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-dialog
                v-model="dialog"
                width="30em"
              >
                <v-card>
                  <v-card-text>Уверены, что хотите удалить сотрудника?</v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <app-btn
                      primary
                      @click="dialog = false"
                    >
                      Нет
                    </app-btn>
                    <app-btn @click="dialog = false; deleteItem()">
                      Удалить
                    </app-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <app-btn @click="dialog=true">
                Удалить
              </app-btn>
              <app-btn @click="exit">
                Закрыть
              </app-btn>
              <app-btn
                primary
                :disabled="!(data && data.access)"
                @click="save"
              >
                Сохранить
              </app-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { businessMixins } from '@/components/business/mixins';
import { mapGetters, mapActions } from 'vuex';
import { makeAlert } from '@/api/utils';
import { fullName } from '@/components/business/utils';
import { employeeInit } from '@/components/employee/utils';
import { responseGetId } from '@/api/utils';
import Api from '@/api/backend';
import AppBtn from '@/components/common/AppBtn.vue';
import AppCardTitle from '@/components/common/AppCardTitle.vue';
import AppTabs from '@/components/common/AppTabs.vue';
import EmployeeProfile from '@/components/employee/EmployeeProfile.vue';
import EmployeeServices from '@/components/employee/EmployeeServices.vue';
import EmployeeSchedule from '@/components/employee/EmployeeSchedule.vue';

export default {
  components: {
    AppBtn,
    AppCardTitle,
    AppTabs,
    EmployeeProfile,
    EmployeeServices,
    EmployeeSchedule
  },
  mixins: [businessMixins],
  data() {
    return {
      activeTab: 0,
      data: undefined,
      dialog: false
    };
  },
  computed: {
    ...mapGetters(['business']),
    fullName() {
      return fullName(this.data);
    }
  },
  watch: {
    id: 'loadBusiness',
    employee_id: 'loadEmployee'
  },
  mounted() {
    this.load();
  },
  methods: {
    ...mapActions(['alert', 'setBusiness']),
    deleteItem() {
      if (this.employee_id && this.employee_id !== 'new') {
        Api()
          .delete(`employee?id=eq.${this.employee_id}`)
          .then(() => {
            this.exit();
          })
          .catch(err => {
            this.alert(makeAlert(err));
          });
      } else {
        this.exit();
      }
    },
    exit() {
      this.$router.back();
    },
    load() {
      this.loadBusiness();
      this.loadEmployee();
    },
    loadBusiness() {
      if (!this.id) return;
      if (this.id !== this.business) {
        this.setBusiness(this.id);
      }
    },
    loadEmployee() {
      if (!this.employee_id) return;
      if (this.employee_id === 'new') {
        this.data = employeeInit({ parent: this.id });
        return;
      }
      if (this.data && this.data.id === this.employee_id) return;
      Api()
        .get(`employee?id=eq.${this.employee_id}`)
        .then(res => res.data[0])
        .then(res => {
          this.data = this.dataPrefill(res);
        });
    },
    onImageUpload(payload) {
      this.$set(this.data, 'j', { ...this.data.j, ...{ image: payload } });
      this.save();
    },
    onServiceSave(payload) {
      this.$set(this.data, 'j', { ...this.data.j, ...{ services: payload } });
      this.save();
    },
    save() {
      if (!this.employee_id) return;
      if (this.employee_id === 'new') {
        Api()
          .post(`employee?`, this.data)
          .then(res => responseGetId(res))
          .then(id => {
            this.$router.push({
              name: 'employeeFull',
              params: { id: this.id, employee: id }
            });
          })
          .catch(err => {
            this.alert(makeAlert(err));
          });
        return;
      }
      Api()
        .patch(`employee?id=eq.${this.employee_id}`, this.data)
        .then(() => {
          this.alert(makeAlert('Успешно'));
        })
        .catch(err => {
          this.alert(makeAlert(err));
        });
    }
  }
};
</script>
