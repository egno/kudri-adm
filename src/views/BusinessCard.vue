<template>
  <VContainer
    fluid
    grid-list-lg
  >
    <BusinessCardEdit
      v-if="edit"
      :id="id"
      @onEditClose="edit=false"
    />
    <BusinessCard
      v-else
      :id="id"
      @onEditClick="edit=true"
    />
  </VContainer>
</template>

<script>
import BusinessCard from '@/components/business/BusinessCard.vue';
import BusinessCardEdit from '@/components/business/BusinessCardEdit.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    BusinessCard: BusinessCard,
    BusinessCardEdit: BusinessCardEdit
  },
  data() {
    return {
      data: { data: {} },
      edit: false
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  watch: {
    id: 'checkId'
  },
  mounted() {
    this.checkId();
    this.setActions(null);
  },
  methods: {
    ...mapActions(['setActions']),
    checkId() {
      if (this.id === 'new') {
        this.edit = true;
      }
    }
  }
};
</script>
