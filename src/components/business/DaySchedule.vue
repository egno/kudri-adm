<template>
  <VFlex v-if="newDaySchedule" class="day-schedule__times">
    <TimeEdit
      :class="{error: errors.includes('intervalError')}"
      :time="newDaySchedule.start"
      @onEdit="onEdit('start', $event)"
    />
    <TimeEdit
      :class="{error: errors.includes('intervalError')}"
      :time="newDaySchedule.end"
      @onEdit="onEdit('end', $event)"
    />
  </VFlex>
</template>

<script>
  import TimeEdit from '@/components/TimeEdit.vue'
  import ScheduleDay from '@/classes/scheduleDay'

  export default {
    components: { TimeEdit },
    props: {
      daySchedule: {
        type: Object,
        default () {
          return new ScheduleDay({
            start: '00:00',
            end: '00:00',
          })
        }
      },
    },
    data () {
      return {
        newDaySchedule: new ScheduleDay(this.daySchedule),
        errors: []
      }
    },
    computed: {
    },
    watch: {
      daySchedule: 'update'
    },
    methods: {
      reset () {
        this.errors = []
        this.newDaySchedule = new ScheduleDay({
            start: '00:00',
            end: '00:00',
          })
      },
      onEdit (prop, value) {
        this.newDaySchedule[prop] = value
        this.validateNewSchedule()
        if (this.errors.length) {
          return
        }

        this.$emit('editDay', this.newDaySchedule)
      },
      update () {
        this.newDaySchedule = new ScheduleDay(this.daySchedule)
      },
      validateNewSchedule () {
        this.errors = []
        const startTime = this.getTimeArray(this.newDaySchedule.start)
        const endTime = this.getTimeArray(this.newDaySchedule.end)

        if (endTime[0] < startTime[0] || endTime[0] === startTime[0] && endTime[1] < startTime[1]) {
          this.errors.push('intervalError')
        }
      },
      getTimeArray (timeString) {
        return timeString.split(':').map(str => parseInt(str))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/day-schedule';

  #app {
    .last {
      margin-bottom: 0;
    }
    .workmode-wrap {
      margin-left: 12px;
    }
  }
  #app .v-btn.delete {
    right: -66px;
    top: -2px;
    position: absolute;
  }
  .fill,
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
    margin-right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    position: relative;
    z-index: 2;
    cursor: pointer;
    user-select: none;
    color: rgba(137, 149, 175, 0.35);
    &.fill {
      background: transparent;
      &:before {
        display: none;
      }
    }
  }
  .fill {
    background: #d6dae3;
    + .fill {
      &:before {
        content: '';
        height: 24px;
        width: 30px;
        position: absolute;
        left: -17px;
        z-index: -1;
        background: #d6dae3;
      }
    }
  }
</style>
