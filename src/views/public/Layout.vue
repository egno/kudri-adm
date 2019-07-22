<template>
  <div class="main-page">
    <div class="main-page-sections">
      <slot />

      <section class="easier type-4">
        <div class="overlay" />
        <div class="content">
          <div class="main-page__heading">
            ЛЮБИМОЕ ДЕЛО<br>СТАНЕТ ПРОЩЕ
          </div>
          <router-link :to="{ name: 'register' }" class="btn">
            ПОПРОБУЙТЕ UNO.CRM БЕСПЛАТНО
          </router-link>
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
        padding: 118px 0 90px;
        height: 500px;
        background: linear-gradient(64.96deg, #C1240F 0%, #EE5742 100%);
        color: #fff;
        .overlay {
          width: 50%;
          background: url('../../assets/images/home/bg_easier.png') left center/cover no-repeat;
        }
      }

      &.footer {
        background: #fff;
        padding: 118px 0;
        .col-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: row;
          flex-wrap: wrap;
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
  }
</style>
