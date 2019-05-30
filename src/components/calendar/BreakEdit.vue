<template>
  <v-dialog
    :value="visible"
    content-class="create-break"
    max-width="440px"
    @input="$emit('close')"
  >
    <VForm class="create-break__content uno-modal">
      <button type="button" class="uno-modal__close" @click="$emit('close')" />
      <div class="uno-modal__header">
        Добавить перерыв
      </div>
      <div class="right-attached-panel__field-name">
        Дата и время
      </div>
      <VLayout justify-space-between>
        <div> {{ selectedDateFormatted }} </div>
        <VLayout row align-center class="create-break__right">
          <div class="create-break__times day-schedule__times">
            <TimeEdit
              :class="{'error--text': error}"
              :time="start"
              placeholder="––:––"
              @correctInput="onTimeEdit('start', $event)"
            />
            <div> — </div>
            <TimeEdit
              :class="{'error--text': error}"
              :time="end"
              placeholder="––:––"
              @correctInput="onTimeEdit('end', $event)"
            />
          </div>
          <div class="create-break__clear" @click="clear" />
        </VLayout>
      </VLayout>
      <div v-if="error" class="create-break__error">
        <span class="error--text">{{ error }}</span>
      </div>
      <div class="businesscard-form__field">
        <v-textarea
          v-model="notes"
          label="Комментарий"
          maxlength="500"
          auto-grow
          rows="1"
        />
      </div>
      <div class="uno-modal__buttons">
        <button :disabled="disabled" type="button" class="uno-modal__right" @click="saveBreak">
          Сохранить
        </button>
      </div>
    </VForm>
  </v-dialog>
</template>

<script>
  import TimeEdit from '@/components/TimeEdit.vue'
  import Api from '@/api/backend'
  import { mapActions } from 'vuex'
  import { makeAlert } from '@/api/utils'
  import { hyphensStringToDate } from '@/components/calendar/utils'
  export default {
    components: { TimeEdit },
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
        return this.break && this.break.ts_begin? hyphensStringToDate(this.break.ts_begin.substring(0,10)) : new Date()
      },
      dateString () {
        return this.break.ts_begin? this.break.ts_begin.substring(0,10): ''
      },
      disabled () {
        return !this.start || !this.end || !!this.error
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
          return this.break && this.break.id? this.startTime.substring(11,16) : ''
        }
      },
      end: {
        set (newVal) {
          this.$emit('inputEnd', newVal? `${this.dateString}T${newVal}:00` : `${this.dateString}T`)
        },
        get () {
          return this.break && this.break.id? this.endTime.substring(11,16) : ''
        }
      },
      notes: {
        set (newVal) {
          this.$emit('inputNotes', newVal)
        },
        get () {
          const n = this.break && this.break.id? this.notesProp : ''
          return n
        }
      }
    },
    methods: {
      ...mapActions(['alert']),
      clear () {
        this.start = ''
        this.end = ''
      },
      // convertToVisit ({ start, end, notes }) {
      //   const date = this.date.toISOString().substring(0,10)
      //
      //   return {
      //     business_id: this.employeeId,
      //     ts_begin: `${date}T${start}`,
      //     ts_end: `${date}T${end}`,
      //     j: {
      //       type: 'break',
      //       notes
      //     }
      //   }
      // },
      onTimeEdit (prop, value) {
        this[prop] = value
        this.$nextTick(() => {
          this.error = this.validate()
        })

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
            .patch('visit', this.break)
          : Api()
            .post('visit', this.break)
      },
      saveBreak () {
        // todo проверить случай, когда диапазон выходит за пределы рабочего времени
        // todo округлять выбранное время (по 15-минутным интервалам)

        this.send()
          .then(() => {
            this.start = ''
            this.end = ''
            this.notes = ''
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
  @import '../../assets/styles/day-schedule';

  .create-break {
    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
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
  }
</style>
