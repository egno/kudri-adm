<template>
  <VCard>
    <VContainer justify-center>
      <VLayout
        align-center
        justify-space-around
        row
      >
        <VFlex justify-center>
          <VueAvatar
            ref="vueavatar"
            :width="width"
            :height="height"
            :rotation="rotation"
            :border-radius="borderRadius"
            :border="border"
            :color="color"
            :scale="+scale"
            @vue-avatar-editor:image-ready="onImageReady"
            @select-file="onSelectFile($event)"
          />
        </VFlex>
        <VFlex>
          <VLayout
            column
            fill-height
          >
            <VFlex>
              <input
                v-model="scale"
                type="range"
                min="1"
                max="3"
                step="0.02"
              >
              <br>
              <label v-if="hasRotation">
                Rotation : {{ rotation }}°
                         <br>
                         <input
                           v-model="rotation"
                           type="range"
                           min="0"
                           max="360"
                           step="1"
                         >
              </label>
            </VFlex>
          </VLayout>
        </VFlex>
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
import VueAvatar from './VueAvatar.vue';

export default {
  components: {
    VueAvatar
  },
  props: {
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
  data() {
    return {
      rotation: 0,
      scale: 1
    };
  },
  methods: {
    onSelectFile(files) {
      this.$emit('select-file', files);
    },
    onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },
    finished() {
      return this.$emit('finished', this.$refs.vueavatar.getImageScaled());
    }
  }
};
</script>
