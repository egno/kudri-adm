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
            <v-layout column>
              <v-flex pb-1>
                <v-img
                  :src="imagePath"
                  aspect-ratio="1"
                />
              </v-flex>
              <v-flex v-if="item && item.id">
                <ImageLoader
                  :src="imagePath"
                  @onFilesUpload="onFilesUpload($event)"
                />
              </v-flex>
            </v-layout>
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
                <v-combobox
                  v-model="item.j.category"
                  label="Категория"
                  :items="employeeCategories"
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
              label="Примечание"
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
import { mapGetters } from 'vuex'
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import ImageLoader from '@/components/common/ImageLoader.vue'

export default {
  components: { ImageLoader, PhoneEdit },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      defaultImage: require('@/assets/user.svg')
    }
  },
  computed: {
    ...mapGetters(['employeePositions', 'employeeCategories']),
    imagePath () {
      return (
        this.item.imagePath ||
        this.defaultImage
      )
    }
  },
  methods: {
    onFilesUpload (payload) {
      if (payload && payload[0] && payload[0].path) {
        this.$emit('onImageUpload', payload[0].path)
      }
    },
    onLoadPhotoClick () {}
  }
}
</script>
