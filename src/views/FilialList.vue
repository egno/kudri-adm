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
        v-for="(item, i) in data"
        :key="i"
      >
        <FilialCard
          :item="item"
          @onSave="onSave"
        >
          {{ i }} {{ item.id }}
        </FilialCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import Api from '@/api/backend';
import FilialCard from '@/components/business/FilialCard.vue';
import { mapActions } from 'vuex';

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { FilialCard },
  data() {
    return {
      formActions: [
        {
          label: 'Добавить филиал',
          action: 'newFilial',
          default: true
        }
      ],
      edit: false,
      data: {}
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  mounted() {
    this.fetchData();
    this.setActions(this.formActions);
    this.$root.$on('onAction', this.onAction);
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData() {
      Api()
        .get(`filial?parent=eq.${this.id}`)
        .then(res => res.data)
        .then(res => {
          this.data = res;
        });
    },
    onAction(payload) {
      if (payload === this.formActions[0].action) {
        this.data.push({ access: true, j: {} });
      }
    },
    onSave(payload) {
      this.sendData(payload);
    },
    sendData(data) {
      data.j.phones = data.j.phones.filter(x => x > '');
      data.parent = this.id;
      if (!data.id) {
        Api().post(`filial`, data);
        // .then(res => {
        //   const newId = this.locationId(res.headers);
        //   if (newId) {
        //   router.push({ name: 'businessCard', params: { id: newId } });
        //   }
        // });
      } else {
        Api().patch(`filial?id=eq.${data.id}`, data);
      }
    }
  },
  beforeDestroy() {
    this.$root.$off('onAction', this.onAction);
  }
};
</script>

