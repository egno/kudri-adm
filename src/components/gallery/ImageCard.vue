<template>
  <v-card hover>
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
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    src: { type: String, default: undefined }
  }
};
</script>

<style scoped>
.pic-title {
  font-size: 0.7em;
  color: #fff;
  text-shadow: 0 0 0.3em #000;
}
</style>
