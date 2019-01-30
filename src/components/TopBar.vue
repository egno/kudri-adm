<template>
  <VToolbar app>
    <VLayout
      row
      align-center
      justify-start
    >
      <VFlex
        flex
        row
        align-center
        justify-start
        headline
        class="title"
      >
        {{ businessInfo.name }}, {{ businessInfo.category }}
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

      <VFlex v-if="showEmployee">
        <v-select
          v-model="selectedEmployee"
          clearable
          :items="employeeList"
          item-value="id"
          item-text="name"
          label="Мастер"
          @input="onSelectEmployee"
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
      searchString: '',
      selectedEmployee: null,
      name: 'Salon name',
      type: 'salon',
      logo:
        'http://files.softicons.com/download/internet-icons/adorable-twitter-icons-by-naldz-graphics/png/128/cute_twitter1.png'
    };
  },
  computed: {
    ...mapGetters([
      'actions',
      'businessInfo',
      'employee',
      'navBarVisible',
      'userID'
    ]),
    defaultAction() {
      if (!(this.actions && Array.isArray(this.actions))) {
        return;
      }
      return this.actions.filter(x => x['default'])[0];
    },
    employeeList() {
      return this.employee.map(x => {
        return { id: x.id, name: x.j.name || '<имя не указано>' };
      });
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
    showEmployee() {
      const list = ['businessVisit'];
      return list.some(x => x === this.$route.name) && this.employee.length;
    },
    target() {
      if (this.defaultAction) {
        return this.defaultAction.target;
      }
      return null;
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
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
    onSelectEmployee() {
      this.$root.$emit('onSelectEmployee', [this.selectedEmployee]);
    },
    setStoreSearchString() {
      this.setSearchString(this.searchString);
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  padding-left: 16px;
  align-items: center;
}
</style>