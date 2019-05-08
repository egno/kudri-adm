<template>
  <div
    :style="`height: ${actualContainerHight}px; background: ${bgColor}; color: #eee; font-size: 0.9em;`"
    :class="['visit-container']"
    @click="selectVisit(id)"
  >
    <div>
      <v-tooltip
        left
      >
        <div
          slot="activator"
        >
          <div
            class="visit-bar"
          >
            <v-btn
              small
              flat
              icon
              dark
              ripple
              @click="onEdit"
            >
              <v-icon small>
                edit
              </v-icon>
            </v-btn>
            <v-btn
              small
              flat
              icon
              dark
              ripple
              @click="onDelete"
            >
              <v-icon small>
                delete
              </v-icon>
            </v-btn>
          </div>
          <div class="visit-content">
            <div class="visit-time">
              {{ timeStart }} - {{ timeEnd }}
            </div>
            <div class="visit-duration">
              {{ visit.j.duration }} мин.
            </div>
            <div class="visit-name">
              {{ visit.clientName }}
            </div>
            <BusinessPhones
              v-if="visit.client.phone"
              title
              light
              :phones="[visit.client.phone]"
            />
            <div
              v-for="(service,n) in services"
              :key="n"
            >
              {{ service.name }}
            </div>
          </div>
        </div>
        <div>
          <div class="visit-time">
            {{ timeStart }} - {{ timeEnd }}
          </div>
          <div class="visit-duration">
            {{ visit.j.duration }} мин.
          </div>
          <div class="visit-name">
            {{ visit.clientName }}
          </div>
          <BusinessPhones
            v-if="visit.client.phone"
            title
            light
            :phones="[visit.client.phone]"
          />
          <div
            v-for="(service,n) in services"
            :key="n"
          >
            {{ service.name }}
          </div>
        </div>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import BusinessPhones from '@/components/business/BusinessPhones.vue'
import { hashColor } from '@/components/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { BusinessPhones },
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
    onDelete () {
      this.$emit('onDelete')
    },
    onEdit () {
      this.$emit('onEdit')
    },
    onSelect () {
      this.$emit('unselectOthers')
    }
  }
}
</script>

<style scoped>
.v-btn {
  float: right;
  margin: 0;
  border-radius: 0;
}
.visit-bar {
  display: flex;
  opacity: 0.6;
  background: #333;
  width: 100%;
  overflow: hidden;
  height: auto;
  transition: all 1s ease 0s;
}
.active .visit-bar {
  transition: all 1s ease 0s;
}
.visit-container {
  position: relative;
  display: block;
  overflow: hidden;
  transition: all 0.5s ease 0s;
  z-index: 1;
  height: auto;
  max-height: 30em;
}
.visit-container:hover {
  height: auto;
}
.visit-content {
  padding: 0.5em;
  box-shadow: inset 0 0 3em 0 rgba(0, 0, 0, 0.5);
}
.visit-time {
  opacity: 1;
}
.visit-duration {
  opacity: 0.7;
}
.visit-name {
  font-weight: bolder;
}
.active {
  z-index: 2;
}
</style>
