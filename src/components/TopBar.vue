<template>
  <VToolbar
    class="topbar"
    app
    height="55px"
  >
    <v-toolbar-side-icon
      v-if="!navigationVisible"
      @click="setNavigationVisible(true)"
    />
    <VLayout
      v-if="!$route.path.includes('gallery')"
      row
      align-center
      justify-start
    >
      <VFlex
        v-if="businessId"
        flex
        row
        align-center
        justify-start
        display-4
        hidden-xs-only
      >
        {{ businessInfo.category }} {{ businessInfo.name }}
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

      <VFlex v-if="isManagerCabinet">
        <VTextField
          key="mainSearch"
          v-model="searchString"
          class="topsearch"
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
      <!--<Notifications />-->
      <ProfileMenu />
    </VToolbarItems>
  </VToolbar>
</template>

<script>
import ProfileMenu from '@/components/ProfileMenu.vue'
import router from '@/router'
import { mapActions, mapGetters } from 'vuex'
import { isBusinessRoute } from '@/utils'

export default {
  components: {
    ProfileMenu,
  },
  data () {
    return {
      searchString: '',
      selectedEmployee: null,
      name: 'Salon name',
      type: 'salon',
      logo:
        'http://files.softicons.com/download/internet-icons/adorable-twitter-icons-by-naldz-graphics/png/128/cute_twitter1.png'
    }
  },
  computed: {
    ...mapGetters([
      'actions',
      'businessId',
      'businessInfo',
      'employees',
      'navigationVisible',
      'userID'
    ]),
    defaultAction () {
      if (!(this.actions && Array.isArray(this.actions))) {
        return
      }
      return this.actions.filter(x => x['default'])[0]
    },
    employeeList () {
      return this.employees.map(x => {
        return { id: x.id, name: x.j.name || '<имя не указано>' }
      })
    },
    href () {
      if (this.defaultAction) {
        return this.defaultAction.href
      }
      return null
    },
    isBusinessCard () {
      return isBusinessRoute(this.$route.name)
    },
    isManagerCabinet () {
      return !this.isBusinessCard
    },
    routePath () {
      return this.$route.path
    },
    showEmployee () {
      const list = ['businessVisit']
      return list.some(x => x === this.$route.name) && this.employees.length
    },
    target () {
      if (this.defaultAction) {
        return this.defaultAction.target
      }
      return null
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
  },
  mounted () {
    this.setStoreSearchString()
  },
  methods: {
    ...mapActions([
      'navBar',
      'setActions',
      'setNavigationVisible',
      'setSearchString'
    ]),
    goHome () {
      router.push({ name: 'home' })
    },
    onDefaultAction () {
      this.$emit('onAction', this.defaultAction.action)
    },
    onSelectEmployee () {
      this.$root.$emit('onSelectEmployee', [this.selectedEmployee])
    },
    setStoreSearchString () {
      this.setSearchString(this.searchString)
    }
  }
}
</script>
<style lang="scss" scoped>
.display-4 {
  display: flex;
  padding-left: 0;
  align-items: center;
}
</style>
