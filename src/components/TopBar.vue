<template>
  <VToolbar app>
    <VLayout
      row
      align-center
      fill-height
      justify-start
    >
      <VFlex v-if="!navBarVisible">
        <VLayout
          row
          align-center
        >
          <VToolbarSideIcon @click="navBar()" />
          <VToolbarTitle @click="goHome()">
            {{ appTitle }}
          </VToolbarTitle>
        </VLayout>
      </VFlex>

      <VFlex>
        <VBtn
          v-if="defaultAction"
          color="primary"
        >
          {{ defaultAction.label }}
        </VBtn>
      </VFlex>
      <VFlex>
        <VTextField
          v-model="searchString"
          box
          clearable
          label="Поиск"
          type="text"
        />
      </VFlex>
    </VLayout>

    <VSpacer />
    <VToolbarItems>
      <ProfileMenu />
    </VToolbarItems>
  </VToolbar>
</template>

<script>
import ProfileMenu from '@/components/ProfileMenu.vue';
import router from '@/router';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    ProfileMenu
  },
  data() {
    return {
      searchString: ''
    };
  },
  computed: {
    ...mapGetters(['actions', 'appTitle', 'navBarVisible', 'userID']),
    defaultAction() {
      if (!this.actions) {
        return;
      }
      return this.actions.filter(x => x['default'])[0];
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
  },
  mounted() {
    this.setStoreSearchString();
  },
  methods: {
    ...mapActions(['navBar', 'setSearchString']),
    goHome() {
      router.push({ name: 'home' });
    },
    setStoreSearchString() {
      this.setSearchString(this.searchString);
    }
  }
};
</script>
