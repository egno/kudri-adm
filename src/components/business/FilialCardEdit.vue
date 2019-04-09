<template>
  <VCard flat>
    <VCardTitle>Филиал</VCardTitle>
    <VBtn
      fab
      left
      large
      @click="avatarEdit = !avatarEdit"
    >
      <Avatar
        :name="name"
        size="4em"
        :src="avatar"
      />
    </VBtn>
    <VCardText>
      <VForm>
        <VTextField
          v-model="data.j.name"
          label="Наименование"
          prepend-icon="account_box"
          :rules="[() => !!data.j.name || 'Это поле обязательно для заполнения']"
          required
        />
        <VTextField
          v-model="data.j.address"
          label="Адрес"
          prepend-icon="local_post_office"
        />
        <BusinessPhonesEdit
          :phones="phones"
          @onEdit="phonesEdit"
        />
        <BusinessScheduleEdit
          :schedule="data.j.schedule"
          @onEdit="scheduleEdit"
        />
      </VForm>
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="primary"
        @click="close"
      >
        Сохранить
      </VBtn>
    </VCardActions>
    <VDialog
      v-model="avatarEdit"
      max-width="350px"
    >
      <VueAvatarEditor
        :avatar="avatar"
        @finished="saveImage"
      />
    </VDialog>
  </VCard>
</template>

<script>
import Avatar from '@/components/avatar/Avatar.vue'
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue'
import BusinessPhonesEdit from '@/components/business/BusinessPhonesEdit.vue'
import BusinessScheduleEdit from '@/components/business/BusinessScheduleEdit.vue'
import axios from 'axios'
import { businessMixins } from '@/components/business/mixins'

export default {
  components: {
    BusinessPhonesEdit,
    BusinessScheduleEdit,
    Avatar,
    VueAvatarEditor
  },
  mixins: [businessMixins],
  props: {
    id: { type: String, default: '' },
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      avatarEdit: false,
      data: { j: {} }
    }
  },
  computed: {
    avatar () {
      if (this.data.j) {
        return this.data.j.avatar
      }
      return null
    },
    name () {
      if (this.data.j) {
        return this.data.j.name
      }
      return null
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    close () {
      this.$emit('onEditClose', this.data)
    },
    fetchData () {
      this.data = this.dataPrefill(this.item)
    },
    phonesEdit (payload) {
      this.data.j.phones = payload
    },
    saveImage (img) {
      this.avatarEdit = false
      var blobBin = atob(img.toDataURL().split(',')[1])
      var array = []
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i))
      }
      var file = new Blob([new Uint8Array(array)], { type: 'image/png' })
      let formData = new FormData()
      let newFileName = `${this.data.id}.png`
      formData.append('file', file, newFileName)
      let vm = this
      axios
        .post(process.env.VUE_APP_UPLOAD, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function () {
          vm.data.j.avatar = newFileName
        })
        .then(() => vm.sendData())
        .catch(function () {
          console.log('FAILURE!!')
        })
    },
    scheduleEdit (payload) {
      this.data.j.schedule = payload
    }
  }
}
</script>
