<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VFlex
      xs4
      offset-xs4
    >
      <ManagerProfile />
    </VFlex>
  </VContainer>
</template>

<script>
import ManagerProfile from '@/components/manager/ManagerProfile.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    ManagerProfile: ManagerProfile,
  },
  data() {
    return {
      data: null,
    };
  },
  computed: {

  },
  watch: {

  },
  mounted() {
  
  },
  methods: {
    ...mapActions(['setActions']),
  }
};
</script>
