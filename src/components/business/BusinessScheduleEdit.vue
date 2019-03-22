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
        <Checkbox v-model="forAllDays" label="Для всех дней недели" class="day-schedule__for-all" />
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
