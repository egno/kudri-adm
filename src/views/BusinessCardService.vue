<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VFlex>
      <VTextField
        key="mainSearch"
        v-model="searchString"
        autofocus
        clearable
        label="Поиск"
        single-line
        type="text"
      />
    </VFlex>
    <VLayout
      row
      wrap
    >
      <VFlex
        v-for="(item, i) in services"
        :key="item.name + i"
      >
        <ServiceCard
          :item="item"
          @onSave="onSave(i)"
          @onDelete="onDelete(i)"
        />
      </VFlex>
      <VDialog v-model="edit">
        <ServiceCardEdit
          :item="newService"
          @onSave="onSave(-1)"
          @onDelete="onDelete(-1)"
        />
      </VDialog>
    </VLayout>
  </VContainer>
</template>

<script>
import ServiceCard from '@/components/service/ServiceCard.vue';
import ServiceCardEdit from '@/components/service/ServiceCardEdit.vue';
import Api from '@/api/backend';
import { businessMixins } from '@/components/business/mixins';
import { mapActions } from 'vuex';

export default {
  components: {
    ServiceCard,
    ServiceCardEdit
  },
  mixins: [businessMixins],
  data() {
    return {
      searchString: '',
      formActions: [
        { label: 'Добавить услугу', action: 'newService', default: false }
      ],
      data: { j: {} },
      edit: false,
      newService: {},
      service: null
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    services() {
      return this.data.j['services'];
    }
  },
  watch: {
    searchString: 'setStoreSearchString'
  },
  mounted() {
    this.fetchData();
    this.setActions(this.formActions);
    this.$root.$on('onAction', this.onAction);
  },
  beforeDestroy() {
    this.$root.$off('onAction', this.onAction);
  },
  methods: {
    ...mapActions(['setActions', 'setSearchString']),
    setStoreSearchString() {
      this.setSearchString(this.searchString);
    },
    fetchData() {
      Api()
        .get(`business?id=eq.${this.id}`)
        .then(res => res.data)
        .then(res => res[0])
        .then(res => {
          this.data = this.dataPrefill(res);
        });
      Api()
        .get(`service`)
        .then(res => res.data)
        .then(res => {
          this.service = res;
        });
    },
    onAction(payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true;
      }
    },
    onDelete(i) {
      this.edit = false;
      this.newService = {};
      if (i > -1) {
        this.data.j.services = this.data.j.services.filter((x, n) => n !== i);
      }
      this.sendData();
    },
    onSave(i) {
      this.edit = false;
      if (i === -1) {
        this.data.j['services'].push(Object.assign({}, this.newService));
      }
      this.data.j['services'] = this.services.filter(
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
