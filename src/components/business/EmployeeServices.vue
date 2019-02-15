<template>
  <v-card
    v-if="item && item.j"
    flat
  >
    <v-layout column>
      <v-flex>
        <v-text-field
          v-model="item.j.services"
          :disabled="!item.access"
        />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {}
};
</script>
