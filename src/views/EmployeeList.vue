<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VLayout column>
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
      <VFlex>
        <VLayout column>
          <VFlex
            v-for="(category, ci) in categories"
            :key="'cat'+ci"
            xs12
          >
            <VLayout column>
              <VFlex pb-0>
                <span class="title">
                  {{ category || 'Прочие' }}
                </span>
              </VFlex>
              <VFlex>
                <VLayout
                  row
                  wrap
                >
                  <VFlex
                    v-for="(item, i) in categoryItems(category)"
                    :key="i"
                    xs12
                    md6
                    lg4
                    xl2
                  >
                    <EmployeeCard
                      :item="item"
                      @onSave="onSave"
                    >
                      {{ i }} {{ item.id }}
                    </EmployeeCard>
                  </VFlex>
                </VLayout>
              </VFlex>
            </VLayout>
          </VFlex>
        </VLayout>
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
      data: []
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    categories() {
      return [
        ...new Set(this.data && this.data.map(x => x.j && x.j.category))
      ].sort((a, b) => (a < b ? -1 : 1));
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
    categoryItems(category) {
      return (
        this.data && this.data.filter(x => x.j && x.j.category === category)
      );
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
      } else {
        Api().patch(`employee?id=eq.${data.id}`, data);
      }
    },
    setStoreSearchString() {
      this.setSearchString(this.searchString);
    }
  }
};
</script>

