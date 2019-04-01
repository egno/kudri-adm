<template>
  <div v-if="newDaySchedule" class="day-schedule__times">
    <TimeEdit
      :class="{'error--text': errors.includes('intervalError') || newDaySchedule.end && !newDaySchedule.start}"
      :time="newDaySchedule.start"
      placeholder="––:––"
      @correctInput="onEdit('start', $event)"
    />
    <div> — </div>
    <TimeEdit
      :class="{'error--text': errors.includes('intervalError')|| newDaySchedule.start && !newDaySchedule.end}"
      :time="newDaySchedule.end"
      placeholder="––:––"
      @correctInput="onEdit('end', $event)"
    />
  </div>
</template>

<script>
  import TimeEdit from '@/components/TimeEdit.vue'
  import ScheduleDay from '@/classes/scheduleDay'
  import { scheduleMixin} from './mixins'

  export default {
    components: { TimeEdit },
    mixins: [ scheduleMixin ],
    props: {
      daySchedule: {
        type: Object,
        default () {
          return new ScheduleDay({
            start: '',
            end: '',
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
      onEdit (prop, value) {
        this.newDaySchedule[prop] = value
        this.errors = this.getDayScheduleErrors(this.newDaySchedule)
        this.$emit('editDay', this.newDaySchedule)
      },
      update () {
        this.newDaySchedule = new ScheduleDay(this.daySchedule)
      },

    }
  }
</script>

<style lang="scss">
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
    @extend %vertical-align;
    justify-content: center;
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
