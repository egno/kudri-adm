<template>
  <v-card>
    <v-card-title>
      {{ client.name.forename }}
      {{ client.name.surname }}
    </v-card-title>
    <v-card-text>{{ client.phone }}</v-card-text>
  </v-card>
</template>

<script>
import { newClient } from '@/components/client/utils';
export default {
  props: {
    client: {
      type: Object,
      default() {
        return newClient();
      }
    }
  }
};
</script>
