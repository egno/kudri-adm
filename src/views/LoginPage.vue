<template>
  <VContainer
    fluid
    fill-height
    justify-center
    class="login-container"
  >
    <div>
      <Login />
      <router-link :to="{ name: 'register'}" class="login-container__no-account">
        Ещё нет аккаунта? Зарегистрировать
      </router-link>
    </div>
  </VContainer>
</template>

<script>
import Login from "../components/Login"

export default {
  components: {
    Login
  }
}
</script>

<style>
  .login-container ._login {
    margin-top: -40px;
  }
  .login-container__no-account {
    text-decoration: none;
  }
  .login-container .login-form {
    margin-bottom: 10px;
  }
</style>
