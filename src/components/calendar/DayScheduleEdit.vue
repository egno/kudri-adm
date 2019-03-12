<template>
  <v-card v-if="day">
    <v-card-title>{{ displayDate }}</v-card-title>
    <v-card-text>
      <v-layout
        row
        align-space-around
        justify-center
        full-height
      >
        <v-flex>
          <PeriodEdit
            caption="Время работы"
            :period-start="workTime[0]"
            :period-end="workTime[1]"
            @onEdit="onEditWorkTime"
          />
        </v-flex>
        <v-flex>
          <PeriodEdit
            show-switch
            caption="Перерыв"
            :period-start="timeOff[0]"
            :period-end="timeOff[1]"
            @onEdit="onEditTimeOff"
          />
        </v-flex>
        <v-flex>
          <v-btn @click="scheduleArray=['','']">
            Сделать нерабочим
          </v-btn>
          <v-btn @click="scheduleArray=['00:00','00:00']">
            Круглосуточно
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <VSpacer />
      <v-btn
        color="primary"
        @click="onSave"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
import PeriodEdit from '@/components/PeriodEdit.vue'
export default {
  components: { PeriodEdit },
  props: {
    day: { type: Date, default: undefined },
    schedule: {
      type: Array,
      default () {
        return ['', '']
      }
    }
  },
  data () {
    return {
      scheduleArray: undefined
    }
  },
  computed: {
    displayDate () {
      return this.day.toLocaleDateString('ru-RU')
    },
    workTime () {
      return [
        this.scheduleArray[0],
        this.scheduleArray[this.scheduleArray.length - 1]
      ]
    },
    timeOff () {
      if (this.scheduleArray.length > 2) {
        return [this.scheduleArray[1], this.scheduleArray[2]]
      }
      return ['', '']
    }
  },
  watch: {
    schedule: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.scheduleArray = this.schedule
    },
    onEditTimeOff (payload) {
      if (!(payload[0] && payload[1]) && this.scheduleArray.length > 2) {
        this.scheduleArray = [
          this.scheduleArray[0],
          this.scheduleArray[this.scheduleArray.length - 1]
        ]
      }
      if (payload[0] && payload[1]) {
        this.scheduleArray = [
          this.scheduleArray[0],
          payload[0],
          payload[1],
          this.scheduleArray[this.scheduleArray.length - 1]
        ]
      }
    },
    onEditWorkTime (payload) {
      this.scheduleArray[0] = payload[0]
      this.scheduleArray[this.scheduleArray.length - 1] = payload[1]
    },
    onSave () {
      this.$emit('onEdit', this.scheduleArray)
    }
  }
}
</script>
