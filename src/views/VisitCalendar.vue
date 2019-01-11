<template>
  <div>
    <VCalendar
      kind="full"
      period="week"
      :business-info="businessInfo"
    />
    <VDialog
      v-model="edit"
      max-width="50em"
    >
      <VisitEdit
        :business-info="businessInfo"
        @onSave="onSave(-1, $event)"
        @onDelete="onDelete(-1)"
      />
    </VDialog>
  </div>
</template>

<script>
import VCalendar from '@/components/calendar/VCalendar.vue';
import VisitEdit from '@/components/calendar/VisitEdit.vue';
import { mapActions } from 'vuex';
import Api from '@/api/backend';

export default {
  components: { VCalendar, VisitEdit },
  data() {
    return {
      businessInfo: {},
      edit: false,
      formActions: [
        { label: 'Добавить запись', action: 'newVisit', default: true }
      ]
    };
  },
  computed: {
    business() {
      return this.$route.params.id;
    }
  },
  watch: {
    business: 'fetchData'
  },
  mounted() {
    this.setActions(this.formActions);
    this.$root.$on('onAction', this.onAction);
    this.fetchData();
  },
  methods: {
    ...mapActions(['setActions']),
    fetchData() {
      Api()
        .get(`business?id=eq.${this.business}`)
        .then(res => res.data)
        .then(res => {
          this.businessInfo = res[0];
        });
    },
    onAction(payload) {
      if (payload === this.formActions[0].action) {
        this.edit = true;
      }
    },
    onDelete(i) {
      this.edit = false;
      console.log(i);
      this.sendData();
    },
    onSave(i, payload) {
      this.edit = false;
      console.log(i, payload);
      this.sendData(payload);
    },
    sendData(data) {
      console.log(data);
      Api().post('visit', data);
    }
  }
};
</script>
