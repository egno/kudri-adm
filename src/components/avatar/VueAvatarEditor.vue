<template>
  <VCard>
    <VContainer justify-center>
      <VLayout
        align-center
        justify-space-around
        row
      >
        <VLayout
          align-center
          justify-space-around
          column
        >
          <VFlex
            justify-center
            pb-3
          >
            <VueAvatar
              ref="vueavatar"
              :width="width"
              :height="height"
              :rotation="rotation"
              :border-radius="borderRadius"
              :border="border"
              :color="color"
              :scale="+scale"
              :background="background"
              @vue-avatar-editor:image-ready="onImageReady"
              @select-file="onSelectFile($event)"
            />
          </VFlex>
          <VFlex>
            <VLayout
              column
              fill-height
            >
              <VFlex v-if="scale">
                <input
                  v-model="scale"
                  type="range"
                  min="1"
                  max="3"
                  step="0.02"
                >
                <br>
                <input
                  v-model="rotation"
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                >
              </VFlex>
            </VLayout>
          </VFlex>
        </VLayout>
      </VLayout>
    </VContainer>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="finished"
      >
        Сохранить
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script>
import VueAvatar from './VueAvatar.vue'

export default {
  components: {
    VueAvatar
  },
  props: {
    avatar: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    },
    finishText: {
      type: String,
      default: 'Save'
    },
    hasRotation: {
      type: Boolean,
      default: false
    },
    hasScale: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      default: ''
    },
    border: {
      type: Number,
      default: 25
    },
    borderRadius: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    color: {
      type: Array,
      default: () => [0, 0, 0, 0.5]
    }
  },
  data () {
    return {
      rotation: 0,
      scale: 0
    }
  },
  methods: {
    onSelectFile (files) {
      this.$emit('select-file', files)
    },
    onImageReady () {
      this.scale = 1
      this.rotation = 0
    },
    finished () {
      return this.$emit('finished', this.$refs.vueavatar.getImageScaled())
    }
  }
}
</script>
