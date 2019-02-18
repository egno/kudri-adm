<template>
  <VCard>
    <AppCardTitle @close="$emit('close')">
      <v-layout column>
        <v-flex>
          <span class="grey--text text--darken-1">
            Услуга:
          </span>
          <span
            v-if="selectedService"
            class="span-main-text title text-truncate"
          >
            {{ selectedService.name || selectedService }}
          </span>
        </v-flex>
        <v-flex v-if="employeeName">
          <span class="caption grey--text">
            {{ employeeName }}
          </span>
        </v-flex>
      </v-layout>
    </AppCardTitle>
    <v-divider />
    <VCardText>
      <AppTabs
        v-model="activeTab"
        color="grey lighten-4"
      >
        <v-tab
          key="0"
          ripple
        >
          Сведения
        </v-tab>
        <v-tab
          key="1"
          ripple
        >
          Фото
        </v-tab>
        <v-tab-item key="0">
          <VContainer grid-list-md>
            <v-layout wrap>
              <v-flex
                xs12
                sm6
              >
                <VSelect
                  v-model="item.group"
                  :items="categories"
                  label="Категория"
                  required
                  @input="onCategoryUpdate"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
              >
                <VCombobox
                  v-model="selectedService"
                  autofocus
                  :items="services"
                  item-value="name"
                  item-text="name"
                  label="Наименование"
                  required
                  :progress="loading"
                  :search-input.sync="serviceSearch"
                  @input="onNameUpdate"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
              >
                <VTextField
                  v-model="item.price"
                  label="Цена от"
                  mask="######"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
              >
                <VTextField
                  v-model="item.duration"
                  label="Продолжительность, минут"
                  mask="###"
                />
              </v-flex>
              <v-flex xs12>
                <VTextarea
                  v-model="item.note"
                  outline
                  label="Примечание"
                />
              </v-flex>
            </v-layout>
          </VContainer>
        </v-tab-item>
        <v-tab-item key="1">
          <GalleryTiles
            :service="selectedService"
            :employee="employee"
            :rows="2"
            edit
          />
        </v-tab-item>
      </AppTabs>
    </VCardText>
    <v-divider />
    <VCardActions>
      <VSpacer />
      <app-btn @click="onDelete">
        Удалить
      </app-btn>
      <app-btn
        primary
        @click="onSave"
      >
        Сохранить
      </app-btn>
    </VCardActions>
  </VCard>
</template>

<script>
import { mapGetters } from 'vuex';
import Api from '@/api/backend';
import GalleryTiles from '@/components/gallery/GalleryTiles.vue';
import AppBtn from '@/components/common/AppBtn.vue';
import AppTabs from '@/components/common/AppTabs.vue';
import AppCardTitle from '@/components/common/AppCardTitle.vue';

export default {
  components: { AppBtn, AppCardTitle, AppTabs, GalleryTiles },
  props: {
    employee: { type: String, default: undefined },
    employeeName: { type: String, default: undefined },
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      activeTab: 0,
      loading: false,
      selectedService: undefined,
      serviceSearch: '',
      services: []
    };
  },
  computed: {
    ...mapGetters(['serviceGroups']),
    categories() {
      return this.serviceGroups;
    }
  },
  watch: {
    serviceSearch: 'loadServices',
    item: 'load'
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.selectedService = this.item.name;
    },
    loadServices() {
      if (this.loading) return;
      this.services = [];
      let conditions = [];
      if (this.item.group) {
        conditions.push(`group.eq.${this.item.group}`);
      }
      if (this.serviceSearch) {
        conditions.push(`name.ilike.*${this.serviceSearch}*`);
      }
      if (conditions.length === 0) return;
      this.loading = true;
      Api()
        .get(`service?and=(${conditions.join(',')})`)
        .then(res => res.data)
        .then(res => {
          this.services = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onDelete() {
      this.$emit('onDelete', undefined);
    },
    onCategoryUpdate() {
      this.loadServices();
    },
    onNameUpdate(event) {
      this.item.group = event && event.group;
    },
    onSave() {
      if (!this.serviceSearch) return;
      this.item.name = this.serviceSearch;
      this.$emit('onSave', this.item);
    }
  }
};
</script>
