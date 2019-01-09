<template>
  <div>
    <span :class="captionClass">
      Тел.
    </span>&nbsp;
    <span
      v-for="(item, i) in phones"
      :key="i"
    >
      <span v-if="i">
        ,{{ " " }}
      </span>
      <a :href="phoneLink(item)">
        {{ item | phone }}
      </a>
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
      default: ''
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
      return `tel:+7${value}`;
    }
  }
};
</script>
