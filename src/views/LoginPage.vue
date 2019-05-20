<template>
  <VContainer
    fluid
    fill-height
    justify-center
    class="login-container"
  >
    <Login />
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
</style>
