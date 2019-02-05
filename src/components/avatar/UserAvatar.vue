<template>
  <VAvatar
    class="ma-1"
    :size="size"
    :color="color.bg"
    :tile="tile"
  >
    <template v-if="required">
      <img
        v-if="!valid_error"
        :src="imagePath"
        alt
      >      
      <img
        v-else
        :src="userError"
        alt
      >      
    </template>
    
    <template v-else>
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
    </template>
  </VAvatar>
</template>  

<script>
import { hash } from '@/components/utils';

export default {
  props: {
    size: { type: String, default: '3em' },
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    tile: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    validError: { type: Boolean, default: false },
  },
  data() {
    return {
      user: require('@/assets/user.svg'),
      userError: require('@/assets/user-error.svg'),
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
      if (this.src !== '' && this.src !== null && !this.valid_error) {
        return `${process.env.VUE_APP_IMAGES || ''}${this.src}`;
      } else {
        return this.user
      }
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

<style lang="scss" scoped>
  .v-avatar {
    margin: 0!important;
    img {
      background: #fff;
    }
  }
</style>
