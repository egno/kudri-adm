<template>
  <div>
    <div class="select-code" />
    <VTextField
      v-model="newPhone"
      :label="label"
      mask="phone"
      prefix="+7"
      :rules="[rules.counter]"
      class="businesscard-form__field _phone"
      @input="onEdit"
    />
  </div>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    label: { type: String, default: 'Телефон' },
    phone: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      newPhone: '',
      rules: {
        counter: value => value.length === 10 || 'В номере должно быть 10 цифр'
      }
    }
  },
  watch: { phone: 'update' },
  mounted () {
    this.update()
  },
  methods: {
    onEdit () {
      this.$emit('onEdit', this.newPhone)
    },
    update () {
      this.newPhone = (this.phone || '').replace(/(\+?\d?)(\d{10})$/g, '$2')
    }
  }
}
</script>
