<template>
  <div class="custom-select">
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
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      searchingValue: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        selected: null
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
      top: 0;
      left: 0;
      width: 100%;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      z-index: 1000000;
    }
    &__item {
      cursor: pointer;
      padding-left: 32px;
      text-align: left;
      background: rgba(137, 149, 175, 0.1);
      color: #8995AF;
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 28px;
      transition: background-color 0.4s 0s;
      &:hover {
        background: rgba(137, 149, 175, 0.2);
      }
    }
  }
</style>
