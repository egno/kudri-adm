<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <BusinessCard :id="id" />
  </VContainer>
</template>

<script>
import BusinessCard from '@/components/business/BusinessCard.vue';

export default {
  components: { BusinessCard: BusinessCard },
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
