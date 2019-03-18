<template>
  <v-container>
    {{ businessSettings }}
  </v-container>
</template>

<script>
import BusinessSettings from '@/classes/business_settings'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      businessSettings: new BusinessSettings()
    }
  },
  computed: {
    ...mapGetters(['businessId'])
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
      this.load()
  },
  methods: {
    load () {

        if (!this.businessId) return
        this.businessSettings.load(this.businessId)

    }
  }
}
</script>
