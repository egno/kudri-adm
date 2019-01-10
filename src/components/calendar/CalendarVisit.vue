<template>
  <div>{{ timeStart }}-{{ timeEnd }} {{ visitorInfo }}</div>
</template>

<script>
export default {
  props: {
    timeStart: { type: String, default: '' },
    timeEnd: { type: String, default: '' },
    visitor: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    visitorInfo() {
      if (!this.visitor) {
        return 'Занято';
      }
      if (this.visitor.name) {
        return this.visitor.name;
      }
      if (this.visitor.phone) {
        return this.visitor.phone;
      }
      if (this.visitor.email) {
        return this.visitor.email;
      }
      return 'Занято';
    }
  }
};
</script>
