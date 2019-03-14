<template>
  <v-card flat>
    <AppCardTitle @close="$emit('close')">
      <v-layout column>
        <v-flex>
          <span class="title">
            Информация о клиенте
          </span>
        </v-flex>
      </v-layout>
    </AppCardTitle>
    <v-card-text>
      <v-layout column align-space-around justify-start>
        <v-flex>
          <v-text-field
            v-model="client.fullName"
            label="Имя и фамилия клиента"
            :rules="[() => !!client.name.fullName || 'Это поле обязательно для заполнения']"
            required
          />
        </v-flex>
        <v-flex>
          <PhoneEdit :phone="client.phone" @onEdit="client.phone=$event" />
        </v-flex>
        <v-flex>
          <v-select
            v-model="client.filial"
            label="Филиал"
          />
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="client.birth_date"
            label="Дата рождения"
            mask="##.##.####"
            placeholder="ДД.ММ.ГГГГ"
          />
        </v-flex>
        <v-flex>
          <div>
            Пол
          </div>
          <v-btn-toggle v-model="client.sex">
            <v-btn
              v-for="(sex, n) in client.sexList"
              :key="n"
              flat
            >
              {{ sex.display }}
            </v-btn>
          </v-btn-toggle>
        </v-flex>
        <v-flex>
          <v-text-field
            v-model="client.discount"
            label="Персональная скидка"
          />
        </v-flex>
        <v-flex>
          <v-textarea
            v-model="client.notes"
            label="Комментарий"
          />
        </v-flex>
      </v-layout>
    </v-card-text>
    <VCardActions>
      <v-layout column align-center justify-start>
        <v-flex px-5>
          <AppBtn
            primary
            @click="onSave"
          >
            Сохранить
          </AppBtn>
        </v-flex>
        <v-flex pt-3>
          <v-btn
            block
            flat
            round
            ripple
            color="grey"
            @click="onDelete"
          >
            <v-icon>delete</v-icon>
            Удалить
          </v-btn>
        </v-flex>
      </v-layout>
    </VCardActions>
    <v-spacer />
  </v-card>
</template>

<script>
import { newClient } from '@/components/client/utils'
import AppBtn from '@/components/common/AppBtn.vue'
// import AppTabs from '@/components/common/AppTabs.vue'
import AppCardTitle from '@/components/common/AppCardTitle.vue'
import PhoneEdit from '@/components/business/PhoneEdit.vue'

export default {
  components: { AppBtn, AppCardTitle, PhoneEdit },
  props: {
    client: {
      type: Object,
      default () {
        return newClient()
      }
    }
  },
  data () {
    return {
      active: 0
    }
  },
  methods: {
    onDelete () {
      this.$emit('onDelete', this.client)
    },
    onSave () {
      this.$emit('onSave', this.client)
    }
  }
}
</script>

