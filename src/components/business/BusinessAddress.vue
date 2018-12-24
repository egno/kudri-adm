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
      default: ''
    }
  },
  data() {
    return {
      showDetails: false
    };
  }
};
</script>
