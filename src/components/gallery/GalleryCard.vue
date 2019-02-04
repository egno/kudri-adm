<template>
  <v-layout
    row
    align-center
  >
    <v-flex>
      <v-card max-width="30em">
        <v-card-title>Компания</v-card-title>
        <v-responsive>
          <gallery-tiles
            service="SPA"
            edit
          />
        </v-responsive>
      </v-card>
    </v-flex>
    <v-flex>
      <v-card max-width="30em">
        <v-card-title>Сотрудники</v-card-title>
        <v-responsive>
          <gallery-tiles
            :images="images"
            edit
          />
        </v-responsive>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import GalleryTiles from '@/components/gallery/GalleryTiles.vue';
export default {
  components: { GalleryTiles },
  data() {
    return {
      images: [
        'https://placekitten.com/801/800',
        'https://placekitten.com/802/800',
        'https://placekitten.com/803/800',
        'https://placekitten.com/804/800',
        'https://placekitten.com/820/800'
      ]
    };
  }
};
</script>
