<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card>
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
          <v-btn color="primary" @click="post">Войти</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    drawer: null,
    flogin: "manager1@test.com",
    fpassword: "ManagerPassword"
  }),
  props: {
    source: String
  },
  methods: {
    ...mapActions(["login"]),
    post() {
      this.login({ email: this.flogin, pass: this.fpassword });
    }
  }
};
</script>
