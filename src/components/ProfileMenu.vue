<template>
  <v-menu :close-on-content-click="false" v-model="menu">
    <v-btn flat slot="activator">
      <v-avatar v-if="loggedIn" color="teal">
        <span class="white--text">MT</span>
      </v-avatar>
      <v-flex>{{userID || "Войти"}}</v-flex>
    </v-btn>
    <v-list>
      <v-card v-if="loggedIn">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Выйти из личного кабинета?</h3>
            <div>
              Сейчас вы авторизованы как
              <span class="font-weight-medium">{{userID}}</span>
            </div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="sendLogout">Выйти</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="flogin"
              prepend-icon="person"
              name="email"
              label="e-mail"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="fpassword"
              id="password"
              prepend-icon="lock"
              name="password"
              label="Пароль"
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="sendLogin">Войти</v-btn>
        </v-card-actions>
      </v-card>
    </v-list>
  </v-menu>
</template>

<script>
import router from "@/router";
import { mapGetters, mapActions } from "vuex";

export default {
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
  props: {
    source: String
  },
  computed: {
    ...mapGetters(["loggedIn", "userID"])
  },
  methods: {
    ...mapActions(["login", "logout"]),
    sendLogin() {
      this.login({ email: this.flogin, pass: this.fpassword });
      this.menu = false;
    },
    sendLogout() {
      this.logout();
      router.push({ name: "home" });
      this.menu = false;
    }
  }
};
</script>
