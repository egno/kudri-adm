<template>
  <VBtn
    v-if="profile"
    flat
    small
    :href="link"
    target="_blank"
  >
    <VIcon>fab {{ icon }}</VIcon>
  </VBtn>
</template>

<script>
export default {
  props: {
    social: { type: Object, default: null },
    profile: { type: String, default: null }
  },
  computed: {
    link () {
      if (!this.social) return
      return this.social.href(this.profile)
    },
    icon () {
      if (!this.social) return
      return this.social.icon
    }
  }
}
</script>
