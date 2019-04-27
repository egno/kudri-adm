<template>
  <v-dialog :value="visible" content-class="right-attached-panel businesscard-form _clients" transition="slide" @input="$emit('close')">
    <v-layout
      v-if="client"
      column
      align-space-around
      justify-start
      class="right-attached-panel__container"
    >
      <button type="button" class="right-attached-panel__close" @click="$emit('close')" />
      <div class="right-attached-panel__header">
        {{ create? 'Добавить клиента' : 'Информация о клиенте' }}
      </div>
      <div class="businesscard-form__field _select dropdown-select">
        <v-combobox
          :value="client.fullName"
          :items="suggestedClients"
          :item-text="clientDisplay"
          label="ИМЯ И ФАМИЛИЯ КЛИЕНТА"
          maxlength="50"
          return-object
          required
          attach=".businesscard-form__field._select"
          @update:searchInput="onInputName"
          @change="selectClient"
        >
          <template v-slot:selection="{ item, parent, selected }">
            {{ item.j? item.j.name.fullname: item }}
          </template>
          <template v-slot:item="{ index, item }">
            <div>
              {{ item.j.name.fullname }}
            </div>
            <div>
              {{ item.j.phone? item.j.phone : item.j.phones[0] }}
            </div>
          </template>
        </v-combobox>
      </div>
      <div class="businesscard-form__field">
        <div
          v-for="(phone, i) in client.phones"
          :key="i"
          class="phone-input"
        >
          <PhoneEdit
            :phone="phone"
            :removable="i !== 0"
            :label="i === 0? 'Телефон*' : 'Телефон'"
            placeholder=""
            @onEdit="client.phones[i] = $event; checkPhones($event)"
          />
        </div>
        <div v-if="clientWithSamePhone" class="error--text">
          Найден 1 клиент с данным номером телефона
        </div>
        <button
          v-show="!clientWithSamePhone"
          type="button"
          class="businesscard-form__add-field"
          :disabled="!hasPhone || hasEmptyPhone || client.phones.length >= 4"
          @click="client.phones.push(''); hasEmptyPhone = true"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0H7V7H0V9H7V16H9V9H16V7H9V0Z" fill="#8995AF" fill-opacity="1" />
          </svg>
          <span>Добавить телефон</span>
        </button>
        <Accordion v-if="clientWithSamePhone">
          <template slot="heading">
            <div>{{ clientWithSamePhone.fullName }}</div>
          </template>
          <template slot="content">
            <div>
              <div
                v-for="(phone, i) in clientWithSamePhone.phones"
                :key="i"
                class="phone-input"
              >
                <PhoneEdit
                  :class="{'error-color': phone === samePhone}"
                  :disabled="true"
                  :phone="phone"
                  :removable="phone === samePhone"
                  label=""
                  placeholder=""
                />
              </div>
              <div>
                <v-layout v-if="clientWithSamePhone.lastVisit" column>
                  <v-flex>
                    <span>{{ clientWithSamePhone.lastVisit.date }}</span>
                    <span> — </span>
                    <span>{{ clientWithSamePhone.lastVisit.displayStatus }}</span>
                  </v-flex>
                  <v-flex>
                    <span class="second-row">{{ clientWithSamePhone.lastVisit.timeInterval }}</span>
                  </v-flex>
                </v-layout>
              </div>
            </div>
          </template>
        </Accordion>
      </div>
      <div class="businesscard-form__field">
        <v-text-field
          v-model="client.birth_date"
          label="Дата рождения"
          mask="##.##.####"
          placeholder="ДД.ММ.ГГГГ"
          :rules="[onInputDate]"
        />
      </div>
      <div class="businesscard-form__field">
        <div class="right-attached-panel__field-name">
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
          maxlength="100"
          :rules="[rules.maxLength(100)]"
        />
      </div>
      <div class="businesscard-form__field">
        <v-textarea
          v-model="client.notes"
          label="Комментарий"
          maxlength="500"
          :rules="[rules.maxLength(500)]"
          counter="500"
          auto-grow
          rows="1"
        />
      </div>
      <div>
        <MainButton
          class="button save-info"
          :class="{ button_disabled: !hasPhone || clientWithSamePhone }"
          @click="onSave"
        >
          Сохранить
        </MainButton>
      </div>
    </v-layout>
  </v-dialog>
</template>

<script>
import Accordion from '@/components/common/Accordion.vue'
import { newClient } from '@/components/client/utils'
import MainButton from '@/components/common/MainButton.vue'
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import Api from '@/api/backend'
import Client from '@/classes/client'
import { debounce } from 'lodash'

export default {
  components: { Accordion, MainButton, PhoneEdit },
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
    filial: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      active: 0,
      clientWithSamePhone: undefined,
      clientDisplay (c) {
        return `${ c.j.name.fullname }${ c.j.phone? c.j.phone : c.j.phones[0] }`
      },
      hasPhone: undefined,
      hasEmptyPhone: undefined,
      suggestedClients: [],
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => (value) => value && (value.length <= length || 'Слишком длинный текст') || true
      },
      samePhone: ''
    }
  },
  beforeMount () {
    this.checkPhones()
  },
  created () {
    this.debouncedGetClients = debounce(this.getClientsByName, 350)
  },
  methods: {
    checkPhones (newPhone) {
      if (!this.client.phones || !this.client.phones.length) {
        this.hasPhone = false
        this.hasEmptyPhone = true
        return
      }
      this.hasPhone = this.client.phones.some(phone => phone.length >= 10)
      this.hasEmptyPhone = this.client.phones.some(x => (!x || x.length < 10))

      this.samePhone = ''
      this.clientWithSamePhone = null
      if (!newPhone) {
        return
      }
      this.getClientsByPhone(newPhone)
    },
    getClientsByName (val) {
      Api()
        .get(`client?j->name->>fullname=ilike.*${val}*`)
        .then(({ data }) => {
          this.suggestedClients = data.filter(c => c.business_id !== this.filial)
        })
    },
    getClientsByPhone (newPhone) {
      if (newPhone && newPhone.length >= 10) {
        Api()
          .get(`/client_phone?and=(company_id.eq.${this.companyId},phone.eq.7${newPhone})`)
          .then(({ data }) => {
            console.log(data)
            let companyClients = data.filter(c => (c.company_id === this.companyId) && (c.id !== this.client.id))

            if (companyClients.length) {
              this.clientWithSamePhone = new Client(companyClients[0])
              this.samePhone = '7' + newPhone
            }

          })
          .catch(e => console.log(e))
      }
    },
    onDelete () {
      this.$emit('onDelete', this.client)
    },
    onInputDate (value) {
      const birthDateFormat = /^(0?[1-9]|[12][0-9]|3[01])(0?[1-9]|1[012])(19\d{2}|20\d{2})$/
      const currentYear = (new Date()).getFullYear()
      let match

      if (!value || value.length < 8) {
        return true
      }

      match = value.match(birthDateFormat)

      if (!match) {
        return 'Неправильная дата рождения'
      }
      const age = currentYear - match[3]
      if ((age >= 0) && (age < 121)) {
        return true
      } else {
        return 'Неправильная дата рождения'
      }
    },
    onInputName (val) {
      if (val < 2) {
        return
      }

      this.debouncedGetClients(val)
    },
    onSave () {
      this.client.filial = this.filial
      this.$emit('onSave', this.client)
    },
    selectClient (client) {
      if (client && (typeof client === 'object')) {
        const {
          id,
          business_id,
          visit,
          j
        } = client
        this.client.id = id
        this.client.business_id = business_id
        this.client.visit = visit
        this.client.fullName = j.name.fullname
        this.client.phone = j.phone
        this.client.phones = j.phones
        this.client.birth_date = j.birth_date
        this.client.discount = j.discount
        this.client.sex = j.sex
        this.client.notes = j.notes

        this.checkPhones()
      } else {
        this.client.fullName = client
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/businesscard-form';
  @import '../../assets/styles/phone-input';
  @import "../../assets/styles/right-attached-panel";

  .right-attached-panel._clients {

    .businesscard-form__field {
      margin-top: 28px;
      padding-top: 20px;
    }
    .v-btn-toggle {
      button {
        @extend %filter;
        padding: 0 12px;
        margin: 0 12px 15px;
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

    .error--text {
      font-size: 12px;
    }
    .phone-input .v-input--is-disabled .v-input__slot:before {
      display: none;
    }
    .accordion {
      text-align: left;
      .v-text-field__prefix {
        padding-left: 0;
      }
      ._phone.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
        padding-left: 0;
      }
      /*.error-color {
        .v-text-field__prefix, input {
          color: #EF4D37;
        }
      }*/
    }
    .dropdown-select .v-menu__content {
      top: 100% !important;
    }
  }
</style>

