<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <gallery-card />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GalleryCard from '@/components/gallery/GalleryCard.vue';

export default {
  components: { GalleryCard },
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
