<template>
  <div>
    <VLayout v-if="weekSchedule && weekSchedule.data">
      <VFlex v-for="(day, index) in days" :key="index" class="day-schedule">
        <div class="day-schedule__dayname">
          {{ day.dayName }}
        </div>
        <DaySchedule
          :day-schedule="day.value"
          @editDay="onEditDay(index, $event)"
        />
      </VFlex>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <Checkbox v-model="forAllDays" label="Выбрать все дни недели" class="day-schedule__for-all" />
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
      if (!this.forAllDays) {
        this.newWeekSchedule.data[dayIndex] = newDay
      } else {
        this.newWeekSchedule.data.fill(newDay)
      }
      this.$emit('editWeek', this.newWeekSchedule) // todo add debounce
      this.setDays()
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/styles/day-schedule';

  .add-workmode {
    margin-top: 35px;
  }
</style>
