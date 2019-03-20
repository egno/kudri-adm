<template>
  <VAvatar
    class="ma-1"
    :size="size"
    :color="color.bg"
    :tile="tile"
    :class="{ [avatarClass]: avatarClass }"
    @mouseover="tooltip = true"
    @mouseout="tooltip = false"
    @mousemove="move"
  >
    <v-tooltip
      v-if="isEditing"
      v-model="tooltip"
      right
      :position-x="x"
      :position-y="y"
    >
      <span class="text-primary">
        Это главное фото вашей компании.
      </span> <br>
      <span class="text-secondary">
        Может быть логотип или любое <br> другое привлекательное фото <br> компании
      </span>
    </v-tooltip>
    <!-- todo <span
      v-if="isEditing"
      class="load-text"
    >
      Загрузить фотографию
    </span>-->
  
  
    <div
      v-if="newMessage"
      class="new-message"
    />
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
import { hash } from '@/components/utils'
import { imagePath } from '@/components/avatar/utils'

export default {
  props: {
    newMessage: { type: Boolean, default: false },
    size: { type: String, default: '3em' },
    isEditing: { type: Boolean, default: false },
    avatarClass: { type: String, default: '' },
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    tile: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    validError: { type: Boolean, default: false }
  },
  data () {
    return {
      user: require('@/assets/user.svg'),
      userError: require('@/assets/user-error.svg'),
      grayScaleColors: { bg: 'grey', text: 'lighten' },
      tooltip: false,
      x: 0,
      y: 0,
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
    }
  },
  computed: {
    color () {
      if (!this.name) {
        return this.grayScaleColors
      }

      let h =
        ((hash(this.name) % this.colors.length) + this.colors.length) %
        this.colors.length

      return this.colors[h]
    },
    initials () {
      const splitChars = /[-_.@ ]/
      if (!this.name) {
        return
      }
      if (this.name[0] === '7' && this.name.length === 11) {
        return this.name.slice(-2)
      }
      return this.name
        .split(splitChars)
        .filter(x => x)
        .slice(0, 2)
        .map(x => x[0].toUpperCase())
        .join('')
    },
    imagePath () {
      return imagePath(this.src) || this.user
    },
    valid_error () {
      return !this.src
    }
  },
  watch: {
    src (value) {
      this.image_exists = false
      this.$nextTick(function () {
        if (value) this.loadImage()
      })
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.src) this.loadImage()
    })
  },
  methods: {
    move (e) {
      if (!this.tooltip) return
      this.x = e.x + 20
      this.y = e.y + 80
    },
    loadImage () {
      setTimeout(() => {
        const img = new Image()
        img.onload = () => {
          this.loaded_src = this.src
          this.image_exists = true
        }
        img.src = this.imagePath
      }, this.delay)
    }
  }
}
</script>


<style lang="scss">
  @import '../../assets/styles/common';

  .v-avatar {
    margin: 0 !important;
    .new-message {
      position: absolute;
      width: 8px;
      height: 8px;
      border: 1px solid #fff;
      background: #ef4d37;
      border-radius: 16px;
      top: 0;
      left: 0;
    }
    .load-text {
      position: absolute;
      z-index: 1;
      top: 114px;
      font-family: Roboto-Slab;
      font-size: 13px;
      color: rgba(137, 149, 175, 0.5);
    }
    img {
      background: #fff;
      position: relative;
      z-index: 2;
    }
    &.square {
      margin-bottom: 20px;
      width: 312px!important;
      height: 184px!important;
      background: url('../../assets/phot.svg') no-repeat top 57px center;
      background-size: 40px;
      background-color: rgba(137, 149, 175, 0.1)!important;
      border-radius: 0;
      img {
        border-radius: 0;
      }
    }
  }
  .business-avatar {
    width: 140px;
    @media only screen and (min-width : $desktop) {
      width: 170px;
    }
  }
</style>
