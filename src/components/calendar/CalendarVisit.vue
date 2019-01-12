<template>
  <div
    :style="`height: ${actualContainerHight}; top:${containerOffset}`"
    class="visit-container"
    @click="isSelected = !isSelected"
  >
    <div>
      <v-tooltip
        right
        :disabled="isSelected"
      >
        <div
          slot="activator"
          :style="`background: ${bgColor}; color: #eee; height: auto; font-size: 0.9em;`"
        >
          <div
            v-if="isSelected"
            class="visit-bar"
          >
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

export default {
  components: { BusinessPhones },
  props: {
    color: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    containerHeight: { type: String, default: '' },
    containerOffset: { type: String, default: '' },
    timeStart: { type: String, default: '' },
    timeEnd: { type: String, default: '' },
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
    return {
      isSelected: false
    };
  },
  computed: {
    bgColor() {
      return (
        this.color ||
        hashColor(`${this.name}${this.phone}${this.email}`, 30, 40)
      );
    },
    actualContainerHight() {
      return this.isSelected ? 'auto' : this.containerHeight;
    }
  },
  methods: {
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
  display: inline-block;
  opacity: 0.6;
  background: #333;
  width: 100%;
}
.visit-container {
  position: relative;
  display: block;
  overflow: scroll;
  transition: 0.5s;
  z-index: 99;
}
.visit-container:hover {
  height: auto;
}
.visit-content {
  padding: 0.5em;
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
</style>
