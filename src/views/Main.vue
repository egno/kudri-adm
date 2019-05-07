<template>
  <div>UNO</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/backend'

export default {
  data () {
    return {
      businessCount: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo','userRole']),
    role () {
      return this.userInfo && this.userInfo.role
    },
    userId () {
      return this.userInfo && this.userInfo.id
    }
  },
  watch: {
    userId: 'loadBusiness'
  },
  mounted () {
    this.loadBusiness()
  },
  methods: {
    loadBusiness () {
      if (!this.userId) return
      Api()
        .get(`my_business`)
        .then(res => res.data)
        .then(res => {
          this.businessCount = res.length
          if (!this.businessCount && this.userRole==='business') {
            this.$router.push({
              name: 'businessCard',
              params: { id: 'new' }
            })
          }
          if (this.businessCount === 1 && res[0].id) {
            this.$router.push({
              name: 'businessCard',
              params: { id: res[0].id }
            })
          }
        })
    }
  }
}
</script>
