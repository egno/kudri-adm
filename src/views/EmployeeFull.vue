<template>
  <v-container>
    <v-card>
      <v-layout row>
        <v-flex>
          <v-card flat>
            <v-card-title>
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
              <v-btn
                icon
                @click="exit"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-layout column>
                <v-flex xs12>
                  <v-tabs
                    v-model="activeTab"
                    color="grey lighten-4"
                  >
                    <v-tab
                      key="0"
                      ripple
                    >
                      Профиль
                    </v-tab>
                    <v-tab
                      key="1"
                      ripple
                    >
                      Услуги
                    </v-tab>
                    <v-tab
                      key="2"
                      ripple
                    >
                      График работы
                    </v-tab>
                    <v-tab-item key="0">
                      <EmployeeProfile
                        v-if="data && data.id"
                        :item="data"
                      />
                    </v-tab-item>
                    <v-tab-item key="1">
                      <EmployeeServices
                        v-if="data && data.id"
                        :item="data"
                        @onSave="onServiceSave($event)"
                      />
                    </v-tab-item>
                    <v-tab-item key="2">
                      <div>tab2</div>
                    </v-tab-item>
                  </v-tabs>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                depressed
                @click="exit"
              >
                Закрыть
              </v-btn>
              <v-btn
                depressed
                color="primary"
                :disabled="!(data && data.access)"
                @click="save"
              >
                Сохранить
              </v-btn>
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
import Api from '@/api/backend';
import { fullName } from '@/components/business/utils';
import EmployeeProfile from '@/components/business/EmployeeProfile.vue';
import EmployeeServices from '@/components/business/EmployeeServices.vue';
import { makeAlert } from '@/api/utils';

export default {
  components: { EmployeeProfile, EmployeeServices },
  mixins: [businessMixins],
  data() {
    return {
      activeTab: 0,
      data: {}
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
      if (this.data && this.data.id === this.employee_id) return;
      Api()
        .get(`employee?id=eq.${this.employee_id}`)
        .then(res => res.data[0])
        .then(res => {
          this.data = this.dataPrefill(res);
        });
    },
    onServiceSave(payload) {
      this.$set(this.data, 'j', { ...this.data.j, ...{ services: payload } });
      this.save();
    },
    save() {
      if (!this.employee_id) return;
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
