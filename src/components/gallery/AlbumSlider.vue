<template>
  <v-dialog v-model="show">
    <v-card
      v-if="images"
      class="grey--text"
    >
      <v-card-actions>
        <v-layout column>
          <v-flex class="title">
            {{ title }}
          </v-flex>
          <v-flex>{{ subtitle }}</v-flex>
        </v-layout>
        <v-spacer />
        <v-card-title>{{ selected+1 }}/{{ images.length }}</v-card-title>
        <v-btn
          flat
          icon
          color="grey"
          @click="show=false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-actions>
      <v-responsive class="grey">
        <v-layout
          v-if="images && images.length > 1"
          row
        >
          <v-flex
            d-flex
            xs11
          >
            <v-carousel
              hide-controls
              hide-delimiters
              flat
            >
              <v-carousel-item :src="imagePath(images[selected])" />
            </v-carousel>
          </v-flex>
          <v-flex xs1>
            <v-layout
              column
              ma-1
            >
              <v-flex v-if="sliderCanScroll">
                <v-btn
                  small
                  flat
                  block
                  class="white--text"
                  @click="selected=(selected + images.length - 1) % images.length"
                >
                  <v-icon>keyboard_arrow_up</v-icon>
                </v-btn>
              </v-flex>
              <v-flex
                v-for="(image) in sliderImages"
                :key="'image'+image.n"
                ma-0
                :class="[selected===image.n ? 'selected':'', 'slider-image']"
                @click="selected=image.n"
              >
                <v-img
                  :src="imagePath(image)"
                  aspect-ratio="1"
                />
              </v-flex>
              <v-flex v-if="sliderCanScroll">
                <v-btn
                  small
                  flat
                  block
                  class="white--text"
                  @click="selected=(selected + 1) % images.length"
                >
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-img
          v-else
          :src="imagePath(images[0])"
        />
      </v-responsive>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    display: { type: Boolean, default: false },
    images: { type: Array, default: undefined },
    select: { type: Number, default: 0 },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
  },
  data() {
    return {
      sliderCount: 4,
      show: false,
      selected: 0
    };
  },
  computed: {
    sliderCanScroll() {
      return this.images && this.images.length > this.sliderCount;
    },
    sliderImages() {
      if (!this.images) return;
      const cnt = this.images.length;
      let images = this.images.map((x, n) => {
        x.n = n;
        return x;
      });
      if (cnt <= this.sliderCount) return images;
      const pos = ((this.sliderCount - 1) / 2) | 0;
      let start = this.selected - pos;
      let end = start + this.sliderCount;
      let result = [];
      if (start < 0) {
        result = [...result, ...images.slice(start)];
      }
      result = [
        ...result,
        ...images.slice(Math.max(start, 0), Math.min(end, cnt))
      ];
      if (end > cnt) {
        result = [...result, ...images.slice(0, end - cnt)];
      }
      return result;
    }
  },
  watch: {
    display: 'load',
    show(newVal) {
      if (!newVal) {
        this.$emit('close');
      }
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    imagePath(image) {
      return (
        image && `${process.env.VUE_APP_IMAGES}${image.business_id}/${image.id}`
      );
    },
    initProps() {
      this.show = this.display;
      this.selected = this.select;
    },
    load() {
      this.initProps();
      if (!this.show) return;
    }
  }
};
</script>

<style scoped>
.slider-image {
  border: medium solid;
  border-radius: 2px;
  transition: all 0.5s;
}
.selected {
  border-color: #eee;
}
</style>

