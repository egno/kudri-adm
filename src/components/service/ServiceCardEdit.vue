<template>
  <VCard>
    <VCardTitle class="headline">
      Услуга
    </VCardTitle>
    <v-divider />
    <VCardText>
      <v-tabs
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
            <VLayout wrap>
              <VFlex
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
              </VFlex>
              <VFlex
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
              </VFlex>
              <VFlex
                xs12
                sm6
              >
                <VTextField
                  v-model="item.price"
                  label="Цена от"
                  mask="######"
                />
              </VFlex>
              <VFlex
                xs12
                sm6
              >
                <VTextField
                  v-model="item.duration"
                  label="Продолжительность, минут"
                  mask="###"
                />
              </VFlex>
              <VFlex xs12>
                <VTextarea
                  v-model="item.note"
                  outline
                  label="Примечание"
                />
              </VFlex>
            </VLayout>
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
      </v-tabs>
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

export default {
  components: { AppBtn, GalleryTiles },
  props: {
    employee: { type: String, default: undefined },
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
