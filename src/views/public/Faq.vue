<template>
  <Layout>
    <section class="pocket type-3">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            КАРМАННЫЙ ОФИС<br> И МНОГОЕ ДРУГОЕ
          </div>
          <div class="subheader">
            Используйте возможности UNO.CRM
            для работы с клиентами своего бизнеса
            с помощью ряда специальных сервисов.
          </div>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОДРОБНЕЕ О ПРОДУКТЕ
          </router-link>
        </div>
      </div>
    </section>

    <section class="adaptive type-3">
      <div class="overlay layer-1" />
      <div class="content layer-0">
        <div class="text-wrapper">
          <div class="main-page__heading">
            АДАПТИРОВАНА ПОД&nbsp;ВСЕ&nbsp;УСТРОЙСТВА
          </div>
          <div class="subheader">
            В курсе дел из любой точки мира.
          </div>
          <p class="text">
            Вести дела стало проще. Просто откройте ваш личный
            кабинет в браузере мобильного телефона или планшета и
            управляйте бизнесом из любой точки мира.<br><br>
            Предоставьте доступ вашим менеджерам и мастерам
            к системе, чтобы в ваше отсутствие рабочие процессы
            не останавливались.
          </p>
          <router-link :to="{ name: 'home' }" class="inner-link">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="online type-2">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЗАПИСЬ НА САЙТЕ<br>И В СОЦСЕТЯХ
          </div>
          <div class="subheader">
            Чтобы клиенты могли записаться в&nbsp;любое время.
          </div>
          <p class="text">
            Чаще всего бизнес теряет клиентов еще на этапе
            первого контакта. Ссылка на онлайн-запись
            во всех точках контакта позволит увеличить записи
            клиентов на 20%. Настройка и установка виджета
            займет у&nbsp;вас&nbsp;не&nbsp;более 20 минут.
          </p>
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

    <section class="phone type-3 layer-0">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ИНТЕГРАЦИЯ<br>С&nbsp;ТЕЛЕФОНИЕЙ
          </div>
          <div class="subheader">
            Когда просто сообщения<br>недостаточно.
          </div>
          <p class="text">
            Мы никогда не лишим вас привычного инструмента.
            У вас есть возможность связаться с клиентом прямо
            из базы в один клик. Просто нажмите кнопку вызова
            и выберите программу, через которую вы хотите
            провести звонок. Или же звоните напрямую через
            мобильный телефон.
          </p>
        </div>
      </div>
    </section>

    <section class="express type-2 layer-1">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ЭКСПРЕСС-ЗАПИСЬ<br>ЗА 30 СЕКУНД
          </div>
          <div class="subheader">
            Только для супер-шпионов!
          </div>
          <p class="text">
            Запись «Экспресс», без указания данных о клиенте,
            создана специально для тех, кто спешит на сверхсекретную миссию!
            Или забежал «просто подровнять кончики».
          </p>
          <router-link :to="{ name: 'home' }" class="inner-link layer-1">
            ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
          </router-link>
        </div>
      </div>
    </section>

    <section class="aggregation type-3">
      <div class="content">
        <div class="text-wrapper">
          <div class="main-page__heading">
            ПРОДВИЖЕНИЕ ЧЕРЕЗ АГРЕГАТОР
          </div>
          <div class="subheader">
            С нашей системой вы сможете не&nbsp;только
            удержать и повысить лояльность
            постоянных клиентов, но и найти новых.
          </div>
          <p class="text">
            Без ставок за привлеченного клиента, процентов с заказов, без штрафов и
            сложных систем оплат. Настройте участие в агрегаторе всего за несколько
            минут и наслаждайтесь потоком клиентов.<br>
            <br>
            Подключайте существующие акции вашей компании или участвуйте в системе
            лояльности агрегатора для повышения позиций компаний в топе. Получайте
            отзывы и рейтинги от клиентов, а также делитесь впечатлениями о клиенте.
            Вы сможете выбирать клиентов по рейтингам и пополнять портфолио.
          </p>

          <div class="g-play" />
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
  $tablet: 768px;
  $desktop: 1360px;
  $large: 1552px;
  $wide: 1905px;
  $white-fill: linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5));

  .main-page-sections {
    section {
      &.pocket {
        height: calc(100vh - 80px);
        background: $white-fill, url('../../assets/images/faq/bg_pocket.png') 170px center/auto 100% no-repeat;
        @media only screen and (min-width : $tablet) {
          background: url('../../assets/images/faq/bg_pocket.png') right center/auto 100% no-repeat;
        }
        .text-wrapper {
          @media only screen and (min-width : $tablet) {
            padding-right: 0;
          }
          @media only screen and (min-width : $desktop) {
            padding: 0;
          }
        }
        .subheader {
          margin-bottom: 32px;
        }
      }

      &.online {
        .content {
          background: url('../../assets/images/faq/bg_online.png') left bottom/62% no-repeat;
          @media screen and (min-width: $desktop) {
            background-size: 55%;
          }
          .text-wrapper {
            @media screen and (min-width: $desktop) {
              max-width: 67%;
              padding-right: 0;
            }
          }
        }
      }

      &.phone {
        height: 400px;
        background: $white-fill, url('../../assets/images/faq/bg_phone.png') center top/cover no-repeat;
        @media screen and (min-width: $tablet) {
          height: 500px;
          background: url('../../assets/images/faq/bg_phone.png') center top/cover no-repeat;
        }
        @media screen and (min-width: $desktop) {
          height: 826px;
        }
      }

      &.express {
        background: #fff;
        .content {
          overflow: visible;
          background: url('../../assets/images/faq/bg_express.png') -80px top/contain no-repeat;
          @media screen and (min-width: $tablet) {
            background-position: left top;
          }
          .text-wrapper {
            @media screen and (min-width: $desktop) {
              width: 600px;
            }
          }
        }
      }

      &.aggregation {
        height: 825px;
        @media screen and (min-width: $tablet) {
          height: 855px;
        }
        @media screen and (min-width: $desktop) {
          height: 950px;
        }
        .content {
          align-items: flex-start;
          padding-top: 64px;
          background: url('../../assets/images/faq/bg_aggregation.png') 200px 410px/70% no-repeat;
          @media screen and (min-width: $tablet) {
            background: url('../../assets/images/faq/bg_aggregation.png') 450px 280px/50% no-repeat;
          }
          @media screen and (min-width: $desktop) {
            background: url('../../assets/images/faq/bg_aggregation.png') right bottom /auto 80% no-repeat;
          }
        }
        .subheader,
        .text {
          @media screen and (min-width: $tablet) {
            max-width: 65%;
          }
          @media screen and (min-width: $desktop) {
            max-width: 100%;
          }
        }
        .g-play {
          width: 130px;
          height: 44px;
          margin-top: 55px;
          background: url('../../assets/images/google_play.png') center/contain no-repeat;
          @media screen and (min-width: $tablet) {
            width: 223px;
            height: 80px;
          }
        }
      }
    }
  }
</style>
