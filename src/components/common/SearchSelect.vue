<template>
  <div class="custom-select">
    <VTextField
      :value="searchingValue"
      :label="label"
      :rules="required? [ rules.required, rules.maxLength(maxLength) ] : [ rules.maxLength(maxLength) ]"
      @input.native="onInput"
      @blur="visible = false; required && !searchingValue && $emit('error', 'Необходимо заполнить все обязательные поля')"
      @update:error="!$event && $emit('error', 'Слишком длинный текст')"
    />
    <div v-if="visible && filteredOptions && filteredOptions.length" class="custom-select__dropdown">
      <div
        v-for="(option, i) in filteredOptions"
        :key="i"
        :class="[ 'custom-select__item' ]"
        @mousedown="select(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'searchingValue',
      event: 'input'
    },
    props: {
      searchingValue: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default () {
          return []
        }
      },
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      maxLength: {
        type: Number,
        default: 200
      }
    },
    data () {
      return {
        visible: false,
        rules: {
          required: value => !!value || 'Это поле обязательно для заполнения',
          maxLength: length => (value) => value && (value.length <= length || 'Слишком длинный текст') || true
        },
        selected: null,
      }
    },
    computed: {
      filteredOptions () {
        if (!this.searchingValue || !this.options) {
          return
        }

        return this.options.filter(option => option.toLowerCase().includes(this.searchingValue.trim().toLowerCase()))
      }
    },
    methods: {
      onInput (e) {
        this.visible = true
        this.$emit('input',  e.target.value)
      },
      select (option) {
        this.$emit('select', option)
      }
    }
  }

</script>

<style lang="scss">
  .custom-select {
    position: relative;

    &__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      z-index: 1000000;
    }
    &__item {
      cursor: pointer;
      padding: 6px 0 5px 32px;
      text-align: left;
      background: rgba(137, 149, 175, 0.1);
      color: #8995AF;
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
      transition: background-color 0.4s 0s;
      &:hover {
        background: rgba(137, 149, 175, 0.2);
      }
    }
  }
</style>
