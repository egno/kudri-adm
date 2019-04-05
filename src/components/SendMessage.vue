<template>
  <VDialog
    v-model="active"
    max-width="440px"
    class="report"
    content-class="report"
    @input="onInput"
  >
    <VCard flat>
      <VCardTitle
        class="report__title"
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
              class="report__description"
              rows="2"
            />
          </v-flex>
          <v-flex>
            <PhoneEdit
              :phone="contact"
              :removable="false"
              label="Телефон для связи"
              class="report__phone"
              @onEdit="contact = $event || contact"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="report__bottom">
        <v-btn
          color="primary"
          flat
          :disabled="!message"
          class="report__button"
          @click="onInput(true)"
        >
          Отправить
        </v-btn>
      </v-card-actions>
    </VCard>
  </VDialog>
</template>

<script>
import PhoneEdit from '@/components/common/PhoneEdit.vue'
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

<style lang="scss">
  @import "../assets/styles/common";

  .report {
    border-radius: 0;
    * {
      text-align: center;
    }
    .v-card {
      padding: 56px 80px;
    }
    .v-sheet {
      border-radius: 0;
    }
    &__title {
      justify-content: center;
    }
    &__bottom {
      justify-content: center;
    }
    &__button {
      @extend %button;
      @extend %gold-gradient;
      .v-btn__content {
        color: #fff;
      }
      &.v-btn--disabled {
        @extend %button-disabled;
      }
    }
  }
</style>
