<template>
  <Gallery />
</template>

<script>
import Gallery from '@/components/Gallery.vue';

export default {
  components: { Gallery },
  data() {
    return {
      data: { data: {} }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  }
};
</script>
