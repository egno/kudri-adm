<template>
  <VDialog
    v-model="active"
    max-width="40em"
    @input="onInput"
  >
    <VCard flat>
      <VCardTitle
        class="headline grey lighten-2"
        primary-title
      >
        У вас проблема?
      </VCardTitle>
      <v-card-text>
        <v-layout column>
          <v-flex>
            <v-textarea
              v-model="message"
              label="Описание проблемы"
            />
          </v-flex>
          <v-flex>
            <PhoneEdit
              :phone="contact"
              label="Телефон для связи"
              @onEdit="contact = $event || contact"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          flat
          :disabled="!message"
          @click="onInput(true)"
        >
          Отправить
        </v-btn>
      </v-card-actions>
    </VCard>
  </VDialog>
</template>

<script>
import PhoneEdit from '@/components/business/PhoneEdit.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    PhoneEdit
  },
  props: {
    edit: { type: Boolean, default: false }
  },
  data () {
    return {
      active: false,
      message: '',
      contact: ''
    }
  },
  computed: {
    ...mapGetters(['userPhone'])
  },
  watch: {
    userPhone: 'loadData',
    edit: 'setActive'
  },
  methods: {
    ...mapActions(['closeMessageWindow']),
    loadData () {
      if (this.userPhone) {
        this.contact = this.userPhone
      }
    },
    onInput (send) {
      let payload
      if (send && this.message) {
        payload = {
          message: this.message,
          contact: this.contact,
          j: { route: this.$route.fullPath }
        }
      }
      this.closeMessageWindow(payload)
      this.message = ''
    },
    setActive (val) {
      this.active = !!val
    }
  },
  mount () {
    this.userLogin()
  }
}
</script>
