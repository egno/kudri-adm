<template>
  <VToolbar app>
    <VLayout
      row
      align-center
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
          key="mainButton"
          color="primary"
          :href="href"
          :target="target"
          @click="onDefaultAction"
        >
          {{ defaultAction.label }}
        </VBtn>
      </VFlex>
      <VFlex>
        <VTextField
          key="mainSearch"
          v-model="searchString"
          autofocus
          clearable
          label="Поиск"
          single-line
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
      if (!(this.actions && Array.isArray(this.actions))) {
        return;
      }
      return this.actions.filter(x => x['default'])[0];
    },
    href() {
      if (this.defaultAction) {
        return this.defaultAction.href;
      }
      return null;
    },
    routePath() {
      return this.$route.path;
    },
    target() {
      if (this.defaultAction) {
        return this.defaultAction.target;
      }
      return null;
    }
  },
  watch: {
    searchString: 'setStoreSearchString',
    routePath: 'setActions'
  },
  mounted() {
    this.setStoreSearchString();
  },
  methods: {
    ...mapActions(['navBar', 'setActions', 'setSearchString']),
    goHome() {
      router.push({ name: 'home' });
    },
    onDefaultAction() {
      this.$emit('onAction', this.defaultAction.action);
    },
    setStoreSearchString() {
      this.setSearchString(this.searchString);
    }
  }
};
</script>
