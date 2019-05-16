<template>
  <div class="visit-wrapper">
    <div
      :style="`height: ${actualContainerHight}px; background: ${bgColor};`"
      :class="['visit', {
        'white-bg': whiteBg,
        canceled: visit.displayStatus === 'Отмена',
        unvisited: visit.displayStatus === 'Не пришел'
      }]"
      @click="selectVisit(visit)"
    >
      <div
        v-if="visit.j.duration < 45"
        class="visit__container"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <div class="visit__top">
          <div class="visit__time">
            {{ timeStart }} – {{ timeEnd }}
          </div>
        </div>
        <div class="visit__status">
          {{ visit.currentStatus.display }}
        </div>
      </div>
      <div
        v-else
        class="visit__container"
      >
        <div class="visit__top">
          <div class="visit__time">
            {{ timeStart }} – {{ timeEnd }}
          </div>
          <div class="visit__name">
            {{ visit.clientName }}
          </div>
          <div class="visit__phone">
            {{ visit.clientPhone | phoneFormat }}
          </div>
          <div
            v-for="(service,n) in services"
            :key="n"
            class="visit__service"
          >
            {{ service.name }}
          </div>
        </div>
        <div class="visit__status">
          {{ visit.currentStatus.display }}
        </div>
      </div>
    </div>
    <transition :duration="400" name="slide-fade">
      <div v-show="visit.j.duration < 45 && showTooltip" class="visit _tooltip">
        <div class="visit__container">
          <div class="visit__top">
            <div class="visit__time">
              {{ timeStart }} – {{ timeEnd }}
            </div>
            <div class="visit__name">
              {{ visit.clientName }}
            </div>
            <div class="visit__phone">
              {{ visit.clientPhone | phoneFormat }}
            </div>
            <div
              v-for="(service,n) in services"
              :key="n"
              class="visit__service"
            >
              {{ service.name }}
            </div>
          </div>
          <div class="visit__status">
            {{ visit.currentStatus.display }}
          </div>
        </div>        
      </div>
    </transition>
  </div>
</template>

<script>
import { hashColor } from '@/components/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    id: { type: String, default: undefined },
    selected: { type: Boolean, default: false },
    services: {
      type: Array,
      default () {
        return []
      }
    },
    visit: {
      type: Object,
      default () {
        return {}
      }
    },
    visitor: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      slotDuration: 15, /* smallest slot duration in minutes  */
      slotHeight: 55, /* smallest slot height in px */
      showTooltip: false
    }
  },
  computed: {
    ...mapGetters(['selectedVisit']),
    whiteBg () {
      const status = this.visit.currentStatus

       return status.display === 'Завершен' || status.display === 'Отмена' || status.display === 'Не пришел'
    },
    bgColor () {
      if (this.whiteBg) {
        return '#FFF'
      }

      return (
        this.visit.color ||
        (this.visit.clientName || this.visit.client.phone || this.email
          ? hashColor(`${this.visit.clientName}${this.visit.client.phone}${this.email}`, 30, 40)
          : 'grey')
      )
    },
    actualContainerHight () {
      return this.visit.j.duration / this.slotDuration * this.slotHeight
    },
    timeEnd () {
      return this.visit.timeEnd
    },
    timeStart () {
      return this.visit.time
    },
  },
  methods: {
    ...mapActions(['selectVisit']),
    onSelect () {
      this.$emit('unselectOthers')
    }
  }
}
</script>

<style lang="scss" scoped>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
.v-btn {
  float: right;
  margin: 0;
  border-radius: 0;
}

.visit-wrapper {
  position: relative;
  top: 1px;
}
.visit {
  font-size: 12px;
  transition: all 0.5s ease 0s;
  border-radius: 4px;
  text-align: left;
  &__container { 
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 9px 12px;  
    color: #fff;
  }
  &__top {
    width: 100%;
  }
  &__time {
    color: rgba(255, 255, 255, 0.8);
  }
  &__duration {
    opacity: 0.7;
  }
  &__name {
    margin-top: 7px;
    font-weight: bold;
    font-size: 14px;
    text-transform: capitalize;
  }
  &__phone {
    margin-top: 2px;
  }
  &__service {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.8);
    &::first-letter {
      text-transform: capitalize;
    }
  }
  &__status {
    color: rgba(255, 255, 255, 0.35);
  }
  &._tooltip {
    position: absolute;
    z-index: 10; 
    top: 100%;
    padding: 5px;
    background-color: #1C2F44 !important;
    box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.04); 
  }
  .active {
    z-index: 2;
  }
  &.white-bg {
    border-radius: 0;
    border-top: 2px solid #5699FF;
    
    .visit__container {
      color: #07101C;
    }
    .visit__time,
    .visit__service,
    .visit__status {
      color: #8995AF;
    }
  }

  &.canceled,
  &.unvisited {
    border-top: none;
  }

  &.unvisited {
    border-left: 2px solid #EF4D37;
    .visit__status {
      color: #EF4D37;
    }
  }

  &.canceled {
    border-left: 2px solid #8995AF;
    .visit__status {
      color: rgba(137, 149, 175, 0.35);
    }
  }
}
.v-tooltip__content .visit {
  min-height: 115px;
  padding: 0;
}
</style>
