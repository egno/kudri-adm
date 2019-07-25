<template>
  <div class="list">
    <div class="column">
      <div>
        <router-link :to="{ name: 'news' }" class="link page-link">
          ПОСЛЕДНИЕ ОБНОВЛЕНИЯ
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'home', hash: '#product' }" class="link page-link">
          ПРОДУКТ
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'home', hash: '#fits' }" class="link page-link">
          КОМУ ПОДОЙДЕТ СИСТЕМА
        </router-link>
      </div>
    </div>

    <div class="column">
      <div>
        <router-link :to="{ name: 'features' }" class="link page-link">
          СЕРВИСЫ
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#adaptive' }" class="link tablet">
          Мобильная версия
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#social-networks-integrated' }" class="link tablet">
          Интеграция с соцсетями
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#sms-notifications' }" class="link tablet">
          Рассылка SMS
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#phone-integration' }" class="link tablet">
          API телефония
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#express' }" class="link tablet">
          Экспресс-запись
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'features', hash: '#aggregation' }" class="link tablet">
          Агрегатор
        </router-link>
      </div>
    </div>

    <div class="column">
      <div class="block contacts">
        <div class="link page-link">
          КОНТАКТЫ
        </div>
        <div><a href="tel:+73832131415" class="link">+ 7 (383) 213-14-15</a></div>
        <div class="link">
          info@uno.salon
        </div>
      </div>
      <div class="block">
        <div class="page-link">
          МЫ В СОЦСЕТЯХ
        </div>
        <Socials />
      </div>
    </div>
    <div class="column additional">
      <div class="block">
        <div>
          <a href="https://drive.google.com/open?id=1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4" target="_blank" rel="nofollow">Договор оферты</a>
        </div>
        <div>
          <a href="https://drive.google.com/open?id=1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os" target="_blank" rel="nofollow">Политика конфиденциальности</a>
        </div>
        <div>
          <a href="https://drive.google.com/file/d/16Lm-dS-9qN1dgbKp5gJQHiHqgOz6dz4U/view?usp=sharing" target="_blank" rel="nofollow">Реквизиты компани</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Socials from '@/components/home/Socials.vue'

  export default {
    name: 'LinksVue',
    components: {
      Socials,
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/common';

  .list {
    list-style: none;
    padding:  0 0 30px;
    @media only screen and (min-width : $tablet) {
      display: flex;
      flex-wrap: wrap;
    }

    .column {
      padding:  0 40px;
      @media only screen and (min-width : $tablet) {
        width: 33%;
      }
    }

    .link {
      display: block;
      margin-top: 20px;
      color: #07101C;
      text-decoration: none;
      font-weight: 400;
    }

    .page-link {
      margin-top: 28px;
      font-weight: 600;
      font-size: 18px;
    }

    .tablet {
      display: none;
      @media only screen and (min-width : $tablet) {
        display: block;
      }
    }

    .block {
      margin-top: 42px;
      &.contacts {
        @media only screen and (min-width : $tablet) {
          margin-top: 0;
        }
      }
    }

    .additional a {
      font-size: 8px;
      color: #8995AF;
      text-decoration: underline;
      white-space: nowrap;
      @media only screen and (min-width : $tablet) {
        font-size: 12px;
      }
    }

    .main-page__links {
      padding-bottom: 0;
    }
  }


</style>
