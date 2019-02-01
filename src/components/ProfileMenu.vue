<template>
  <VMenu
    v-model="menu"
    left
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
            v-if="loggedIn"
            class="ma-1"
            :name="displayName"
            :src="avatar"
          />
        </VFlex>
        <VFlex
          v-if="!loggedIn"
          class="hidden-sm-and-down"
        >
          {{ "Войти" }}
        </VFlex>
        <div
          v-else
          style="width: 24px; height: 24px"
        >
          <v-icon>expand_more</v-icon>
        </div>
      </VLayout>
    </VBtn>
    <VList>
      <template v-if="loggedIn">
        <VListTile
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.route"
          @click="menuHandler(item.action)"
        >
          <VListTileTitle>{{ item.title }}</VListTileTitle>
        </VListTile>
      </template>
      <template v-else>
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
          <VBtn
            color="primary"
            @click="sendLogin"
          >
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
    drawer: null,
    errorMessage: null,
    flogin: 'manager000000050@test.com',
    fpassword: '000000050',
    menu: false,
    snack: false,
    snackText: '',
    snackColor: 'error',
    menuList: [
      {
        title: 'Мой профиль'
      },
      {
        title: 'Сообщения',
        route: { name: 'messages' }
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
    }
  },
  methods: {
    ...mapActions(['login', 'logout']),
    menuHandler(action) {
      this.menu = false;
      switch (action) {
        case 'logout':
          this.sendLogout();
          break;
        default:
      }
    },
    sendLogin() {
      this.login({ login: this.flogin, pass: this.fpassword });
      this.menu = false;
    },
    sendLogout() {
      this.logout();
      router.push({ name: 'home' });
      this.menu = false;
    }
  }
};
</script>
