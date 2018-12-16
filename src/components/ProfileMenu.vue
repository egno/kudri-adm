<template>
  <VMenu
    v-model="menu"
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
          <VAvatar
            v-if="loggedIn"
            class="ma-1"
            color="teal"
            :size="36"
          >
            <!-- <span class="white--text">MT</span> -->
            <img
              src="/images/01.png"
              alt="avatar"
            >
          </VAvatar>
        </VFlex>
        <VFlex>{{ userID || "Войти" }}</VFlex>
      </VLayout>
    </VBtn>
    <VList>
      <VCard v-if="loggedIn">
        <VCardTitle primary-title>
          <div>
            <h3 class="headline mb-0">
              Выйти из личного кабинета?
            </h3>
            <div>
              Сейчас вы авторизованы как
              <span class="font-weight-medium">
                {{ userID }}
              </span>
            </div>
          </div>
        </VCardTitle>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="sendLogout"
          >
            Выйти
          </VBtn>
        </VCardActions>
      </VCard>
      <VCard v-else>
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
      </VCard>
    </VList>
  </VMenu>
</template>

<script>
import router from "@/router";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    source: {type: String, default: () => ""}
  },
  data: () => ({
    drawer: null,
    errorMessage: null,
    flogin: "manager1@test.com",
    fpassword: "ManagerPassword",
    menu: false,
    snack: false,
    snackText: "",
    snackColor: "error"
  }),
  computed: {
    ...mapGetters(["loggedIn", "userID"])
  },
  methods: {
    ...mapActions(["login", "logout"]),
    sendLogin () {
      this.login({ email: this.flogin, pass: this.fpassword });
      this.menu = false;
    },
    sendLogout () {
      this.logout();
      router.push({ name: "home" });
      this.menu = false;
    }
  }
};
</script>
