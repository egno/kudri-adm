<template>
  <Layout>
    <section class="pocket type-3">
      <div class="overlay" />
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            КАРМАННЫЙ ОФИС<br> И МНОГОЕ ДРУГОЕ
          </div>
          <div class="subheader">
            Используйте возможности UNO.CRM<br>
            для работы с клиентами своего бизнеса<br>
            с помощью ряда специальных сервисов.
          </div>
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОДРОБНЕЕ О ПРОДУКТЕ
          </router-link>
        </div>
      </div>
    </section>

    <section class="adaptive">
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
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="online type-2">
      <div class="content">
        <div class="overlay layer-0" />
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЗАПИСЬ НА САЙТЕ<br>И В СОЦСЕТЯХ
          </div>
          <div class="subheader">
            Чтобы клиенты могли записаться<br>в любое время.
          </div>
          <p class="text">
            Чаще всего бизнес теряет клиентов еще на этапе<br>
            первого контакта. Ссылка на онлайн-запись<br>
            во всех точках контакта позволит увеличить записи<br>
            клиентов на 20%. Настройка и установка виджета<br>
            займет у вас не более 20 минут.
          </p>
        </div>
      </div>
    </section>

    <section class="connection type-1">
      <div class="content-wrapper">
        <div class="content">
          <div class="overlay layer-0" />
          <div class="text-wrapper layer-1">
            <div class="main-page__heading">
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
      </div>
    </section>

    <section class="phone type-3 layer-0">
      <div class="overlay" />
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ИНТЕГРАЦИЯ<br>С ТЕЛЕФОНИЕЙ
          </div>
          <div class="subheader">
            Когда просто сообщения<br>недостаточно.
          </div>
          <p class="text">
            Мы никогда не лишим вас привычного инструмента.<br>
            У вас есть возможность связаться с клиентом прямо<br>
            из базы в один клик. Просто нажмите кнопку вызова<br>
            и выберите программу, через которую вы хотите<br>
            провести звонок. Или же звоните напрямую через<br>
            мобильный телефон.
          </p>
        </div>
      </div>
    </section>

    <section class="express type-2 layer-1">
      <div class="content">
        <div class="overlay layer-0" />
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЭКСПРЕСС-ЗАПИСЬ<br>ЗА 30 СЕКУНД
          </div>
          <div class="subheader">
            Только для супер-шпионов!
          </div>
          <p class="text">
            Запись «Экспресс», без указания данных о клиенте,<br>
            создана специально для тех, кто спешит на сверхсекретную миссию!<br>
            Или забежал «просто подровнять кончики».
          </p>
        </div>
        <div>
          <router-link :to="{ name: 'home' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="aggregation type-3">
      <div class="content">
        <div class="overlay" />
        <div class="text-wrapper">
          <div class="main-page__heading">
            ПРОДВИЖЕНИЕ<br>ЧЕРЕЗ АГРЕГАТОР
          </div>
          <div class="subheader">
            С нашей системой вы сможете не только<br>
            удержать и повысить лояльность<br>
            постоянных клиентов, но и найти новых.
          </div>
          <p class="text">
            Без ставок за привлеченного клиента, процентов с заказов, без штрафов и<br>
            сложных систем оплат. Настройте участие в агрегаторе всего за несколько<br>
            минут и наслаждайтесь потоком клиентов.<br><br>
            Подключайте существующие акции вашей компании или участвуйте в системе<br>
            лояльности агрегатора для повышения позиций компаний в топе. Получайте<br>
            отзывы и рейтинги от клиентов, а также делитесь впечатлениями о клиенте.<br>
            Вы сможете выбирать клиентов по рейтингам и пополнять портфолио.
          </p>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/public/Layout.vue'

export default {
  components: {
    Layout
  },
}
</script>

<style lang="scss">
  .main-page-sections {
    section {
      &.pocket {
        .overlay {
          width: 40%;
          background: url('../../assets/images/faq/bg_pocket.png') right/cover no-repeat;
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
          background: url('../../assets/images/faq/bg_adaptive.png') right top/contain no-repeat;
        }
        .content {
          padding: 143px 0 121px;
          .text-wrapper {
            width: 725px;
          }
        }
      }

      &.online {
        height: 800px;
        .overlay {
          top: 141px;
          left: 0;
          background: url('../../assets/images/faq/bg_online.png') left top/contain no-repeat;
        }
        .content {
          .text-wrapper {
            width: 600px;
          }
        }
      }

      &.connection {
        height: 830px;
        .overlay {
          top: 70px;
          background: url('../../assets/images/faq/bg_connection.png') right top/contain no-repeat;
        }
        .content {
          .text-wrapper {
            width: 700px;
          }
        }
      }

      &.phone {
        height: 826px;
        .overlay {
          width: 75%;
          background: url('../../assets/images/faq/bg_phone.png') left top/cover no-repeat;
        }
      }

      &.express {
        background: #fff;
        height: 635px;
        .overlay {
          left: 0;
          width: 60%;
          top: -140px;
          height: 775px;
          background: url('../../assets/images/faq/bg_express.png') right top/cover no-repeat;
        }
        .content {
          overflow: visible;
          padding: 106px 0;
          .text-wrapper {
            width: 600px;
          }
        }
      }

      &.aggregation {
        .overlay {
          background: url('../../assets/images/faq/bg_aggregation.png') right top/contain no-repeat;
        }
      }
    }
  }
</style>
