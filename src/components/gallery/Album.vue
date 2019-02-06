<template>
  <v-card
    :to="to"
    hover
  >
    <v-card-title>
      <v-layout row>
        <v-flex>{{ subtitle }}</v-flex>
        <v-flex>{{ title }}</v-flex>
      </v-layout>
    </v-card-title>
    <v-responsive>
      <v-img
        :src="image"
        height="10em"
      />
      <v-layout
        slot="placeholder"
        fill-height
        align-center
        justify-center
        ma-0
      >
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        />
      </v-layout>
    </v-responsive>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    images: { type: Array, default: undefined },
    to: { type: Object, default: undefined }
  },
  computed: {
    ...mapGetters(['business']),
    image() {
      return (
        (this.images &&
          this.images.length &&
          this.images[(Math.random() * this.images.length) | 0] &&
          `${process.env.VUE_APP_IMAGES}${this.business}/${
            this.images[(Math.random() * this.images.length) | 0].id
          }`) ||
        'https://i1.wp.com/makeupandbeautyhome.com/wp-content/uploads/2013/10/Kiwi-and-Cream-Dry-Skin-Facial.jpg'
      );
    }
  }
};
</script>
