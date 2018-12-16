<template>
  <VAvatar
    class="ma-1"
    :size="size"
    :color="color"
  >
    <img
      v-if="image_exists"
      :src="src"
      alt
    >
    <div v-else>
      {{ initials }}
    </div>
  </VAvatar>
</template>  

<script>
export default {
  props: {
    size: { type: String, default: '3em' },
    email: { type: String, default: '' },
    src: { type: String, default: '' }
  },
  data() {
    return {
      image_exists: false
    };
  },
  computed: {
    color() {
      const defColor = 'light-grey';
      const maxHue = 360;
      const colorCount = 12;

      function hash(s) {
        return s.split('').reduce(function(a, b) {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0);
      }

      if (!this.email) {
        return defColor;
      }
      let h = ((hash(this.email) % colorCount) * maxHue) / colorCount;

      return `hsl(${h}, 100%, 50%)`;
    },
    initials() {
      const splitChars = /[-_.@ ]/;
      if (!this.email) {
        return;
      }
      return this.email
        .split(splitChars)
        .slice(0, 2)
        .map(x => x[0].toUpperCase())
        .join('');
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
        img.src = this.src;
      }, this.delay);
    }
  }
};
</script>

