<template>
  <div>
    <VLayout v-if="newWeekSchedule && newWeekSchedule.data" align-space-between justify-space-around column fill-height>
      <VFlex v-for="(day, index) in days" :key="index" xs12 class="day-schedule">
        <div class="day-schedule__dayname">
          {{ day.dayName }}
        </div>
        <div class="schedule__edit">
          <DaySchedule
            :day-schedule="day.value"
            @editDay="onEditDay(index, $event)"
          />
          <div class="schedule__clear" @click="day.value = { start: '', end: '' }" />
        </div>
      </VFlex>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <Checkbox v-model="forAllDays" label="Для всех дней недели" class="day-schedule__for-all" @change="onToggleForAll" />
      </VFlex>
    </VLayout>
  </div>
</template>

<script>
import DaySchedule from '@/components/business/DaySchedule.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import { scheduleMixin} from './mixins'

export default {
  components: { DaySchedule, Checkbox },
  mixins: [ scheduleMixin ],
  data () {
    return {
      forAllDays: false
    }
  },
  methods: {
    onEditDay (dayIndex, newDay) {
      if (!this.newWeekSchedule || !this.newWeekSchedule.data) {
        return
      }
      if (!this.forAllDays) {
        this.newWeekSchedule.data[dayIndex] = newDay
      } else {
        this.newWeekSchedule.data.fill(newDay)
      }
      this.$emit('editWeek', this.newWeekSchedule) // todo add debounce
    },
    onToggleForAll (forAll) {
      if (!forAll) {
        return
      }

      const filled = this.filledDays()
      let repeated

      switch (filled.length) {
        case 0:
          this.newWeekSchedule.data.fill({ start: '09:00', end: '21:00' })
          break
        case 1:
          this.newWeekSchedule.data.fill(filled[0].value)
          break
        default:
          repeated = this.checkRepeated()
          if (repeated) {
            this.newWeekSchedule.data.fill(repeated.value)
          } else {
            this.newWeekSchedule.data.fill({ start: '09:00', end: '21:00' })
          }
      }

      this.$emit('editWeek', this.newWeekSchedule)
    },
    filledDays () {
      if (!(this.days && this.days.length)) {
        return
      }

      return this.days.filter((day) => day.value && day.value.start && day.value.end)
    },
    checkRepeated () {
      for (let i = 0; i < this.days.length - 1; i++) {
        const day = this.days[i]

        if (!day.value.start  || !day.value.end) {
          continue
        }

        let j = i + 1
        for (; j < this.days.length; j++) {
          const nextDay = this.days[j]

          if (!nextDay.value.start || !nextDay.value.end) {
            continue
          }

          if (day.value.start !== nextDay.value.start ||  day.value.end !== nextDay.value.end) {
            break
          }
        }

        if (j === this.days.length) {
          return day
        }
      }

      return false
    }
  }
}
</script>
<style lang="scss">

  .add-workmode {
    margin-top: 35px;
  }
  .schedule__edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .schedule__clear {
    width: 16px;
    height: 16px;
    margin-left: 7px;
    cursor: pointer;
    background: url('../../assets/images/svg/cross.svg') center no-repeat;
  }
</style>
