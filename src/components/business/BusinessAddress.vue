<template>
  <div>
    <div>
      <span :class="captionClass">
        Адрес
      </span>
      &nbsp;
      <AddressLink :address="address" />
    </div>
    <VSlideYTransition />
  </div>
</template>

<script>
import AddressLink from '@/components/yandex/AddressLink.vue';
export default {
  components: { AddressLink },
  props: {
    address: { type: String, default: null },
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    }
  },
  data() {
    return {
      showDetails: false
    };
  }
};
</script>
