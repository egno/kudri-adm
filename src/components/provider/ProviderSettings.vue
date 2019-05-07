<template>
  <v-layout
    align-left
    column
  >
    <template v-if="currentProvider">
      <v-flex>
        {{ currentProvider.name }}
      </v-flex>
      <v-flex v-if="currentProvider.j && currentProvider.j.site">
        <div class="caption">
          <a :href="currentProvider.j.site">{{ currentProvider.j.site }}</a>
        </div>
      </v-flex>
      <v-flex>
        <ProviderParams
          :values="provider"
          :provider="currentProvider"
        />
      </v-flex>
    </template>
    <v-flex>
      <ProviderList
        :providers="providers"
        @change="setProvider($event)"
      />
    </v-flex>
  </v-layout>
</template>


<script>
import Api from '@/api/backend'
import ProviderParams from '@/components/provider/ProviderParams.vue'
import ProviderList from '@/components/provider/ProviderList.vue'

export default {
    components: { ProviderList, ProviderParams },
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      providers: []
    }
  },
  computed: {
    currentProvider () {
      return (
        this.provider &&
        this.provider.name &&
        this.providers &&
        this.providers.find(
          x => x.name === this.provider.name
        )
      )
    }
  },
  mounted () {
    this.loadProviders()
  },
  methods: {
    loadProviders () {
      Api()
        .get('sms_providers?order=name')
        .then(res => {
          this.providers = res.data
        })
    },
    setProvider (payload) {
      this.provider.name = payload.name
      this.$emit('change', this.provider)
    }
  }
}
</script>
