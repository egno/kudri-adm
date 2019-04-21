<template>
  <div class="checkbox">
    <input
      :id="id"
      :checked="checked"
      :name="name"
      :value="value"
      v-bind="$attrs"
      type="checkbox"
      class="checkbox__input"
      @change="$emit('change', $event.target.checked)"
    >
    <label :for="id" class="checkbox__label">{{ label }}</label>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: { type: Boolean, default: false },
    id: { type: String, required: true },
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    value: { type: String, default: '' }
  }
}
</script>
<style lang="scss">
@import '../../assets/styles/common';

.checkbox {
  display: inline-block;
  vertical-align: middle;

  &__input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  &__label {
    display: inline-block;
    @extend %filter;
    margin-right: 16px;
  }

  &__input:checked + &__label {
    @extend %filter-active;
  }
}
</style>
