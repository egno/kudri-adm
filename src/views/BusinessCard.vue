<template>
  <div class="businesscard">
    <VLayout xs12 align-center justify-start row class="businesscard__header">
      <VFlex class="businesscard__heading">
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
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.40402 0L13 2.13162L11.3998 4.82815L7.80374 2.69653L9.40402 0ZM7.27032 3.59534L10.8663 5.72696L4.46522 16.5131L4.46514 16.5131L0 19.9415L0.869124 14.3814L0.869208 14.3815L7.27032 3.59534Z" fill="#8995AF" fill-opacity="0.35" />
            </svg>
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

<style lang="scss">
  @import '../assets/styles/common';
  @import '../assets/styles/icon';
  @import '../assets/styles/infocard';
  @import '../assets/styles/businesscard-form';

  .businesscard {
    height: 100%;
    display: flex;
    align-items: stretch;
    flex-direction: column;

    &__header {
      min-height: 128px;
      flex-grow: 0;
      padding: 44px 0 44px 48px;
      background: #fff;
      @media only screen and (min-width : $desktop) {
        padding-left: 127px;
      }
    }

    &__heading {
      flex-grow: 0;
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
      padding-left: 40px;
      &:hover {
        path {
          fill: #000;
        }
      }
      button.v-btn {
        @include uno-icon();
        border: 1px solid rgba(137, 149, 175, 0.1);
        &:hover {
          border-color: transparent;
          color: rgba(0,0,0,0.4); 
        }
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

    &__phone {
      padding-left: 24px;
      background: url('../assets/images/svg/ru.svg') left top no-repeat;
    }
  }

  .soc {
    &__input {
      position: relative;
      @include vertical-align();
      &:before {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 23px;
        left: 0px;
        content: '';
        background: url('../assets/sllink.svg') no-repeat center center;
        background-size: 18px;
      }
      &._ig {
        &:before {
          background: url('../assets/images/svg/igg.svg') no-repeat center;
        }
      }
      &._vk {
        &:before {
          background: url('../assets/images/svg/vkk.svg') no-repeat center;
        }
      }

      input {
        padding-left: 30px;
      }
    }
    &__value {
      position: relative;
      padding: 20px 0 0 30px;
      &:before {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 22px;
        left: 0;
        content: '';
        background: url('../assets/sllink.svg') no-repeat center;
        background-size: 18px;
      }
      &._ig {
        &:before {
          background: url('../assets/images/svg/igg.svg') no-repeat center;
        }
      }
      &._vk {
        &:before {
          background: url('../assets/images/svg/vkk.svg') no-repeat center center;
        }
      }
    }
  }
</style>
