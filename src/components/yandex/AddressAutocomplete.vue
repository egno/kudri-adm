<template>
  <v-layout column>
    <v-flex>
      <v-combobox
        v-model="address"
        auto-select-first
        browser-autocomplete
        :error="!success"
        hide-no-data
        hint="Вводите только адрес дома"
        :items="items"
        item-value="name"
        item-text="name"
        :label="label"
        :loading="loading"
        no-filter
        persistent-hint
        :prepend-icon="prependIcon"
        :rules="[rules.success]"
        :search-input.sync="search"
      />
    </v-flex>
    <v-img
      v-if="success && point"
      :src="`https://static-maps.yandex.ru/1.x/?lang=ru_RU&l=map&z=16&ll=${point}&pt=${point},org`"
      :lazy-src="``"
      aspect-ratio="1"
      class="grey lighten-2"
    >
      <v-layout
        slot="placeholder"
        fill-height
        align-center
        justify-center
        ma-0
      >
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        />
      </v-layout>
    </v-img>
  </v-layout>
</template>



<script>
import axios from 'axios';

export default {
  props: {
    value: { default: undefined },
    label: { type: String, default: undefined },
    prependIcon: { type: String, default: undefined }
  },
  data() {
    return {
      address: undefined,
      edited: false,
      items: undefined,
      loading: false,
      search: '',
      success: false
    };
  },
  computed: {
    point() {
      if (!(this.success && this.items && this.items[0] && this.items[0].point))
        return;
      return this.items[0].point.replace(' ', ',');
    },
    rules() {
      return {
        success: () => {
          return this.success || 'Адрес не найден';
        }
      };
    }
  },
  watch: {
    address(val) {
      this.$emit('input', val);
      this.search = val;
      this.success =
        !this.edited || (this.items && this.items.some(x => x === this.search));
    },
    value: 'fetchValue',
    search(val) {
      val && val !== this.address && this.geocode(val);
    }
  },
  mounted() {
    this.fetchValue();
  },
  methods: {
    fetchValue() {
      if (!this.value || typeof this.value !== 'object') {
        this.address = { name: this.value };
      } else {
        this.address = this.value;
      }
      this.search = this.address.name;
    },
    geocode(val) {
      this.loading = true;
      this.edited = true;
      if (!(val && val.length > 6)) {
        this.items = undefined;
        return;
      }
      axios
        .get(
          `https://geocode-maps.yandex.ru/1.x/?format=json&kind=house&geocode=${val}`
        )
        .then(res => {
          this.items = res.data.response.GeoObjectCollection.featureMember
            .filter(
              x =>
                x.GeoObject.metaDataProperty.GeocoderMetaData.kind === 'house'
            )
            .map(x => ({
              name:
                x.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
              point: x.GeoObject && x.GeoObject.Point && x.GeoObject.Point.pos
            }));
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
