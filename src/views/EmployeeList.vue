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
        v-for="(item, i) in data"
        :key="i"
      >
        <EmployeeCard
          :item="item"
          @onSave="onSave"
        >
          {{ i }} {{ item.id }}
        </EmployeeCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import Api from '@/api/backend';
import EmployeeCard from '@/components/business/EmployeeCard.vue';
import { mapActions } from 'vuex';

export default {
  params: {
    items: { type: Array, default: [] },
    search: { type: String, default: '' }
  },
  components: { EmployeeCard },
  data() {
    return {
      searchString: '',
      formActions: [
        {
          label: 'Добавить сотрудника',
          action: 'newEmployee',
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
        .get(`employee?parent=eq.${this.id}`)
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
      data.type = 'E';
      if (!data.id) {
        Api().post(`employee`, data);
        // .then(res => {
        //   const newId = this.locationId(res.headers);
        // if (newId) {
        // router.push({ name: 'businessCard', params: { id: newId } });
        // }
        // });
      } else {
        Api().patch(`employee?id=eq.${data.id}`, data);
      }
    }
  }
};
</script>

