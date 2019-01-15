<template>
  <div
    :style="`max-height: ${actualContainerHight}; top:${containerOffset}`"
    :class="['visit-container', {active: isSelected}]"
    @click="selectVisit(isSelected ? null : id)"
  >
    <div>
      <v-tooltip
        left
        :disabled="isSelected"
      >
        <div
          slot="activator"
          :style="`background: ${bgColor}; color: #eee; height: auto; font-size: 0.9em;`"
        >
          <div
            :style="`max-height: ${isSelected ? '10em': '0em'}`"
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
              {{ duration }} мин.
            </div>
            <div class="visit-name">
              {{ name }}
            </div>
            <BusinessPhones
              v-if="phone"
              title
              light
              :phones="[phone]"
            />
            <div>{{ service.name }}</div>
          </div>
        </div>
        <div>
          <div class="visit-time">
            {{ timeStart }} - {{ timeEnd }}
          </div>
          <div class="visit-duration">
            {{ duration }} мин.
          </div>
          <div class="visit-name">
            {{ name }}
          </div>
          <BusinessPhones
            v-if="phone"
            title
            light
            :phones="[phone]"
          />
          <div>{{ service.name }}</div>
        </div>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import BusinessPhones from '@/components/business/BusinessPhones.vue';
import { hashColor } from '@/components/utils';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { BusinessPhones },
  props: {
    color: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    containerHeight: { type: String, default: '' },
    containerOffset: { type: String, default: '' },
    timeStart: { type: String, default: '' },
    timeEnd: { type: String, default: '' },
    id: { type: String, default: undefined },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    selected: { type: Boolean, default: false },
    service: {
      type: Object,
      default() {
        return {};
      }
    },
    visitor: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['selectedVisit']),
    bgColor() {
      return (
        this.color ||
        hashColor(`${this.name}${this.phone}${this.email}`, 30, 40)
      );
    },
    actualContainerHight() {
      return this.isSelected ? '20em' : this.containerHeight || 'em';
    },
    isSelected() {
      return this.id && this.id === this.selectedVisit;
    }
  },
  methods: {
    ...mapActions(['selectVisit']),
    load() {
      this.isSelected = this.selected;
    },
    onDelete() {
      this.$emit('onDelete');
    },
    onEdit() {
      this.$emit('onEdit');
    },
    onSelect() {
      this.$emit('unselectOthers');
    }
  }
};
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
  overflow: scroll;
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
