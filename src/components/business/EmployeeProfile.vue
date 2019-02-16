<template>
  <v-card
    v-if="item && item.j"
    flat
  >
    <v-layout column>
      <v-flex xs12>
        <v-layout
          row
          wrap
        >
          <v-flex
            pa-4
            xs12
            md4
          >
            <v-img
              :src="imagePath"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex>
            <v-layout column>
              <v-flex>
                <v-text-field
                  v-model="item.j.name"
                  browser-autocomplete="name"
                  label="Имя"
                  required
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.j.surname"
                  label="Фамилия"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex>
                <v-combobox
                  v-model="item.j.category"
                  label="Специальность"
                  :items="employeeCategories"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex>
                <v-combobox
                  v-model="item.j.position"
                  label="Должность"
                  :items="employeePositions"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex>
                <PhoneEdit
                  :phone="item.j.phone"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="item.j.email"
                  label="e-mail"
                  :disabled="!item.access"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-textarea
          v-model="item.j.notes"
          label="Примечания"
          :disabled="!item.access"
          outline
        />
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { imagePath } from '@/components/gallery/utils';
import { mapGetters } from 'vuex';
import PhoneEdit from '@/components/business/PhoneEdit.vue';

export default {
  components: { PhoneEdit },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(['employeePositions', 'employeeCategories']),
    imagePath() {
      return imagePath(this.item.j && this.item.j.image, this.item.parent);
    }
  }
};
</script>
