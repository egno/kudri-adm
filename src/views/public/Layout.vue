<template>
  <div class="main-page">
    <div class="main-page-sections">
      <slot />

      <section class="easier">
        <div class="content">
          <div class="text-wrapper">
            <div class="main-page__heading">
              ЛЮБИМОЕ ДЕЛО<br>СТАНЕТ ПРОЩЕ
            </div>
            <router-link :to="{ name: 'register' }" class="btn mobile">
              ПОПРОБУЙТЕ БЕСПЛАТНО
            </router-link>
            <router-link :to="{ name: 'register' }" class="btn tablet">
              ПОПРОБУЙТЕ UNO.CRM БЕСПЛАТНО
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <div class="main-page-sections">
      <section class="footer">
        <div class="content">
          <div class="col-wrapper">
            <div class="col">
              <div class="sub">
                <router-link :to="{ name: 'news' }" class="name">
                  Последние обновления
                </router-link>
                <router-link :to="{ name: 'news' }" class="item">
                  Июнь 2019
                </router-link>
              </div>
              <router-link :to="{ name: 'home' }" class="sub">
                <span class="name">Продукт</span>
              </router-link>
              <router-link :to="{ name: 'home', hash: '#' }" class="sub">
                <span class="name">Кому подойдёт система</span>
              </router-link>
            </div>

            <div class="col">
              <div class="sub">
                <router-link :to="{ name: 'faq' }" class="name">
                  Сервисы
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  Мобильная версия
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  Интеграция с соцсетями
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  Рассылка SMS
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  API телефония
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  Экспресс-запись
                </router-link>
                <router-link :to="{ name: 'faq', hash: '#' }" class="item">
                  Агрегатор
                </router-link>
              </div>
            </div>

            <div class="col">
              <div class="sub">
                <span class="name">Контакты</span>
                <a class="item" href="tel:+73832131415">
                  +7 (383) 213-14-15
                </a>
                <a class="item" href="mailto:info@uno.salon">
                  info@uno.salon
                </a>
              </div>

              <div class="sub socials">
                <span class="name">Мы в соцсетях</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="hr" />

      <section class="sub-footer">
        <div class="content">
          <a href="https://drive.google.com/open?id=1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4" target="_blank" rel="nofollow">Договор оферты</a>
          <span class="divider">|</span>
          <a href="https://drive.google.com/open?id=1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os" target="_blank" rel="nofollow">Политика конфиденциальности</a>
          <span class="divider">|</span>
          <a href="https://drive.google.com/file/d/16Lm-dS-9qN1dgbKp5gJQHiHqgOz6dz4U/view?usp=sharing" target="_blank" rel="nofollow">Реквизиты компани</a>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import '../../assets/styles/public-sections';

  .main-page-sections {
    background: #f3f4f7;

    .hr {
      background: #f3f4f7;
      height: 1px;
    }

    section {
      &.easier {
        height: 276px;
        background: linear-gradient(64.96deg, #C1240F 0%, #EE5742 100%);
        color: #fff;
        @media only screen and (min-width : $tablet) {
          background: url('../../assets/images/home/bg_easier.png') right center/contain no-repeat, linear-gradient(64.96deg, #C1240F 0%, #EE5742 100%);
        }
        @media screen and (min-width: $desktop) {
          height: 500px;
        }

        .content {
          flex-wrap: wrap;
        }
        .text-wrapper {
          max-width: 100%;
          @media only screen and (min-width : $tablet) {
            padding: 0;
          }
        }
        .main-page__heading {
          margin-bottom: 40px;
        }
        .btn {
          display: flex;
          min-width: 280px;
          height: 68px;
          align-items: center;
          justify-content: space-around;
          background: #fff;
          color: #07101C;
          text-decoration: none;
          text-align: center;
          font-size: 18px;
          font-weight: 900;
          transition: background-color 0.6s 0s, color 0.6s 0s;
          &:hover {
            color: #fff;
            background: #07101C;
          }
          @media screen and (min-width: $desktop) {
            width: 426px;
          }
          &.mobile {
            @media only screen and (min-width : $tablet) {
              display: none;
            }
          }
          &.tablet {
            display: none;
            @media only screen and (min-width : $tablet) {
              display: flex;
            }
          }
        }
      }

      &.footer {
        background: #fff;
        padding: 118px 0;
        .col-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
          flex-direction: column;
          @media screen and (min-width: $desktop) {
            flex-direction: row;
          }
          .col {
            display: block;
            width: 33.3%;
            a {
              display: block;
              color: #000;
            }
            .sub {
              margin-bottom: 20px;
              &:last-child {
                margin-bottom: 0;
              }
              .name {
                display: block;
                font-size: 18px;
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 16px;
              }
              .item {
                font-size: 18px;
                font-weight: normal;
                margin-bottom: 10px;
              }
              &.socials {
                margin-top: 42px;
              }
            }
          }
        }
      }

      &.sub-footer {
        background: #fff;
        padding: 16px 0;
        .content {
          flex-flow: row nowrap;
          justify-content: flex-start;
        }
        * {
          color: #8995AF;
          font-size: 12px;
          line-height: 14px;
        }
        a {
          text-decoration: underline;
          &:hover {
            text-decoration: none;
          }
        }
        .divider {
          content: '|';
          margin: 0 10px;
        }
      }
    }
    .main-page__heading {
      font-size: 24px;
      font-weight: 800;
      @media only screen and (min-width : $tablet) {
        font-size: 40px;
      }
      @media only screen and (min-width : $desktop) {
        font-size: 60px;
      }
    }

  }
</style>
