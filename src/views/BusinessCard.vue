<template>
  <div class="businesscard">
    <VLayout xs12 align-center justify-start row class="businesscard__header">
      <VFlex xs6>
        <h1 class="businesscard__h1">
          {{ businessInfo && businessInfo.category }}
        </h1>
      </VFlex>
      <VFlex>
        <div v-if="!editMode && businessInfo && businessInfo.access" class="businesscard__edit">
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
    <div v-if="editMode" class="businesscard__tab-wrapper">
      <div class="businesscard__tab">
        <div class="businesscard__tab-header" :class="{_active: infoTab}" @click="infoTab = !infoTab">
          Информация
        </div>
        <div class="businesscard__tab-header" :class="{_active: !infoTab}" @click="infoTab = !infoTab">
          Режим работы
        </div>
      </div>
    </div>
    <VLayout class="businesscard__content">
      <BusinessCardEdit
        v-if="editMode"
        :business-info="businessInfo"
        :current-tab="infoTab? 'infoTab' : 'scheduleTab'"
        @tabChange="infoTab=!infoTab"
        @saved="editMode=false"
      />
      <BusinessCard
        v-else
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
      editMode: false,
      infoTab: true
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
      background: #fff;
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

    &__edit {
      button {
        width: 40px;
        height: 40px;
        margin: 0;
        border: 1px solid rgba(137, 149, 175, 0.1);
        border-radius: 50%;
        color:   #C4C4C4;
      }
    }

    &__tab-wrapper {
      padding:0 37px;
      font-family: $lato;
      font-style: normal;
      font-size: 16px;
      line-height: 40px;
      background: #fff;
      border-bottom: 1px solid rgba(137, 149, 175, 0.1);
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__tab {
      display: flex;
      justify-content: space-around;

      @media only screen and (min-width: $tablet) {
        max-width: 524px;
        margin: 0 auto;
      }
      @media only screen and (min-width: $desktop) {
        margin: 0;
      }
    }

    &__tab-header {
      position: relative;
      flex-grow: 1;
      text-align: center;
      color: #8995AF;
      cursor: pointer;
      &._active {
        color: #07101C;
        font-weight: bold;
        &:after {
          content: '';
          width: 100%;
          height: 2px;
          position: absolute;
          bottom: 0;
          left: 0;
          background: linear-gradient(90.49deg, #C9A15D 0%, #BA9462 101.44%);
        }
      }
    }

    &__content {
      flex-grow: 1;
      background: #fff;
      @media only screen and (min-width: $tablet) {
        background: #f4f5f7;
      }
      @media only screen and (min-width: $desktop) {
        padding-left: 127px;
      }
    }
  }
</style>
