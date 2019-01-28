<template>
  <v-layout column>
    <v-flex>
      <v-combobox
        v-model="address"
        auto-select-first
        browser-autocomplete
        hide-no-data
        hide-details
        hint-text="Вводите только адрес дома"
        :items="items"
        :label="label"
        :loading="loading"
        no-filter
        persistent-hint
        :prepend-icon="prependIcon"
        :search-input.sync="search"
        :error="!success"
      />
    </v-flex>
  </v-layout>
</template>



<script>
import axios from 'axios';

export default {
  props: {
    value: { type: String, default: undefined },
    label: { type: String, default: undefined },
    prependIcon: { type: String, default: undefined }
  },
  data() {
    return {
      address: '',
      edited: false,
      items: undefined,
      loading: false,
      search: '',
      success: false
    };
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
      this.address = this.value;
      this.search = this.address;
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
            .map(
              x =>
                x.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted
            );
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>
