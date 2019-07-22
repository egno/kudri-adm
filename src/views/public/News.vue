<template>
  <Layout>
    <section class="update type-3">
      <div class="overlay" />
      <div class="content">
        <div class="text-wrapper">
          <div class="header">
            ПОСЛЕДНИЕ<br>ОБНОВЛЕНИЯ
          </div>
          <div class="subheader">
            Мы всегда идем в ногу с бизнесом,<br>
            и благодаря вашей обратной связи<br>
            регулярно создаем актуальные и<br>
            полезные обновления.
          </div>
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОДРОБНОЕ ОПИСАНИЕ ОБНОВЛЕНИЙ
          </router-link>
        </div>
      </div>
    </section>

    <section class="adaptive">
      <div class="overlay layer-1" />
      <div class="content layer-0">
        <div class="text-wrapper">
          <div class="header">
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
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="connection type-1">
      <div class="content">
        <div class="overlay layer-0" />
        <div class="text-wrapper layer-1">
          <div class="header">
            БУДЬТЕ НА СВЯЗИ<br>С КЛИЕНТАМИ!
          </div>
          <div class="subheader">
            Простой сервис отправки sms-уведомлений<br>
            клиентам и сотрудникам.
          </div>
          <p class="text">
            Напоминайте о записи, поздравляйте с праздниками,<br>
            подтверждайте записи клиентов без затрат времени.<br><br>
            Вам не потребуется заключение дополнительных договоров<br>
            с операторами связи и проблем с подключением API. Все эти<br>
            вопросы мы уже решили за вас. Вам нужно лишь ознакомиться<br>
            с договором оферты и настроить события отправки сообщений.
          </p>
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
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
.main-page-sections {
  section {
    &.update {
      background: #f3f4f7;
      .overlay {
        width: 50%;
        background: url('../../assets/images/news/bg_update.png') left/contain no-repeat;
      }
    }

    &.adaptive {
      height: 750px;
      background: linear-gradient(297.98deg, #1A5FC8 1.52%, #7BADFB 100%);
      box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.05);
      color: #fff;
      a {
        color: #fff;
        &:after {
          border-color: #fff;
        }
      }
      .overlay {
        width: 52%;
        top: -141px;
        height: 1100px;
        background: url('../../assets/images/news/bg_adaptive.png') right top/contain no-repeat;
      }
      .content {
        padding: 143px 0 121px;
        .text-wrapper {
          width: 725px;
        }
      }
    }

    &.connection {
      background: #fff;
      height: 830px;
      .overlay {
        top: 70px;
        background: url('../../assets/images/news/bg_connection.png') right top/contain no-repeat;
      }
      .content {
        .text-wrapper {
          width: 700px;
        }
      }
    }
  }
}
</style>
