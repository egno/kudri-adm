<template>
  <VCard
    v-if="data"
    flat
  >
    <div v-if="!tab">
      <div class="main-cont">
        <VForm
          v-model="valid"
          lazy-validation
          class="business-edit"
        >
          <div
            class="d-inline-block mb-20"
            :name="name"
            @click="avatarEdit = !avatarEdit"
          >
            <UserAvatar
              size="4em"
              :src="avatar"
              :type="'square'"
            />
          </div>

          <VTextField
            v-model="data.j.name"
            label="Название"
            :rules="[() => !!data.j.name || 'Это поле обязательно для заполнения']"
            required
            class="businesscard__field"
          />
          <!--<VCombobox
            v-model="data.j.category"
            :disabled="categoryDisabled"
            :items="businessCategories"
            label="Тип"
            :rules="[rules.category]"
          />-->
          <VTextField
            v-if="!businessIsIndividual"
            v-model="data.j.inn"
            label="ИНН"
            mask="############"
            :rules="[rules.INN_counter]"
            class="businesscard__field"
          />
          <v-layout row>
            <v-flex xs9>
              <AddressAutocomplete
                v-model="data.j.address"
                label="Адрес"
              />
            </v-flex>
            <v-flex xs3>
              <VTextField
                v-model="data.j.office"
                label="Офис"
                class="businesscard__field"
              />
            </v-flex>
          </v-layout>

          <BusinessPhonesEdit
            :phones="phones"
            @onEdit="phonesEdit"
          />
          <!--<div
            class="form-caption"
            :class="captionClass"
          >
            Режим работы
          </div>

          <BusinessScheduleEdit
            :schedule="data.j.schedule"
            class="workmode"
            @onEdit="scheduleEdit"
          />-->

          <v-flex class="soc-input">
            <div class="soc-input-ic" />
            <VTextField v-model="data.j.links.instagram" class="businesscard__field" />
          </v-flex>
          <VBtn class="businesscard__add-field">
            Добавить ссылку
          </VBtn>


          <v-textarea
            counter="400"
            value
            height="auto"
            auto-grow
            rows="1"
            placeholder="Описание"
            maxlength="400"
            class="businesscard__field"
          />
          <MainButton
            :disabled="hasErrors"
            color="success"
            class="businesscard__next"
            @click="tab = true"
          >
            Далее
          </MainButton>
        </VForm>
      </div>
    </div>
    <div v-else />


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
import UserAvatar from '@/components/avatar/UserAvatar.vue'
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue'
import BusinessPhonesEdit from '@/components/business/BusinessPhonesEdit.vue'
// import BusinessScheduleEdit from '@/components/business/BusinessScheduleEdit.vue'
import AddressAutocomplete from '@/components/yandex/AddressAutocomplete.vue'
import Api from '@/api/backend'
import { backendMixins } from '@/api/mixins'
import { businessMixins } from '@/components/business/mixins'
import { mapActions, mapGetters } from 'vuex'
import { makeAlert } from '@/api/utils'
import MainButton from '@/components/common/MainButton.vue'

export default {
  components: {
    AddressAutocomplete,
    BusinessPhonesEdit,
    /*BusinessScheduleEdit,*/
    UserAvatar,
    VueAvatarEditor,
    MainButton
  },
  mixins: [backendMixins, businessMixins],
  data () {
    return {
      avatarEdit: false,
      categoryDisabled: false,
      captionClass: '',
      data: undefined,
      rules: {
        category: value => !value || value.length > 2 || 'Выберите тип',
        INN_counter: value =>
          (value &&
            (value.length === 10 ||
              value.length === 12 ||
              'В ИНН должно быть 10 или 12 цифр')) ||
          true
      },
      valid: true,
      tab: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      businessCategories: 'businessCategories',
      businessIsIndividual: 'businessIsIndividual'
    }),
    avatar () {
      if (this.data.j) {
        return this.data.j.avatar
      }
      return null
    },
    business () {
      return this.id
    },
    hasAddress () {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.address &&
        this.data.j.address.name
      )
    },
    hasName () {
      return !!(this.data && this.data.j && this.data.j.name)
    },
    hasPhone () {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.phones &&
        this.data.j.phones[0]
      )
    },
    hasINN () {
      return !!(
        this.data &&
        this.data.j &&
        (this.data.j.category === 'Частный мастер' || this.data.j.inn)
      )
    },
    hasSchedule () {
      return !!(
        this.data &&
        this.data.j &&
        this.data.j.schedule &&
        this.data.j.schedule.data &&
        this.data.j.schedule.data.reduce(
          (acc, cur) => acc || (cur && cur.length > 1 && cur[0] && cur[1]),
          false
        )
      )
    },
    hasErrors () {
      return !(
        this.hasAddress &&
        this.hasName &&
        this.hasPhone &&
        this.hasINN &&
        this.hasSchedule &&
        this.valid
      )
    },
    id () {
      return this.$route.params.id
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
    ...mapActions(['alert']),
    close () {
      this.sendData()
    },
    fetchData () {
      if (this.id === 'new') {
        this.data = this.dataPrefill()
        return
      }
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          if (res && !res.access) {
            this.$emit('onEditClose')
          }
          this.data = this.dataPrefill(res)
          if (
            !(this.data.j && this.data.j.category) &&
            this.userInfo &&
            this.userInfo.data &&
            this.userInfo.data.j &&
            this.userInfo.data.j.category
          ) {
            this.data.j.category = this.userInfo.data.j.category
          }
          if (this.data.j.category) {
            this.categoryDisabled = true
          }
        })
    },
    phonesEdit (payload) {
      this.data.j.phones = payload
    },
    sendData () {
      this.data.j.phones = this.data.j.phones.filter(x => x > '')
      if (this.id === 'new') {
        Api()
          .post(`business`, this.data)
          .then(res => {
            const newId = this.locationId(res.headers)
            console.log(newId)
            if (newId) {
              this.$router.push({
                name: 'businessCard',
                params: { id: newId }
              })
            }
          })
          .catch(res => {
            this.alert(makeAlert(res))
          })
      } else {
        Api()
          .patch(`business?id=eq.${this.id}`, this.data)
          .then(() => {
            this.$emit('onEditClose')
          })
          .catch(res => {
            this.alert(makeAlert(res))
          })
      }
    },
    scheduleEdit (payload) {
      this.data.j.schedule = payload
    }
  }
}
</script>
<style lang="scss">
.workmode {
  margin-top: 35px;
}
.form-caption {
  padding-top: 50px;
}
.v-input {
  .v-counter {
    order: -1;
  }
}
.business-edit {
  width: 312px;
  button.success {
    margin-left: 0;
    margin-top: 50px;
  }
}
.soc-input {
  position: relative;
  .v-input__slot {
    padding-left: 30px;
  }
  .soc-input-ic {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 0px;
    top: 14px;
    background: url('../../assets/sllink.svg') no-repeat center center;
    background-size: 18px;
  }
}
</style>
