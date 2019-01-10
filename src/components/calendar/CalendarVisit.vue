<template>
  <div
    :style="`background: ${color}; color: #eee; height: 100%; padding: 0.5em; font-size: 0.9em;`"
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
      :phones="[phone]"
    />
    <div>{{ service }}</div>
  </div>
</template>

<script>
import BusinessPhones from '@/components/business/BusinessPhones.vue';

export default {
  components: { BusinessPhones },
  props: {
    color: { type: String, default: '' },
    during: { type: Number, default: 0 },
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
  computed: {}
};
</script>

<style scoped>
.visit-time {
  color: #eee;
}
.visit-during {
  color: #999;
}
.visit-name {
  font-weight: bolder;
}
</style>
