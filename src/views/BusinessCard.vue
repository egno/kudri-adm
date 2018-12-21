<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <Card :id="id" />
  </VContainer>
</template>

<script>
import BusinessCard from '@/components/business/BusinessCard.vue';

export default {
  components: { Card: BusinessCard },
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
