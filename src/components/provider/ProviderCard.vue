<template>
  <v-card
    :hover="true"
    class="text-xs-center"
    flat
    ripple
    @click="$emit('click')"
  >
    <v-card-text>{{ provider.name }}</v-card-text>
    <v-responsive>
      <v-img
        class="ma-2"
        :src="logo(provider)"
        :alt="provider.name"
      />
    </v-responsive>
  </v-card>
</template>

<script>
import {logo} from '@/components/provider/utils'

export default {
  props: {
    provider: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    logo (provider) {
      return logo(provider)
    }
  }
}
</script>

