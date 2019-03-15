<template>
  <div class="schedule">
    <div class="schedule__header" :class="{_expanded: expanded }">
      Режим работы
    </div>
    <div class="schedule__container">
      <div v-for="(item, index) in groups" :key="index">
        <div v-for="(dayName, j) in daysGrouped[index]" :key="j">
          {{ dayName }}
        </div>
        <div v-if="item">
          {{ item.start }} - {{ item.end }}
        </div>
      </div>
    </div>
  </div>
  <!--<VLayout
    v-if="schedule"
    column
  >
    <VFlex pb-2>
      <div :class="captionClass">
        Режим работы
      </div>
    </VFlex>
    <VContainer
      pt-0
      pl-2
    >
      <VLayout
        justify-space-around
        column
        wrap
      >
        <VFlex
          v-for="(item) in scheduleGroup"
          :key="item.dow"
          pt-0
          pb-0
        >
          <span :class="captionClass">
            {{ item.dow }}:&nbsp;
          </span>
          <span
            v-if="item.works"
            class="timeClass"
          >
            {{ item.time }}
          </span>
          <span
            v-else
            class="timeClass"
          >
            выходной
          </span>
        </VFlex>
      </VLayout>
    </VContainer>
  </VLayout>-->
</template>

<script>
  function areDaysSame (day, nextDay) {
    return day.start === nextDay.start && day.lunchStart === nextDay.lunchStart &&
    day.end === nextDay.end && day.lunchEnd !== nextDay.lunchEnd
  }
  function isInGroups (groups, day) {
    if (!groups.length) {
      return false
    }
    return groups.some(d => areDaysSame(d, day))
  }

export default {
  props: {
    captionClass: {
      type: String,
      default: ''
    },
    schedule: {
      type: Object,
      default () {
        return { type: 'week', data: [] }
      }
    },
    expanded: { type: Boolean, default: false }
  },
  data () {
    return {
      dow: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    }
  },
  computed: {
    scheduleGroup () {
      return (
        this.schedule &&
        this.schedule.data &&
        this.schedule.data
          .reduce((r, x, i) => {
            let prev = r[r.length - 1] || [['', '']]
            if (!(prev[0][0] === x[0] && prev[0][1] === x[1])) {
              r.push([x, i, i])
            } else {
              prev[2] = i
            }
            return r
          }, [])
          .map(x => {
            return {
              time: `${x[0][0]}-${x[0][1]}`,
              dow:
                x[1] === x[2]
                  ? this.dow[x[1]]
                  : `${this.dow[x[1]]}-${this.dow[x[2]]}`,
              works: !!x[0][0]
            }
          })
      )
    },
    groups () {
      const days = this.schedule && this.schedule.data
      const groups = []

      days.forEach(day => {
        if (!isInGroups(groups, day)) {
          groups.push(day)
        }
      })

      return groups
    },
    daysGrouped () {
      const days = this.schedule && this.schedule.data
      const arr = []

      this.dow.forEach((dayName, i) => {
        let index = this.groups.findIndex((dayFromGroups) => {
          return areDaysSame(days[i], dayFromGroups)
        })

        if (index !== -1) {
          if (!arr[index]) {
            arr[index] = []
          }
          arr[index].push(dayName)
        }
      })

      return arr
    }
  }
}
</script>

<style>
.timeClass {
  font-size: 80%;
}
</style>

