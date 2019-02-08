<template>
  <div class="text-xs-center">
    <v-navigation-drawer
      v-model="drawer"
      class="drawer"
      absolute
      temporary
      right
      width="440"
      @input="v => v || closeProfileDrawer()"
    >
      <UserProfile @close="closeProfileDrawer" />
    </v-navigation-drawer>
  </div>
</template>

<script>
import UserProfile from '@/components/user/UserProfile.vue';
import { mapActions } from 'vuex';

export default {
  components: { UserProfile },
  props: {
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      drawer: false
    };
  },
  watch: {
    show: 'setDrawer'
  },
  methods: {
    ...mapActions(['closeProfileDrawer']),
    setDrawer(val) {
      this.drawer = !!val;
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer {
  padding: 53px 80px;
}
</style>
