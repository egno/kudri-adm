<template>
  <VDialog
    v-model="active"
    max-width="440px"
    class="report"
    content-class="report"
    @input="onInput"
  >
    <VCard flat>
      <button type="button" class="uno-modal__close" @click="onInput" />
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
              placeholder="Телефон для связи"
              class="report__phone"
              :class="{ 'has-content': contact.length }"
              @onEdit="contact = $event"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions class="report__bottom">
        <v-btn
          color="primary"
          flat
          :disabled="!message || !contact || contact.length < 10"
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
      if (send && this.message && this.contact && this.contact.length === 10) {
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
    .v-card__text {
      padding: 0;
    }
    &__title {
      position: relative;
      padding-top: 77px;
      justify-content: center;
      font-family: $roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: normal;

      color: #07101C;

      &:before {
        position: absolute;
        width: 44px;
        height: 44px;
        content: '';
        background: url('../assets/images/svg/broken.svg') center top no-repeat;
        top: 0;
      }
    }
    .v-label {
      @extend %placeholder;
      max-width: 100%;
    }
    .v-text-field__slot {
      justify-content: center;
    }
    .v-text-field > .v-input__control > .v-input__slot:before {
      border-color: #8995AF;
    }
    &__description {
      margin-top: 26px;
    }
    textarea {
      font-family: $lato;
      font-weight: normal !important;
      font-size: 14px !important;
      line-height: normal;
      text-align: center;
      color: #07101C !important;
    }
    ._phone {
      margin-top: 20px;
    }
    .v-input {
      .v-text-field__prefix {
        display: none;
      }
      input::placeholder {
        @extend %placeholder;
      }
    }
    .v-input--is-focused, .has-content {
      .v-text-field__prefix {
        display: block;
      }
      input {
        max-width: 110px;
        text-align: left;
        &::placeholder {
          color: transparent;
        }
      }
    }
    &__bottom {
      justify-content: center;
      margin-top: 33px;
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
