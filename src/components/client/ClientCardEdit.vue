<template>
  <v-card flat>
    <AppTabs
      v-model="active"
      fixed-tabs
    >
      <v-tab
        key="t-0"
        ripple
      >
        <v-layout column>
          <v-flex>Профиль клиента</v-flex>
          <v-flex class="caption text-none grey--text">
            {{ client.name.forename }}
            {{ client.name.surname }}
          </v-flex>
        </v-layout>
      </v-tab>
      <v-tab
        key="t-1"
        ripple
      >
        <v-layout column>
          <v-flex>История записей</v-flex>
          <v-flex class="caption text-none grey--text" />
        </v-layout>
      </v-tab>
      <v-tab-item key="ti-0">
        <v-card flat>
          <VCardText>
            <v-layout column>
              <v-flex>
                <v-layout row>
                  <VTextField
                    v-model="client.name.forename"
                    label="Имя"
                    :rules="[() => !!client.name.forename || 'Это поле обязательно для заполнения']"
                    required
                  />
                  <VTextField
                    v-model="client.name.surname"
                    label="Фамилия"
                  />
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout row>
                  <VTextField
                    v-model="client.phone"
                    label="Телефон"
                    required
                  />
                  <VTextField
                    v-model="client.email"
                    label="E-mail"
                    name="email"
                  />
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout row>
                  <VTextField
                    v-model="client.birthdate"
                    label="Дата рождения"
                    required
                  />
                  <VTextField
                    v-model="client.discount"
                    label="Скидка, %"
                  />
                </v-layout>
              </v-flex>
              <v-flex>
                <VTextField
                  v-model="client.sex"
                  label="Пол"
                />
              </v-flex>
              <v-flex>
                <VTextField
                  v-model="client.notes"
                  label="Комментарий"
                />
              </v-flex>
            </v-layout>
          </VCardText>
        </v-card>
      </v-tab-item>
      <v-tab-item key="ti-1">
        <v-card flat>
          <VCardText />
        </v-card>
      </v-tab-item>
    </AppTabs>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="onSave"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </v-card>
</template>

<script>
import { newClient } from '@/components/client/utils';
import AppTabs from '@/components/common/AppTabs.vue';

export default {
  components: { AppTabs },
  props: {
    client: {
      type: Object,
      default() {
        return newClient();
      }
    }
  },
  data() {
    return {
      active: 0
    };
  },
  methods: {
    onSave() {
      this.$emit('onSave', this.client);
    }
  }
};
</script>

