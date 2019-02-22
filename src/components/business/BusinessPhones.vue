<template>
  <div>
    <span :class="captionClass">
      {{ title }} &nbsp;
    </span>
    <span
      v-for="(item, i) in phones"
      :key="i"
      :class="{light: light}"
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
      return value.replace(
        /(\d?)(\d{1,3})(\d{1,3})(\d{1,4})$/g,
        '+$1($2)$3-$4'
      );
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
    },
    title: { type: String, default: 'Тел.' },
    light: { type: Boolean, default: false }
  },
  methods: {
    phoneLink(value) {
      if (!value) return '';
      return `tel:+7${value}`;
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.light a {
  color: #dd5;
}
</style>

