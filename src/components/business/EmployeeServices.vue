<template>
  <v-container
    fluid
    grid-list-lg
    pa-0
    pt-3
  >
    <v-layout column>
      <v-flex>
        <v-layout row>
          <v-flex
            xs12
            offset-sm1
            sm10
            offset-md2
            md8
            offset-lg3
            lg6
            offset-xl4
            xl4
          >
            <v-text-field
              v-model="searchString"
              label="Поиск"
              prepend-inner-icon="search"
            />
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex>
        <v-layout column>
          <v-flex
            v-for="category in employeeServiceCategories"
            :key="category"
          >
            <v-layout column>
              <v-flex>
                <span class="title">
                  {{ category || 'Прочие' }}
                </span>
              </v-flex>
              <v-flex>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    v-for="(service, si) in employeeServices"
                    :key="'serv'+si"
                    xs12
                    md6
                    lg4
                    xl3
                  >
                    <ServiceCard :item="service" />
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex>
        <v-text-field
          v-model="item.j.services"
          :disabled="!item.access"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import ServiceCard from '@/components/ServiceCard.vue';
import { serviceInit } from '@/components/business/utils';

export default {
  components: { ServiceCard },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return { searchString: '' };
  },
  computed: {
    ...mapGetters([]),
    employeeServices() {
      return (
        this.item &&
        this.item.j &&
        this.item.j.services.map(x => serviceInit(x))
      );
    },
    employeeServiceCategories() {
      return [''];
    }
  }
};
</script>
