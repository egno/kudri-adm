<template>
  <v-dialog
    :value="visible"
    content-class="create-break"
    max-width="440px"
    @input="$emit('close')"
  >
    <VForm class="create-break__content uno-modal">
      <button type="button" class="uno-modal__close" @click="$emit('close')" />
      <div class="create-break__header">
        Добавить перерыв
      </div>
      <div class="create-break__subheader">
        Дата и время
      </div>
      <VLayout justify-space-between class="create-break__date-time">
        <div> {{ selectedDateFormatted }} </div>
        <VLayout row align-center class="create-break__right">
          <div class="create-break__times day-schedule__times">
            <div> {{ start }} </div>
            <div style="margin: 0 5px">
              —
            </div>
            <div :style="!end && { color: 'rgba(137, 149, 175, 0.35)' }">
              {{ end? end : '00:00' }}
            </div>
          </div>
        </VLayout>
      </VLayout>
      <div class="create-break__subheader">
        Длительность (мин)
      </div>
      <Counter
        id="create-break-duration"
        :input-disabled="true"
        :round-counter="true"
        :value="duration"
        :min-value="15"
        :max-value="720"
        :interval="15"
        :class="{ _invalid: duration < 15 || duration > 720}"
        @changeCount="duration = $event"
      />

      <div v-if="error" class="create-break__error">
        <span class="error--text">{{ error }}</span>
      </div>
      <VLayout justify-center class="create-break__notes">
        <v-textarea
          v-model="notes"
          label="КОММЕНТАРИЙ"
          maxlength="500"
          auto-grow
          rows="1"
        />
      </VLayout>
      <div class="uno-modal__buttons">
        <button :disabled="disabled" type="button" class="uno-modal__right" @click="saveBreak">
          Сохранить
        </button>
      </div>
    </VForm>
  </v-dialog>
</template>

<script>
  import Api from '@/api/backend'
  import { mapActions } from 'vuex'
  import { makeAlert } from '@/api/utils'
  import { dateISOInLocalTimeZone } from '@/components/calendar/utils'
  import Counter from '@/components/common/Counter'

  export default {
    components: { Counter },
    model: {
      prop: 'visible',
      event: 'close'
    },
    props: {
      break: {
        type: Object,
        default () {
          return {}
        }
      },
      employeeId: {
        type: String,
        default: ''
      },
      startTime: {
        type: String,
        default: ''
      },
      endTime: {
        type: String,
        default: ''
      },
      notesProp: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
    },
    data () {
      return {
        error: '',
      }
    },
    computed: {
      date () {
        return this.break && this.break.ts_begin? new Date(Date.parse(this.break.ts_begin)) : new Date()
      },
      dateString () {
        return this.break.ts_begin? this.break.ts_begin.substring(0,10): ''
      },
      disabled () {
        return !this.start || !this.end || !!this.error
      },
      duration : {
        set (newVal) {
          this.$emit('inputEnd', dateISOInLocalTimeZone(this.addMinutes(newVal)) )
        },
        get () {
          if (!(this.break && this.break.ts_begin && this.break.ts_end)) {
            return 0
          }
          return (Date.parse(this.break.ts_end) - Date.parse(this.break.ts_begin)) / (1000 * 60)
        }
      },
      selectedDateFormatted () {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        }
        return this.date.toLocaleString("ru", options)
      },
      start: {
        set (newVal) {
          this.$emit('inputStart', newVal? `${this.dateString}T${newVal}:00` : `${this.dateString}T`)
        },
        get () {
          return this.break && this.break.ts_begin? this.startTime.substring(11,16) : ''
        }
      },
      end: {
        set (newVal) {
          this.$emit('inputEnd', newVal? `${this.dateString}T${newVal}:00` : `${this.dateString}T`)
        },
        get () {
          return this.break && this.break.ts_end? this.endTime.substring(11,16) : ''
        }
      },
      notes: {
        set (newVal) {
          this.$emit('inputNotes', newVal)
        },
        get () {
          const n = this.break && this.break.j? this.notesProp : ''
          return n
        }
      }
    },
    methods: {
      ...mapActions(['alert']),
      addMinutes (minutes) {
        return new Date(this.date.getTime() + minutes*60000)
      },
      validate () {
        if (!this.start || !this.end) {
          return
        }
        if (this.start < this.end) {
          return false
        } else {
          return 'Некорректный диапазон времени'
        }
      },
      send () {
        return this.break.id
          ? Api()
            .patch(`visit?id=eq.${this.break.id}`, this.break)
          : Api()
            .post('visit', this.break)
      },
      saveBreak () {
        // todo проверить случай, когда диапазон выходит за пределы рабочего времени
        // todo проверять не перекрывает ли диапазон имеющиеся визиты
        this.send()
          .then(() => {
            this.$emit('close')
          })
          .catch(err => {
            console.log(err)
            this.alert(makeAlert(err))
          })
      },

    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common";
  @import '../../assets/styles/day-schedule';

  .create-break {
    color: #07101C;

    &__header {
      margin-top: 78px;
      margin-bottom: 10px;
      font-family: $roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 24px;
      text-align: center;
    }
    &__subheader {
      margin-top: 25px;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: url('../../assets/images/svg/cup-gold.svg') center 52px no-repeat #fff;
    }
    &__date-time {
      margin-top: 10px;
      padding: 0 30px;
    }
    &__right {
      flex-grow: 0;
    }
    &__clear {
      width: 10px;
      height: 10px;
      margin-left: 7px;
      cursor: pointer;
      background: url('../../assets/images/svg/cross.svg') center no-repeat;
    }
    &__error {
      margin: 20px 0 0;
    }
    &__notes {
      margin-top: 34px;
    }
    .v-label {
      max-width: 100%;
      letter-spacing: 0.25em;
      text-align: center;
      font-size: 12px;
    }
    .counter {
      width: 125px;
      margin: 0 auto;
      &._invalid input {
        color: #EF4D37;
      }
    }
    .uno-modal__buttons {
      justify-content: center;
    }
    .uno-modal__right[disabled="disabled"] {
      @extend %button-disabled;
      @media only screen and (min-width : $desktop) {
        padding: 0 60px;
      }
    }
  }
</style>
