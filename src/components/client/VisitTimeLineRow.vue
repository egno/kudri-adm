<template>
  <v-hover>
    <v-layout
      slot-scope="{ hover }"
      :class="{'row-hover': hover}"
    >
      <v-flex
        xs3
        pr-2
        py-2
        class="text-xs-right timeline-date "
      >
        <div class="client-visit-date">
          {{ visit.date }}
        </div>
        <div :style="{color: statusColor}">
          {{ visit.displayStatus }}
        </div>
        <!--<div class="circle" :style="{color: statusColor}" />-->
      </v-flex>
      <v-flex
        xs9
        px-3
        py-2
        class="text-xs-left"
      >
        <v-layout column>
          <v-flex>
            {{ visit.time }}
          </v-flex>
          <v-flex v-if="services">
            <v-layout column>
              <v-flex
                v-for="(service, si) in services"
                :key="'s'+si"
              >
                <v-layout row justify-space-between>
                  <v-flex>
                    {{ service.name }}
                  </v-flex>
                  <div
                    v-if="service.price"
                    class="visit-service-price"
                    :class="{'service-undone': isUndone}"
                  >
                    {{ service.price }} ₽
                  </div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex v-if="master">
            <v-layout
              column
              py-1
            >
              <v-flex>
                <span class="font-weight-bold">Мастер</span>
              </v-flex>
              <v-flex>
                {{ master }}
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-hover>
</template>

<script>
import Visit from '@/classes/visit'

export default {
  props: {
    visit: {
      type: Object,
      default () {
        return new Visit()
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    isUndone () {
      return !this.visit.currentStatus.done
    },
    statusColor () {
      return this.visit.currentStatus.color || 'grey'
    },
    master () {
      return this.visit && this.visit.master && this.visit.master.name
    },
    services () {
      return this.visit && this.visit.j && this.visit.j.services
    }
  }
}
</script>

<style scoped>
.circle {
  position: relative;
  left: 94px;
  top: -15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 5px solid ;
  text-align: center;
}
.timeline-date {
  border-right: solid 2px;
  border-color: rgba(0.5, 0.5, 0.5, 0.1);
}
.visit-service-price {
  height: 18px;
  padding: 0 10px;
  background: rgba(137, 149, 175, 0.35);
  border-radius: 12px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  white-space: nowrap;
}
.row-hover {
  background-color: #eee;
}
.service-undone {
  background-color: #ccc;
}
</style>

