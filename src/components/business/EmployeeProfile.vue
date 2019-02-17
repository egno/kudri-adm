<template>
  <v-container
    fluid
    grid-list-lg
    pa-0
    pt-3
  >
    <v-layout row>
      <v-flex
        xs12
        offset-lg2
        lg8
        offset-xl3
        xl6
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            sm6
            md4
          >
            <v-img
              :src="imagePath"
              aspect-ratio="1"
            />
          </v-flex>
          <v-flex
            xs12
            sm6
            md8
          >
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
                md6
              >
                <v-text-field
                  v-model="item.j.name"
                  browser-autocomplete="name"
                  label="Имя"
                  required
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex
                xs12
                md6
              >
                <v-text-field
                  v-model="item.j.surname"
                  label="Фамилия"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex
                xs12
                md6
              >
                <v-combobox
                  v-model="item.j.category"
                  label="Специальность"
                  :items="employeeCategories"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex
                xs12
                md6
              >
                <v-combobox
                  v-model="item.j.position"
                  label="Должность"
                  :items="employeePositions"
                  :disabled="!item.access"
                />
              </v-flex>

              <v-flex
                xs12
                md6
              >
                <PhoneEdit
                  :phone="item.j.phone"
                  :disabled="!item.access"
                />
              </v-flex>
              <v-flex
                xs12
                md6
              >
                <v-text-field
                  v-model="item.j.email"
                  label="e-mail"
                  :disabled="!item.access"
                />
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
      </v-flex>
    </v-layout>
  </v-container>
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
