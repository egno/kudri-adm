<template>
  <v-dialog :value="visible" content-class="right-attached-panel" transition="slide" @input="$emit('close')">
    <v-layout
      v-if="client"
      column
      align-space-around
      justify-start
      class="right-attached-panel__container"
    >
      <div class="right-attached-panel__header">
        {{ create? 'Добавить клиента' : 'Информация о клиенте' }}
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          v-model="client.fullName"
          label="ИМЯ И ФАМИЛИЯ КЛИЕНТА"
          :rules="[() => !!client.fullName || 'Это поле обязательно для заполнения']"
          required
        />
      </div>
      <div class="">
        <div
          v-for="(phone, i) in client.phones"
          :key="i"
          class="businesscard-form__field phone-input"
        >
          <PhoneEdit
            :phone="phone"
            :removable="i !== 0"
            :required="i === 0"
            :label="i === 0? 'Телефон*' : 'Телефон'"
            placeholder=""
            @onEdit="client.phones[i] = $event"
          />
        </div>
        <button
          type="button"
          class="businesscard-form__add-field"
          :disabled="!client.phones || !client.phones.length || client.phones.length >= 4"
          @click="client.phones.push('')"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0H7V7H0V9H7V16H9V9H16V7H9V0Z" fill="#8995AF" fill-opacity="1" />
          </svg>
          <span>Добавить телефон</span>
        </button>
      </div>
      <div class="businesscard-form__field">
        <v-select
          v-model="client.filial"
          :items="filials"
          item-text="j.name"
          label="Филиал"
          return-object
        />
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          v-model="client.birth_date"
          label="Дата рождения"
          mask="##.##.####"
          placeholder="ДД.ММ.ГГГГ"
        />
      </div>
      <div class="businesscard-form__field">
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
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          v-model="client.discount"
          label="Персональная скидка"
        />
      </div>
      <div class="businesscard-form__field">
        <v-textarea
          v-model="client.notes"
          label="Комментарий"
        />
      </div>
      <div>
        <MainButton
          class="button save-info"
          :class="{ button_disabled: false }"
          @click="onSave"
        >
          Сохранить
        </MainButton>
      </div>
      <div>
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
      </div>
    </v-layout>
  </v-dialog>
</template>

<script>
import { newClient } from '@/components/client/utils'
import MainButton from '@/components/common/MainButton.vue'
import PhoneEdit from '@/components/common/PhoneEdit.vue'

export default {
  components: { MainButton, PhoneEdit },
  model: {
    prop: 'visible',
    event: 'close'
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    client: {
      type: Object,
      default () {
        return newClient()
      }
    },
    create: {
      type: Boolean,
      default: false,
      required: true
    },
    filials: {
      type: Array,
      default () {
        return []
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

<style lang="scss">
  @import '../../assets/styles/businesscard-form';
  @import '../../assets/styles/phone-input';
  @import "../../assets/styles/right-attached-panel";

  .right-attached-panel {

    .businesscard-form__field {
      margin-top: 28px;
      padding-top: 20px;
    }
    .v-btn-toggle {
      button {
        @extend %filter;
        border-radius: 14px !important;
        text-transform: capitalize;
        &:hover {
          @extend %filter-active
        }
      }
    }
    .v-btn-toggle--selected {
      box-shadow: none;
    }
  }
</style>

