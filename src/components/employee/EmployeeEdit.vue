<template>
  <v-layout column>
    <v-layout
      justify-center
      class="businesscard-form__avatar"
    >
      <Avatar
        size=""
        :src="imagePath"
        :is-editing="true"
        :is-company-avatar="false"
        :avatar-class="'business-avatar'"
        :new-message="false"
        :required="false"
        :name="employee.j.name"
      /><!--todo-->
    </v-layout>
    <template v-if="employee.j">
      <v-text-field
        v-model="employee.j.name"
        browser-autocomplete="name"
        label="Имя и Фамилия*"
        required
        :disabled="!employee.access"
        :rules="[ rules.required ]"
        class="businesscard-form__field"
      />
      <v-select
        v-model="employee.j.category"
        label="Должность*"
        :items="employeeCategories"
        :disabled="!employee.access"
        :rules="[ rules.required ]"
        class="businesscard-form__field dropdown-select"
      />
      <PhoneEdit :phone="employee.j.phones[0]" :disabled="!employee.access" :removable="false" class="phone-input" @onEdit="employee.j.phones[0] = $event" />
      <v-textarea
        v-model="employee.j.notes"
        counter="500"
        height="auto"
        auto-grow
        rows="1"
        class="businesscard-form__field"
        maxlength="500"
        placeholder="Дополнительные сведения"
        :disabled="!employee.access"
        :rules="[value => value && (value.length <= 500 || 'Слишком длинный текст') || true]"
      />
    </template>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import PhoneEdit from '@/components/common/PhoneEdit.vue'
import Avatar from '@/components/avatar/Avatar.vue'

export default {
  components: { Avatar, PhoneEdit },
  props: {
    employee: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      defaultImage: require('@/assets/user.svg'),
      rules: {
        required: value => !!value || 'Это поле обязательно для заполнения',
        maxLength: length => (value) => value && (value.length <= length || 'Слишком длинный текст') || true
      },
    }
  },
  computed: {
    ...mapGetters(['employeePositions', 'employeeCategories']),
    imagePath () {
      return this.employee.imagePath || this.defaultImage
    }
  },
  methods: {
    onFilesUpload (payload) {
      if (payload && payload[0] && payload[0].path) {
        this.$emit('onImageUpload', payload[0].path)
      }
    },
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/phone-input';
</style>
