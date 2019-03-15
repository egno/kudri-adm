<template>
  <div class="businesscard">
    <VLayout xs12 align-center justify-start row class="businesscard__header">
      <VFlex>
        <h1 class="businesscard__h1">
          {{ businessInfo && businessInfo.category }}
        </h1>
      </VFlex>
      <VFlex>
        <div v-if="!editMode && businessInfo && businessInfo.access">
          <v-btn
            icon
            fab
            flat
            ripple
            @click="editMode = true"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </div>
      </VFlex>
    </VLayout>
    <VLayout class="businesscard__content">
      <BusinessCardEdit
        v-if="editMode"
        :id="id"
        @onEditClose="editMode=false"
      />
      <BusinessCard
        v-else
        :id="id"
        :business-info="businessInfo"
        @onEditClick="editMode=true"
      />
    </VLayout>
  </div>
</template>

<script>
import BusinessCard from '@/components/business/BusinessCard.vue'
import BusinessCardEdit from '@/components/business/BusinessCardEdit.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    BusinessCard: BusinessCard,
    BusinessCardEdit: BusinessCardEdit
  },
  data () {
    return {
      data: { data: {} },
      editMode: false
    }
  },
  computed: {
    ...mapGetters([
      'businessInfo',
    ]),
    id () {
      return this.$route.params.id
    }
  },
  watch: {
    id: 'checkId'
  },
  mounted () {
    this.checkId()
    this.setActions(null)
  },
  methods: {
    ...mapActions(['setActions']),
    checkId () {
      if (this.id === 'new') {
        this.editMode = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/styles/common';

  .businesscard {
    height: 100%;
    display: flex;
    align-items: stretch;
    flex-direction: column;

    &__header {
      flex-grow: 0;
      padding: 44px 0 44px 48px;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__h1 {
      font-family: $roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: normal;
      color: #07101C;
    }

    &__content {
      flex-grow: 1;
      background: #f4f5f7;
      padding-left: 48px;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }
  }
</style>
