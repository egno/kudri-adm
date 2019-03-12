<template>
  <v-card hover>
    <v-card-actions v-if="editMode">
      <v-spacer />
      <v-btn
        flat
        icon
        @click="deleteImage()"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
    <v-img :src="src">
      <v-container
        fill-height
        fluid
        py-0
        px-2
      >
        <v-layout fill-height>
          <v-flex
            xs12
            align-end
            flexbox
          >
            <v-layout
              align-start
              justify-space-between
              column
              fill-height
            >
              <v-flex>
                <div class="pic-title">
                  {{ title }}
                </div>
              </v-flex>
              <v-spacer />
              <v-flex shrink>
                <div class="pic-title">
                  {{ subtitle }}
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: {
    editMode: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    src: { type: String, default: undefined }
  },
  methods: {
    deleteImage () {
      this.$emit('deleteImage')
    }
  }
}
</script>

<style scoped>
.pic-title {
  font-size: 0.7em;
  color: #fff;
  text-shadow: 0 0 0.3em #000;
}
</style>
