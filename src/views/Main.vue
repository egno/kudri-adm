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

      const this_ = this

      Api()
        .get(`my_business`)
        .then(res => res.data)
        .then(res => {
          this_.businessCount = res.length

          if (this_.userRole === 'manager' || this_.userRole === 'admin') {
            this_.$router.push({
              name: 'myBusinessList'
            })
            return
          }

          const company = res.find(business => business.type === 'C')
          const filial = res.find(business => !!business.parent)

          // if user has access to 1 company with no branches
          if (this_.businessCount === 1 && res[0].id && !company && !filial) {
            this_.$router.push({
              name: 'businessCard',
              params: { id: res[0].id }
            })
            return
          }

          // if user has no access to a company
          if (!company && filial && filial.id) {
            this_.$router.push({
              name: 'filialList',
              params: { id: filial.parent }
            })
            return
          }

          // if user has access to a company
          if (company) {
            this_.$router.push({
              name: 'businessCard',
              params: { id: company.id }
            })
            return
          }
        })
    }
  }
}
</script>
