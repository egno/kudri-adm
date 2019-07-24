<template>
  <Layout>
    <section class="update">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ПОСЛЕДНИЕ<br>ОБНОВЛЕНИЯ
          </div>
          <div class="subheader">
            Мы всегда идем в ногу с бизнесом,
            и благодаря вашей обратной связи
            регулярно создаем актуальные и
            полезные обновления.
          </div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОДРОБНОЕ ОПИСАНИЕ ОБНОВЛЕНИЙ
          </router-link>
        </div>
      </div>
    </section>

    <section class="adaptive type-3">
      <div class="overlay layer-1" />
      <div class="content layer-0">
        <div class="text-wrapper">
          <div class="main-page__heading">
            АДАПТИРОВАНА<br>ПОД ВСЕ УСТРОЙСТВА
          </div>
          <div class="subheader">
            В курсе дел из любой точки мира.
          </div>
          <p class="text">
            Вести дела стало проще. Просто откройте ваш личный<br>
            кабинет в браузере мобильного телефона или планшета и<br>
            управляйте бизнесом из любой точки мира.<br><br>
            Предоставьте доступ вашим менеджерам и мастерам<br>
            к системе, чтобы в ваше отсутствие рабочие процессы<br>
            не останавливались.
          </p>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="connection type-1">
      <div class="content-wrapper">
        <div class="content">
          <div class="text-wrapper layer-1">
            <div class="main-page__heading">
              БУДЬТЕ НА СВЯЗИ<br>С КЛИЕНТАМИ!
            </div>
            <div class="subheader">
              Простой сервис отправки sms-уведомлений
              клиентам и сотрудникам.
            </div>
            <p class="text">
              Напоминайте о записи, поздравляйте с праздниками,
              подтверждайте записи клиентов без затрат времени.<br><br>
              Вам не потребуется заключение дополнительных договоров
              с операторами связи и проблем с подключением API. Все эти
              вопросы мы уже решили за вас. Вам нужно лишь ознакомиться
              с договором оферты и настроить события отправки сообщений.
            </p>
            <router-link :to="{ name: 'home' }" class="inner-link layer-1">
              ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/public/Layout.vue'

export default {
  name: 'News',
  components: {
    Layout,
  },
}
</script>

<style lang="scss">
  @import '../../assets/styles/common';
.main-page-sections {
  section {
    &.update {
      height: calc(100vh - 80px);
      /* for animation of header on mobiles
      height: 100vh;
      margin-top: -80px;
      */
      background: url('../../assets/images/news/bg_update.png') 30px 30px/130% no-repeat  #f3f4f7;
      /* for animation of header on mobiles
      @media only screen and (min-width : $tablet) {
        height: calc(100vh - 80px);
        margin-top: 0;
      }*/
      @media screen and (min-width: $desktop) {
        height: calc(100vh - 146px);
        background: url('../../assets/images/news/bg_update.png') right center/54% no-repeat  #f3f4f7;
      }
      .content {
        align-items: flex-end;
        padding-bottom: 13%;
        @media screen and (min-height: 1024px) {
          padding-bottom: 20%;
        }
      }
      .main-page__heading {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
