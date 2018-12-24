<template>
  <div>
    <span :class="captionClass">
      Тел.
    </span>&nbsp;
    <span
      v-for="(item, i) in phones"
      :key="i"
    >
      <a :href="`tel:${phoneLink(item)}`">
        {{ item | phone }}
      </a>
      <span>,{{ " " }}</span>
    </span>
  </div>
</template>

<script>
export default {
  filters: {
    phone(value) {
      if (!value) return '';
      return value.replace(/(\d{1,3})(\d{1,3})(\d{1,4})/g, '+7($1)$2-$3');
    }
  },
  props: {
    captionClass: {
      type: String,
      default:
        'caption font-weight-bold text-no-wrap grey--text text--lighten-1'
    },
    phones: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    phoneLink(value) {
      if (!value) return '';
      return `+7${value}`;
    }
  }
};
</script>
