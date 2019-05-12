<template>
  <v-tooltip
    v-if="visit.j.duration < 45"
    right
  >
    <div
      slot="activator"
    >
      <div
        :style="`height: ${actualContainerHight}px; background: ${bgColor};`"
        :class="['visit']"
        @click="selectVisit(id)"
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
    </div>
    <div class="visit">
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
  </v-tooltip>  
    
  <div 
    v-else
    :style="`height: ${actualContainerHight}px; background: ${bgColor};`"
    :class="['visit']"
    @click="selectVisit(id)"
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
      slotHeight: 55 /* smallest slot height in px */
    }
  },
  computed: {
    ...mapGetters(['selectedVisit']),
    bgColor () {
      return (
        this.color ||
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

<style lang="scss">
.v-btn {
  float: right;
  margin: 0;
  border-radius: 0;
}

.visit {
  position: relative;
  top: 1px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  overflow: hidden;
  padding: 9px 12px;  
  font-size: 12px;
  color: #fff;
  transition: all 0.5s ease 0s;
  z-index: 1;
  border-radius: 4px;
  text-align: left;
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
  }
  &__status {
    color: rgba(255, 255, 255, 0.35);
  }
  .active {
    z-index: 2;
  }
}
.v-tooltip__content .visit {
  min-height: 115px;
  padding: 0;
}
</style>
