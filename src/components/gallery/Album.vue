<template>
  <div>
    <v-card
      v-if="!!(images && images.length)"
      :hover="!!to"
    >
      <v-card-title @click="$router.push(to)">
        <v-layout row>
          <v-flex>{{ subtitle }}</v-flex>
          <v-flex>{{ title }}</v-flex>
        </v-layout>
      </v-card-title>
      <v-responsive @click="showSlider(images)">
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
    <gallery-card
      v-else
      :images="images"
      :title="title"
      :subtitle="subtitle"
      :service="service"
      :employee="employee"
    />
  </div>
</template>

<script>
import GalleryCard from '@/components/gallery/GalleryCard.vue';
import { mapGetters } from 'vuex';

export default {
  components: { GalleryCard },
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    images: { type: Array, default: undefined },
    to: { type: Object, default: undefined },
    service: { type: String, default: undefined },
    employee: { type: String, default: undefined }
  },
  computed: {
    ...mapGetters(['business']),
    selected() {
      return (
        this.images &&
        this.images.length &&
        (Math.random() * this.images.length) | 0
      );
    },
    image() {
      return (
        (this.images &&
          this.images.length &&
          this.images[this.selected] &&
          `${process.env.VUE_APP_IMAGES}${this.business}/${
            this.images[this.selected].id
          }`) ||
        'https://i1.wp.com/makeupandbeautyhome.com/wp-content/uploads/2013/10/Kiwi-and-Cream-Dry-Skin-Facial.jpg'
      );
    }
  },
  methods: {
    showSlider(images) {
      this.$emit('showSlider', {
        selected: this.selected,
        images,
        title: this.title,
        subtitle: this.subtitle
      });
    }
  }
};
</script>
