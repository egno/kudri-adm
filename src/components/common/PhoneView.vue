<template>
  <div class="phone-view">
    <a :href="phoneLink(phone)">
      {{ phone | phoneFormat }}
    </a>
  </div>
</template>

<script>
  export default {
    filters: {
      phoneFormat (value) {
        if (!value) return ''
        return value.replace(
          /(\d?)(\d{1,3})(\d{1,3})(\d{1,2})(\d{1,2})$/g,
          '+$1 ($2) $3-$4-$5'
        )
      }
    },
    props: {
      phone: {
        type: String,
        default: ''
      },
    },
    methods: {
      phoneLink (value) {
        if (!value) return ''
        return `tel:+${value}`
      }
    }
  }
</script>

<style scoped>
  .phone-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    background: url('../../assets/images/svg/ru.svg') left 4px no-repeat;
  }

  a {
    display: block;
    width: 100%;
    line-height: 24px;
    text-decoration: none;
    color: #07101C;
    background: url('../../assets/images/svg/phone.svg') right top no-repeat;
  }
  a:hover {
    text-decoration: underline;
  }
</style>

