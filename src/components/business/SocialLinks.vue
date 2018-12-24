<template>
  <VBtnToggle>
    <SocialLink
      v-for="(value, key) in links"
      :key="key"
      :social="socials[key]"
      :profile="value"
    />
  </VBtnToggle>
</template>

<script>
import SocialLink from '@/components/business/SocialLink.vue';

export default {
  components: {
    SocialLink
  },
  props: {
    links: { type: Object, default: null }
  },
  data() {
    return {
      socials: {
        vk: {
          href: x => `https://vk.com/users/${x}`,
          icon: 'fa-vk'
        },
        instagram: {
          href: x => `https://www.instagram.com/${x}`,
          icon: 'fa-instagram'
        }
      }
    };
  }
};
</script>
