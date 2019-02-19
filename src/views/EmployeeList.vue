<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <VLayout column>
      <VFlex v-if="queryService">
        <h2>{{ queryService }}</h2>
      </VFlex>
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
                      }
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
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
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
    },
    queryService() {
      return this.$route && this.$route.query && this.$route.query.service;
    }
  },
  mounted() {
    this.fetchData();
    this.setActions();
  },
  methods: {
    ...mapActions(['setActions']),
    categoryItems(category) {
      return (
        this.data &&
        this.data.filter(
          x =>
            x.j &&
            x.j.category === category &&
            (!this.queryService ||
              (x.j.services &&
                x.j.services.length > 0 &&
                x.j.services.some(s => (s.name || s) === this.queryService))) &&
            (!this.searchString ||
              (x.j.category &&
                x.j.category
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              // (x.j.phone &&
              //   x.j.phone
              //     .toUpperCase()
              //     .indexOf(this.searchString.toUpperCase()) > -1) ||
              // (x.j.email &&
              //   x.j.email
              //     .toUpperCase()
              //     .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.surname &&
                x.j.surname
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.name &&
                x.j.name
                  .toUpperCase()
                  .indexOf(this.searchString.toUpperCase()) > -1) ||
              (x.j.services &&
                x.j.services.length > 0 &&
                x.j.services.some(
                  s =>
                    (s.name || s)
                      .toUpperCase()
                      .indexOf(this.searchString.toUpperCase()) > -1
                )))
        )
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

