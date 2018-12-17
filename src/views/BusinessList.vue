<template>
  <VDataTable
    :headers="headers"
    :items="data"
    class="elevation-1"
  >
    <template
      slot="items"
      slot-scope="props"
    >
      <td>
        <VLayout
          row
          align-center
          fill-height
          justify-start
        >
          <VBtn
            fab
            flat
            right
            small
            :href="'businessCard/'+props.item.id"
            target="_blank"
          >
            <UserAvatar
              class="ma-1"
              :name="props.item.data.name || props.item.data.email"
              size="2.4em"
              :src="props.item.data.avatar"
            />
          </VBtn>
          <VFlex
            align-self-center
            justify-start
          >
            {{ props.item.data.name }}
          </VFlex>
        </VLayout>
        <a
          :href="'businessCard/'+props.item.id"
          target="_blank"
        />
      </td>
      <td>{{ props.item.type }}</td>
      <td>{{ props.item.data.inn }}</td>
      <td>{{ props.item.data.address }}</td>
      <td>{{ props.item.data.email }}</td>
      <td>{{ props.item.data.manager }}</td>
      <td>-</td>
      <td>-</td>
      <td class="justify-center layout px-0">
        <a
          :href="'businessCard/'+props.item.id"
          target="_blank"
        >
          <VIcon
            small
            class="mr-2"
          >
            edit
          </VIcon>
        </a>
      </td>
    </template>
  </VDataTable>
</template>

<script>
import Api from '@/api/backend';
import router from '@/router';
import UserAvatar from '@/components/UserAvatar.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { UserAvatar },
  data() {
    return {
      formActions: [
        { label: 'Добавить', action: 'newBusiness', default: true }
      ],
      headers: [
        { text: 'Название', value: 'name' },
        { text: 'Тип', value: '' },
        { text: 'ИНН', value: 'data.inn' },
        { text: 'Адрес', value: 'data.address' },
        { text: 'Email', value: 'data.email' },
        { text: 'Менеджер', value: 'data.manager' },
        { text: 'Дата', value: '' },
        { text: 'Статус', value: '' },
        { text: 'Действия', value: '' }
      ],
      data: []
    };
  },
  computed: {
    ...mapGetters(['loggedIn', 'searchString']),
    table() {
      return this.$route.name == 'businessList' ? 'business' : 'my_business';
    },
    querySearchString() {
      if (!this.searchString) {
        return '';
      }
      return `?or=(data->>email.ilike.*${
        this.searchString
      }*,data->>name.ilike.*${this.searchString}*,data->>inn.ilike.${
        this.searchString
      }*,data->>address.ilike.*${this.searchString}*)`;
    }
  },
  watch: {
    table: 'fetchData',
    searchString: 'fetchData'
  },
  mounted() {
    this.fetchData();
    this.setActions(this.formActions);
  },
  destroyed() {
    this.setActions([]);
  },
  methods: {
    ...mapActions(['setActions']),
    editItem(item) {
      router.push({ name: 'businessCard', params: { id: item.id } });
    },
    fetchData() {
      this.data = [];
      Api()
        .get(`${this.table}${this.querySearchString}`)
        .then(res => res.data)
        .then(res => {
          this.data = res;
        });
    }
  }
};
</script>

<style >
</style>
