<template>
  <v-container>
    <v-layout>
      <v-flex
        v-for="(client,i) in data"
        :key="i"
      >
        <ClientMiniCard :client="client">
          {{ client }}
        </ClientMiniCard>
      </v-flex>
    </v-layout>
    <VDialog
      v-model="edit"
      max-width="60em"
    >
      <ClientCardEdit
        :client="newClient"
        @onSave="onSave($event)"
      />
    </VDialog>
  </v-container>
</template>

<script>
import ClientCardEdit from '@/components/client/ClientCardEdit.vue';
import ClientMiniCard from '@/components/client/ClientMiniCard.vue';
import Api from '@/api/backend';
import { mapActions, mapGetters } from 'vuex';
import {
  clientFromAPI,
  clientToAPI,
  newClient
} from '@/components/client/utils';
import { makeAlert } from '@/api/utils';

export default {
  components: { ClientCardEdit, ClientMiniCard },
  data() {
    return {
      formActions: [
        { label: 'Добавить клиента', action: 'newClient', default: false }
      ],
      newClient: newClient(),
      data: [],
      edit: false
    };
  },
  computed: {
    ...mapGetters(['searchString']),
    id() {
      return this.$route.params.id;
    },
    querySearchString() {
      if (!this.searchString) {
        return '';
      }
      return `&or=(j->name->>forename.ilike.*${
        this.searchString
      }*,j->name->>surname.ilike.*${this.searchString}*,j->>phone.ilike.*${
        this.searchString
      }*)`;
    }
  },
  watch: {
    querySearchString: 'fetchData'
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
    ...mapActions(['alert', 'setActions']),
    fetchData() {
      Api()
        .get(`client?business_id=eq.${this.id}${this.querySearchString}`)
        .then(res => res.data)
        .then(res => {
          this.data = res.map(x => clientFromAPI(x));
        });
    },
    onAction(payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true;
      }
    },
    onSave(payload) {
      let data = clientToAPI(payload);
      data.business_id = this.id;
      Api()
        .post('client', data)
        .then(() => {
          this.edit = false;
          this.newClient = newClient();
        })
        .catch(err => {
          this.alert(makeAlert(err));
        });
    }
  }
};
</script>
