<template>
  <v-hover>
    <v-layout
      slot-scope="{ hover }"
      row
      fluid
      :class="{'row-hover': hover}"
    >
      <v-flex
        xs3
        class="grey--text text-xs-right timeline-date "
        pr-2
        py-2
      >
        {{ visit.date }}
        <div class="circle" :style="{color: statusColor}" />
      </v-flex>
      <v-flex
        xs9
        px-3
        py-2
      >
        <v-layout column>
          <v-flex class="grey--text">
            {{ visit.time }}
          </v-flex>
          <v-flex v-if="services">
            <v-layout column>
              <v-flex
                v-for="(service, si) in services"
                :key="'s'+si"
              >
                <v-layout row>
                  <v-flex xs8>
                    {{ service.name }}
                  </v-flex>
                  <v-flex
                    v-if="service.price"
                    xs4
                    class="text-xs-right"
                  >
                    <div
                      :class="{'service-undone': isUndone}"
                      class="badge-inline"
                    >
                      <span>{{ service.price }} ₽</span>
                    </div>
                  </v-flex>
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
          <v-flex>
            <span :style="{color: statusColor}">
              {{ visit.displayStatus }}
            </span>
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
      return this.visit && this.visit.client && this.visit.client.services
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
.badge-inline {
  display: inline-block;
  border-radius: 1em;
  padding: 0;
  height: 1.5em;
  background-color: grey;
}
.badge-inline span {
  color: white;
  display: inline-block;
  margin-left: 0.75em;
  margin-right: 0.75em;
}
.row-hover {
  background-color: #eee;
}
.service-undone {
  background-color: #ccc;
}
</style>

