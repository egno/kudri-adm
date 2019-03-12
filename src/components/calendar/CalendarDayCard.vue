<template>
  <v-card
    height="8em"
    :color="day.outOfRange ? 'grey': ''"
    @click="onClickDate(day.dateKey)"
  >
    <v-card-title>
      <div>{{ day.display }}</div>
    </v-card-title>
    <CalendarVisit
      v-for="(visit, i) in visits"
      :key="i"
      :time-start="timeFmt(visit.ts_begin)"
      :time-end="timeFmt(visit.ts_end)"
      :visitor="visit.client"
    />
  </v-card>
</template>

<script>
import { getRESTTime } from '@/components/calendar/utils'
import CalendarVisit from '@/components/calendar/CalendarVisit.vue'

export default {
  components: { CalendarVisit },
  props: {
    day: {
      type: Object,
      default () {
        return {}
      }
    },
    visits: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    onClickDate (dt) {
      this.$emit('onClickDate', dt)
    },
    timeFmt (ts) {
      return getRESTTime(ts)
    }
  }
}
</script>

