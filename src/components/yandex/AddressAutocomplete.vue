<template>
  <v-layout>
    <v-flex>
      <v-combobox
        v-model="address"
        auto-select-first
        browser-autocomplete
        :error="!success"
        hide-no-data
        :items="items"
        item-value="name"
        item-text="name"
        :label="label"
        :loading="loading"
        no-filter
        persistent-hint
        :prepend-icon="prependIcon"
        :rules="[rules.found]"
        :search-input.sync="search"
        class="businesscard-form__field"
        :class="{'error--text': !address || !address.point}"
        required
      />
    </v-flex>
  </v-layout>
</template>



<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  props: {
    value: { type: [String, Object], default: undefined },
    label: { type: String, default: undefined },
    prependIcon: { type: String, default: undefined }
  },
  data () {
    return {
      address: undefined,
      edited: false,
      items: undefined,
      loading: false,
      search: undefined,
      success: false
    }
  },
  computed: {
    rules () {
      return {
        found: () => {
          return (
            this.success ||
            `Адрес не найден. Проверьте правильность введенных данных`
          )
        }
      }
    }
  },
  watch: {
    address (val) {
      this.$emit('inputAddress', val)
      this.search = (val && val.name) || ''
      this.success =
        !this.edited ||
        (this.items &&
          this.items.map(x => x.name).some(x => x === this.search))
    },
    value: 'fetchValue',
    search (val) {
      val && val !== this.address.name && this.geocode(val)
    }
  },
  mounted () {
    this.fetchValue()
  },
  methods: {
    ...mapActions(['openMessageWindow']),
    fetchValue () {
      if (typeof this.value === 'string') {
        this.address = { name: this.value }
      } else if (typeof this.value === 'object') {
        this.address = this.value
        this.address.name = this.address.name || null
      } else {
        this.address = { name: null }
      }
      this.search = this.address.name || null
    },
    geocode (val) {
      this.loading = true
      this.edited = true
      if (!(val && val.length > 6)) {
        this.items = undefined
        this.loading = false
        return
      }
      const dt = new Date()
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
              city:
                x.GeoObject && x.GeoObject.description,
              cityAddress:
                x.GeoObject && x.GeoObject.name,
              addressComponents:
                x.GeoObject.metaDataProperty.GeocoderMetaData.Address && x.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components,
              point: x.GeoObject && x.GeoObject.Point && x.GeoObject.Point.pos,
              updated: dt.toISOString()
            }))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    cutCountryOff (str) {
      const index = str.indexOf(',')

      return str.substr(index+1).trim()
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/businesscard-form';

  .href {
  text-decoration: underline;
  color: rgb(158, 0, 0);
}
</style>
