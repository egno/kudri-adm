<template>
  <div>
    <VCalendar
      kind="full"
      period="week"
      :business-info="businessInfo"
      :new-visit="newVisit"
      @closeEdit="newVisit=false"
    />
  </div>
</template>

<script>
import VCalendar from '@/components/calendar/VCalendar.vue';
import { mapActions } from 'vuex';
import Api from '@/api/backend';

export default {
  components: { VCalendar },
  data() {
    return {
      businessInfo: {},
      newVisit: false,
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
    // TODO проверить, утекает ли память
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
        this.newVisit = true;
      }
    }
  }
};
</script>
