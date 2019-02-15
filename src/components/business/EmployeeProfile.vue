<template>
  <v-card
    v-if="item && item.j"
    flat
  >
    <v-layout column>
      <v-flex>
        <v-img :src="imagePath" />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.name"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.surname"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.position"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.category"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.phone"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.email"
          :disabled="!item.access"
        />
      </v-flex>
      <v-flex>
        <v-text-field
          v-model="item.j.notes"
          :disabled="!item.access"
        />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { imagePath } from '@/components/gallery/utils';
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    imagePath() {
      return imagePath(this.item.image, this.item.parent);
    }
  }
};
</script>
