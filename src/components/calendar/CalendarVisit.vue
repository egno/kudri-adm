<template>
  <div
    class="visit-container"
    :style="`height: ${actualContainerHight}`"
    @click="selected = !selected"
  >
    <v-tooltip
      right
      open-delay="500"
      close-delay="1000"
    >
      <div
        slot="activator"
        :style="`background: ${bgColor}; color: #eee; height: auto; padding: 0.5em; font-size: 0.9em;`"
      >
        <div class="visit-time">
          {{ timeStart }} - {{ timeEnd }}
        </div>
        <div class="visit-during">
          {{ during }} мин.
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
      <div>
        <div class="visit-time">
          {{ timeStart }} - {{ timeEnd }}
        </div>
        <div class="visit-during">
          {{ during }} мин.
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
</template>

<script>
import BusinessPhones from '@/components/business/BusinessPhones.vue';
import { hashColor } from '@/components/utils';

export default {
  components: { BusinessPhones },
  props: {
    color: { type: String, default: '' },
    during: { type: Number, default: 0 },
    containerHeight: { type: String, default: '' },
    timeStart: { type: String, default: '' },
    timeEnd: { type: String, default: '' },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    service: { type: String, default: '' },
    visitor: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      selected: false
    };
  },
  computed: {
    bgColor() {
      return (
        this.color ||
        hashColor(`${this.name}${this.phone}${this.email}`, 30, 50)
      );
    },
    actualContainerHight() {
      return this.selected ? 'auto' : this.containerHeight;
    }
  }
};
</script>

<style scoped>
.visit-container {
  position: relative;
  display: block;
  overflow: scroll;
}
.visit-container:hover {
  height: auto;
}
.visit-time {
  color: rgb(238, 238, 238);
}
.visit-during {
  color: rgba(255, 226, 226, 0.555);
}
.visit-name {
  font-weight: bolder;
}
</style>
