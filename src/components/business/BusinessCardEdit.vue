<template>
  <div
    v-if="data"
    class="infocard _edit"
    flat
  >
    <div class="infocard__content">
      <VForm
        v-show="currentTab==='infoTab'"
        ref="form"
        v-model="valid"
      >
        <v-layout
          justify-center
          :name="name"
          @click="avatarEdit = !avatarEdit"
        >
          <Avatar
            size=""
            :src="avatar"
            :is-editing="true"
            :is-company-avatar="true"
            :avatar-class="'business-avatar'"
            :new-message="false"
            :required="false"
            :name="name"
          />
        </v-layout>

        <VTextField
          v-model="data.name"
          label="Название"
          :rules="[() => !!data.name || 'Это поле обязательно для заполнения',
                   () => !!data.name && data.name.length <= 50 || 'Слишком длинное наименование']"
          required
          class="businesscard-form__field"
          counter="50"
        />
        <VTextField
          v-if="!businessIsIndividual"
          v-model="data.j.inn"
          label="ИНН"
          mask="############"
          :rules="[rules.INN_counter]"
          class="businesscard-form__field"
          required
        />
        <v-layout
          row
          justify-space-between
        >
          <v-flex>
            <AddressAutocomplete
              v-model="data.j.address"
              label="Адрес"
            />
          </v-flex>
          <div class="businesscard-form__field _office">
            <VTextField
              v-model="data.j.office"
              label="Офис"
              class="businesscard-form__field"
            />
          </div>
        </v-layout>
        <BusinessPhonesEdit
          :phones="phones"
          @onEdit="phonesEdit"
        />
        <div
          v-if="data.j.links"
          class="soc"
        >
          <div class="soc__input _ig">
            <VTextField
              v-model="data.j.links.instagram"
              class="businesscard-form__field"
            />
          </div>
          <div class="soc__input _vk">
            <VTextField
              v-model="data.j.links.vk"
              class="businesscard-form__field"
            />
          </div>
          <div
            v-for="(site, i) in data.j.links.others"
            :key="i"
            class="soc__input"
          >
            <VTextField
              v-model="site.uri"
              class="businesscard-form__field"
              @input="debouncedCheckAddLink"
            />
          </div>
        </div>
        <VBtn
          class="businesscard-form__add-field"
          :disabled="addLinkDisabled"
          @click="addLink"
        >
          Добавить ссылку
        </VBtn>
        <v-textarea
          v-if="data && data.j"
          v-model="data.j.description"
          counter="400"
          height="auto"
          auto-grow
          rows="1"
          placeholder="Описание"
          maxlength="400"
          class="businesscard-form__field"
        />

        <div
          v-show="hasErrors"
          class="businesscard-form__errors"
        >
          Необходимо заполнить все обязательные поля
        </div>
        <MainButton
          color="success"
          class="button businesscard-form__next"
          :class="{ button_disabled: hasErrors }"
          @click.native.prevent="emitTabChange"
        >
          Далее
        </MainButton>
      </VForm>
      <div v-show="currentTab !== 'infoTab'">
        <BusinessScheduleEdit
          :week-schedule="schedule"
          @editWeek="scheduleEdit"
          @delete="scheduleEdit()"
        />
        <MainButton
          :disabled="!hasSchedule"
          class="button save-info"
          :class="{ button_disabled: !hasSchedule }"
          @click="debouncedSave"
        >
          Сохранить
        </MainButton>
      </div>
    </div>
    <VDialog
      v-model="avatarEdit"
      max-width="375px"
      height="600px"
    >
      <VueAvatarEditor
        :avatar="avatar"
        :width="280"
        :height="280"
        :border="0"
        :border-radius="140"
        @finished="onAvatarSave"
      />
    </VDialog>
  </div>
</template>

<script>
import Avatar from '@/components/avatar/Avatar.vue'
import VueAvatarEditor from '@/components/avatar/VueAvatarEditor.vue'
import BusinessPhonesEdit from '@/components/business/BusinessPhonesEdit.vue'
import BusinessScheduleEdit from '@/components/business/BusinessScheduleEdit.vue'
import AddressAutocomplete from '@/components/yandex/AddressAutocomplete.vue'
import { backendMixins } from '@/api/mixins'
import { businessMixins } from '@/components/business/mixins'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { makeAlert } from '@/api/utils'
import MainButton from '@/components/common/MainButton.vue'
import Business from '@/classes/business'
import { debounce } from 'lodash'

export default {
  components: {
    AddressAutocomplete,
    BusinessPhonesEdit,
    BusinessScheduleEdit,
    Avatar,
    VueAvatarEditor,
    MainButton
  },
  mixins: [backendMixins, businessMixins],
  props: {
    businessInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    currentTab: {
      type: String,
      default: 'infoTab'
    }
  },
  data () {
    return {
      avatarEdit: false,
      categoryDisabled: false,
      captionClass: '',
      data: new Business(this.businessInfo),
      rules: {
        category: value => !value || value.length > 2 || 'Выберите тип',
        INN_counter: value =>
          (value &&
            (value.length === 10 ||
              value.length === 12 ||
              'В ИНН должно быть 10 или 12 цифр')) ||
          true
      },
      valid: false,
      schedule: undefined,
      addLinkDisabled: false
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
      return !!(this.data && this.data.name)
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
        this.data.j.schedule.data.length &&
        !this.data.j.schedule.data.some(day => !day.start || !day.end)
      )
    },
    hasErrors () {
      return !(this.hasAddress && this.hasName && this.hasPhone)
    },
    id () {
      return this.$route.params.id
    },
    name () {
      return this.data.name
    }
  },
  watch: {
    'data.j.links': 'checkAddLink'
  },
  created () {
    this.fetchData()
    this.debouncedCheckAddLink = debounce(this.checkAddLink, 200)
    this.debouncedSave = debounce(this.saveData)
  },
  methods: {
    ...mapActions(['alert']),
    ...mapMutations({
      setBusinessInfo: 'SET_BUSINESS_INFO'
    }),
    addLink () {
      if (!this.data.j.links) {
        this.data.j.links = {
          vk: '',
          instagram: '',
          others: [{ uri: '' }]
        }
      }
      if (!this.data.j.links.others || !this.data.j.links.others.length) {
        this.data.j.links.others = [{ uri: '' }]
      }

      this.checkAddLink()
      if (!this.addLinkDisabled) {
        this.data.j.links.others.push({ uri: '' })
        this.$forceUpdate()
      }
    },
    checkAddLink () {
      let sites = this.data.j.links && this.data.j.links.others

      if (!sites || !sites.length) {
        this.addLinkDisabled = false
        return
      }

      this.addLinkDisabled = sites.some(site => !site.uri)
    },
    emitTabChange () {
      this.$emit('tabChange')
    },
    fetchData () {
      if (this.id === 'new') {
        return
      }
      this.data
        .load(this.id)
        .then(() => {
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
          if (
            !this.data.j.links ||
            !this.data.j.links.others ||
            this.data.j.links.others.length
          ) {
            this.addLink()
          }
          if (this.data.j.schedule) {
            this.schedule = this.data.j.schedule
          }
        })
        .catch(err => {
          this.alert(makeAlert(err))
        })
    },
    onAvatarSave (img) {
      this.saveImage(img).then(() => {
        this.data.save().then(() => {
          this.setBusinessInfo(this.data)
        })
      })
    },
    phonesEdit (payload) {
      this.data.j.phones = payload
    },
    saveData () {
      this.data
        .save()
        .then(() => {
          this.setBusinessInfo(this.data)
          this.$emit('saved')
        })
        .catch(err => {
          this.alert(makeAlert(err))
        })
    },
    scheduleEdit (newWeek) {
      this.data.j.schedule = newWeek
      this.schedule = newWeek
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/infocard';
@import '../../assets/styles/businesscard-form';

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
.soc {
  .v-input__slot {
    padding-left: 30px;
  }
  &__input {
    position: relative;
    &:before {
      position: absolute;
      width: 18px;
      height: 18px;
      top: 14px;
      left: 0px;
      content: '';
      background: url('../../assets/sllink.svg') no-repeat center center;
      background-size: 18px;
    }
    &._ig {
      &:before {
        background: url('../../assets/images/svg/igg.svg') no-repeat center
          center;
      }
    }
    &._vk {
      &:before {
        background: url('../../assets/images/svg/vkk.svg') no-repeat center
          center;
      }
    }
  }
}
.save-info {
  display: block;
  width: 240px !important;
  height: 56px !important;
  border-radius: 0 !important;
  margin: 28px auto 0;
  font-family: $roboto;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  &:hover {
    background-color: #07101c;
  }
}
</style>
