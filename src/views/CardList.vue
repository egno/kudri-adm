<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VLayout
      row
      wrap
    >
      <VFlex
        v-for="(item, i) in items"
        :key="item.name + i"
      >
        {{ i }} {{ item.name }}
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import Api from '@/api/backend';

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  data() {
    return {
      edit: false
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = res;
        });
      Api()
        .get(`service`)
        .then(res => res.data)
        .then(res => {
          this.service = res;
        });
    },
    onDelete(i) {
      this.edit = false;
      this.newService = {};
      if (i > -1) {
        this.data.data.service = this.data.data.service.filter(
          (x, n) => n !== i
        );
      }
      this.sendData();
    },
    onSave(i) {
      this.edit = false;
      if (i === -1) {
        this.data.data['service'].push(Object.assign({}, this.newService));
      }
      this.data.data['service'] = this.services.filter(
        x => Object.keys(x).length > 0
      );
      this.sendData();
    },
    sendData() {
      Api().patch(`business?id=eq.${this.id}`, this.data);
    }
  }
};
</script>

