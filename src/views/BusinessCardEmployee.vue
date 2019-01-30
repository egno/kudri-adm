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
        <EmployeeCard
          :item="item"
          @onSave="onSave(i)"
          @onDelete="onDelete(i)"
        />
      </VFlex>
      <VDialog v-model="edit">
        <EmployeeCardEdit
          :item="newService"
          @onSave="onSave(-1)"
          @onDelete="onDelete(-1)"
        />
      </VDialog>
    </VLayout>
  </VContainer>
</template>

<script>
import EmployeeCard from '@/components/EmployeeCard.vue';
import EmployeeCardEdit from '@/components/EmployeeCardEdit.vue';
import Api from '@/api/backend';
import { businessMixins } from '@/components/business/mixins';
import { mapActions } from 'vuex';

export default {
  components: {
    EmployeeCard,
    EmployeeCardEdit
  },
  mixins: [businessMixins],
  data() {
    return {
      formActions: [
        { label: 'Добавить сотрудника', action: 'newEmployee', default: false }
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
  mounted() {
    this.fetchData();
    this.setActions(this.formActions);
    this.$root.$on('onAction', this.onAction);
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData() {
      Api()
        .get(`employee?parent=eq.${this.id}`)
        .then(res => res.data)
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
    onAction(payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true;
      }
    },
    onDelete(i) {
      this.edit = false;
      this.newService = {};
      if (i > -1) {
        // this.data.j.services = this.data.j.services.filter((x, n) => n !== i);
      }
      // this.sendData();
    },
    onSave(i) {
      this.edit = false;
      if (i === -1) {
        // this.data.j['services'].push(Object.assign({}, this.newService));
      }
      this.data.j['services'] = this.services.filter(
        x => Object.keys(x).length > 0
      );
      // this.sendData();
    },
    sendData() {
      // Api().patch(`employee?id=eq.${this.id}`, this.data);
    }
  }
};
</script>
