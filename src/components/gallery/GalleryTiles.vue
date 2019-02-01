<template>
  <v-card>
    <v-container
      grid-list-sm
      fluid
      align-content-space-between
      fill-height
      pa-2
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(image, n) in currentImages"
          :key="n"
          xs4
        >
          <v-card
            flat
            tile
            class="d-flex"
          >
            <v-img :src="image">
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
            </v-img>
          </v-card>
        </v-flex>
        <v-flex
          v-if="more"
          xs4
        >
          <v-btn
            block
            depressed
            large
            @click="full=true"
          >
            Ещё {{ images.length - currentImages.length }}
          </v-btn>
        </v-flex>
        <v-flex
          v-if="addPlace"
          xs4
        >
          <v-btn
            block
            depressed
            large
            icon
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    edit: { type: Boolean, default: false },
    images: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      full: false,
      index: 0,
      maxImages: 9
    };
  },
  computed: {
    currentImages() {
      if (!this.full) {
        return this.images.slice(
          0,
          this.maxImages -
            (this.edit || this.images.length !== this.maxImages ? 1 : 0)
        );
      }
      return this.images;
    },
    more() {
      return this.images.length > this.currentImages.length;
    },
    addPlace() {
      return this.edit && !this.more;
    }
  }
};
</script>
