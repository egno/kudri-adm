<template>
  <VMenu
    v-if="loggedIn"
    v-model="menu"
    left
    full-width
    offset-y
    disable-resize-watcher
    min-width="150"
    max-width="150"
    :close-on-content-click="false"
  >
    <VBtn
      slot="activator"
      flat
    >
      <VLayout
        align-center
        row
        spacer
      >
        <VFlex>
          <UserAvatar
            class="ma-1"
            :name="displayName"
            :src="avatar"
          />
        </VFlex>
        <div style="width: 24px; height: 24px">
          <v-icon>expand_more</v-icon>
        </div>
      </VLayout>
    </VBtn>
    <VList>
      <template>
        <VListTile
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.route"
          @click="menuHandler(item.action)"
        >
          <VListTileTitle>{{ item.title }}</VListTileTitle>
          <span
            v-if="item.count"
            flat
          >
            {{ item.count }}
          </span>
        </VListTile>
      </template>
    </VList>
  </VMenu>
  <VMenu
    v-else
    v-model="menu"
    left
    full-width
    offset-y
    disable-resize-watcher
    min-width="300"
    max-width="300"
    :close-on-content-click="false"
  >
    <VBtn
      slot="activator"
      flat
    >
      <VLayout
        align-center
        row
        spacer
      >
        <VFlex class="hidden-sm-and-down">
          {{ "Войти" }}
        </VFlex>
      </VLayout>
    </VBtn>
    <VList>
      <template>
        <VCardText>
          <VForm>
            <VTextField
              v-model="flogin"
              prepend-icon="person"
              name="email"
              label="e-mail"
              type="text"
            />
            <VTextField
              id="password"
              v-model="fpassword"
              prepend-icon="lock"
              name="password"
              label="Пароль"
              type="password"
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="sendLogin">
            Войти
          </VBtn>
        </VCardActions>
      </template>
    </VList>
  </VMenu>
</template>

<script>
import router from '@/router';
import UserAvatar from '@/components/avatar/UserAvatar.vue';

import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';

export default {
  components: { UserAvatar },
  props: {
    source: { type: String, default: () => '' }
  },
  data: () => ({
    dialog: false,
    errorMessage: null,
    flogin: 'manager000000050@test.com',
    fpassword: '000000050',
    menu: false,
    snack: false,
    snackText: '',
    snackColor: 'error',
    menuList: [
      {
        title: 'Мой профиль',
        action: 'drawer'
      },
      {
        title: 'Сообщения',
        route: { name: 'messages' },
        count: 2
      },
      {
        title: 'Выйти',
        action: 'logout',
        url: ''
      }
    ]
  }),
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn',
      avatar: 'userAvatar',
      userID: 'userLogin',
      userInfo: 'userInfo'
    }),
    menuWidth() {
      return this.loggedIn ? '154' : '300';
    },
    displayName() {
      if (!this.userInfo) return;
      if (this.userInfo.data) {
        if (this.userInfo.data.name) {
          return this.userInfo.data.name;
        }
      }
      return this.userID;
    }
  },
  watch: {
    $route() {
      if (
        this.$route.name === 'businessCard' &&
        _.findIndex(this.menuList, function(o) {
          return o.title === 'Личный кабинет';
        }) === -1
      ) {
        let obj = {
          title: 'Личный кабинет',
          action: '',
          url: '/'
        };
        this.menuList.splice(2, 0, obj);
      } else if (
        _.findIndex(this.menuList, function(o) {
          return o.title === 'Личный кабинет';
        }) !== -1
      ) {
        this.menuList.splice(
          _.findIndex(this.menuList, function(o) {
            return o.title === 'Личный кабинет';
          }),
          1
        );
      }
    },
    userInfo(newVal, oldVal) {
      if (newVal && newVal.role === 'manager' && newVal.role !== oldVal.role) {
        this.$router.push('myBusinessList');
      }
    }
  },
  methods: {
    ...mapActions(['login', 'logout', 'openProfileDrawer']),
    menuHandler(action) {
      this.menu = false;
      switch (action) {
        case 'logout':
          this.sendLogout();
          break;
        case 'drawer':
          this.openDrawer();
          break;
        default:
      }
    },
    sendLogin() {
      this.login({ login: this.flogin, pass: this.fpassword });
      this.menu = false;
    },
    openDrawer() {
      this.openProfileDrawer();
    },
    sendLogout() {
      this.logout();
      router.push({ name: 'home' });
    }
  }
};
</script>
