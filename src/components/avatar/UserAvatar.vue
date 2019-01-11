<template>
  <VAvatar
    class="ma-1"
    :size="size"
    :color="color.bg"
    :tile="tile"
  >
    <img
      v-if="image_exists"
      :src="imagePath"
      alt
    >
    <div
      v-else
      :class="`avatar-letters font-weight-bold ${color.bg}--text text--${color.text}-4`"
    >
      {{ initials }}
    </div>
  </VAvatar>
</template>  

<script>
import { hash } from '@/components/utils';

export default {
  props: {
    size: { type: String, default: '3em' },
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    tile: { type: Boolean, default: false }
  },
  data() {
    return {
      grayScaleColors: { bg: 'grey', text: 'lighten' },
      colors: [
        { bg: 'red', text: 'lighten' },
        { bg: 'pink', text: 'lighten' },
        { bg: 'purple', text: 'lighten' },
        { bg: 'deep-purple', text: 'lighten' },
        { bg: 'indigo', text: 'lighten' },
        { bg: 'blue', text: 'lighten' },
        { bg: 'light-blue', text: 'darken' },
        { bg: 'cyan', text: 'darken' },
        { bg: 'teal', text: 'lighten' },
        { bg: 'green', text: 'lighten' },
        { bg: 'light-green', text: 'darken' },
        { bg: 'lime', text: 'darken' },
        { bg: 'yellow', text: 'darken' },
        { bg: 'amber', text: 'darken' },
        { bg: 'orange', text: 'darken' },
        { bg: 'deep-orange', text: 'lighten' }
      ],
      image_exists: false
    };
  },
  computed: {
    color() {
      if (!this.name) {
        return this.grayScaleColors;
      }

      let h =
        ((hash(this.name) % this.colors.length) + this.colors.length) %
        this.colors.length;

      return this.colors[h];
    },
    initials() {
      const splitChars = /[-_.@ ]/;
      if (!this.name) {
        return;
      }
      return this.name
        .split(splitChars)
        .filter(x => x)
        .slice(0, 2)
        .map(x => x[0].toUpperCase())
        .join('');
    },
    imagePath() {
      if (this.src) {
        return `${process.env.VUE_APP_IMAGES || ''}${this.src}`;
      }
      return '';
    }
  },
  watch: {
    src(value) {
      this.image_exists = false;
      this.$nextTick(function() {
        if (value) this.loadImage();
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      if (this.src) this.loadImage();
    });
  },
  methods: {
    loadImage() {
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          this.loaded_src = this.src;
          this.image_exists = true;
        };
        img.src = this.imagePath;
      }, this.delay);
    }
  }
};
</script>

<style>
</style>
