<template>
  <v-layout column align-center>
    <div>
      <Avatar
        size=""
        :src="imagePath"
        :is-editing="true"
        :is-company-avatar="false"
        :avatar-class="'business-avatar'"
        :new-message="false"
        :required="false"
        :name="employee.j.name"
      />
    </div>
    <div v-if="employee && employee.j">
      <v-flex>
        <v-text-field
          v-model="employee.j.name"
          browser-autocomplete="name"
          label="Имя и Фамилия"
          required
          :disabled="!employee.access"
        />
      </v-flex>

      <v-flex>
        <v-combobox
          v-model="employee.j.category"
          label="Должность"
          :employees="employeeCategories"
          :disabled="!employee.access"
          :rules="[ rules.required ]"
        />
      </v-flex>

      <v-flex>
        <PhoneEdit :phone="employee.j.phone" :disabled="!employee.access" :removable="false" />
      </v-flex>
    </div>
    <v-flex v-if="employee.j">
      <v-textarea
        v-model="employee.j.notes"
        label="Дополнительные сведения"
        :disabled="!employee.access"
      />
    </v-flex>
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
