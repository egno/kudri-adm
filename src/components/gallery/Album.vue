<template>
  <div>
    <v-card
      :hover="!!to"
      @click="$router.push(to)"
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
          :height="height"
          :aspect-ratio="aspectRatio"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    aspectRatio: { type: String, default: '1' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    height: { type: String, default: undefined },
    images: { type: Array, default: undefined },
    to: { type: Object, default: undefined },
    service: { type: String, default: undefined },
    employee: { type: String, default: undefined },
    placeholder: {
      type: String,
      default:
        'https://i1.wp.com/makeupandbeautyhome.com/wp-content/uploads/2013/10/Kiwi-and-Cream-Dry-Skin-Facial.jpg'
    }
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
        this.placeholder
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
