<template>
  <div class="about">
    <RegisterForm />
  </div>
</template>


<script>
import RegisterForm from '@/components/register/Register.vue'
import { mapActions } from 'vuex'

export default {
  components: { RegisterForm },
  data () {
    return {}
  },
  computed: {},
  mounted () {
    this.setActions(null)
    this.logout()
  },
  methods: {
    ...mapActions(['setActions','logout'])
  }
}
</script>