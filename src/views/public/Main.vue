<template>
  <Layout>
    <section class="main-page__first">
      <div class="main-page__first-top">
        <div class="main-page__container">
          <h2 class="main-page__subheading">
            Оптимизируйте процессы –  <br> и занимайтесь любимым делом
          </h2>
          <h1 class="main-page__heading">
            НОВАЯ СИСТЕМА УЧЕТА <br> ДЛЯ ИНДУСТРИИ КРАСОТЫ
          </h1>
          <router-link :to="{ name: 'register' }" class="main-page__register-link">
            ПОЛЬЗУЙТЕСЬ БЕСПЛАТНО
          </router-link>
          <a
            v-smooth-scroll
            href="/#product"
            class="main-page__scroll"
          >
            <span>УЗНАЙТЕ БОЛЬШЕ</span>
          </a>
        </div>
      </div>
      <div class="main-page__first-bottom">
        <ul class="main-page__links">
          <li class="main-page__link">
            <a target="_blank" href="https://vk.com/unocrm" class="vk" />
          </li>
          <li class="main-page__link">
            <a target="_blank" href="https://www.instagram.com/crm_uno/" class="fb" />
          </li>
          <li class="main-page__link">
            <a target="_blank" href="https://www.facebook.com/unocrm" class="ig" />
          </li>
        </ul>
      </div>
    </section>
    <section id="product" class="fits">
      <div class="target-audience">
        <h2 class="main-page__heading">
          КОМУ ПОДОЙДЕТ <br> СИСТЕМА UNO.CRM?
        </h2>
        <ul class="target-audience__list">
          <li class="target-audience__item beauty">
            <div>САЛОНЫ КРАСОТЫ</div>
          </li>
          <li class="target-audience__item spa _one-line">
            <div>SPA-ЦЕНТРЫ</div>
          </li>
          <li class="target-audience__item cosmetic">
            <div>КЛИНИКИ КОСМЕТОЛОГИИ</div>
          </li>
          <li class="target-audience__item hairdressers _one-line">
            <div>ПАРИКМАХЕРСКИЕ</div>
          </li>
          <li class="target-audience__item barbershop _one-line">
            <div>БАРБЕРШОПЫ</div>
          </li>
          <li class="target-audience__item massage">
            <div>КАБИНЕТЫ МАССАЖА</div>
          </li>
          <li class="target-audience__item tattoo _one-line">
            <div>ТАТУ-САЛОНЫ</div>
          </li>
          <li class="target-audience__item lash">
            <div>LASH- И <br> BROW-КАБИНЕТЫ</div>
          </li>
          <li class="target-audience__item manicure">
            <div>МАНИКЮРНЫЕ САЛОНЫ</div>
          </li>
          <li class="target-audience__item epilation">
            <div>КАБИНЕТЫ ЭПИЛЯЦИИ</div>
          </li>
          <li class="target-audience__item individual">
            <div>ЧАСТНЫЕ МАСТЕРА</div>
          </li>
          <li class="target-audience__item solarium">
            <div>СТУДИИ ЗАГАРА </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="pricing type-1">
      <div class="content-wrapper">
        <div class="content">
          <div class="text-wrapper layer-1">
            <div class="main-page__heading">
              ПОЛЬЗУЙТЕСЬ<br>БЕСПЛАТНО!
            </div>
            <div class="subheader">
              Мы любим своих клиентов.<br>
              Никакого навязанного сервиса.
            </div>
            <div class="text">
              Пройдите простую регистрацию и получите возможности развития и оптимизации ваших бизнес-процессов.<br>
              <ul>
                <li>Управляйте сотрудниками онлайн</li>
                <li>Ведите запись в онлайн-журнале</li>
                <li>Уведомляйте клиентов о новой записи</li>
                <li>Храните историю записей клиентов</li>
                <li>Контролируйте рабочие процессы из любой точки мира</li>
              </ul>
              <div class="desktop">
                Все это и другие полезные инструменты уже ждут вас в базовой версии UNO.CRM.
                А если вам не хватит стандартного функционала, просто добавьте действительно нужные вам платные модули и не платите за подписки и каждого мастера отдельно.
              </div>
            </div>
            <router-link :to="{ name: 'home' }" class="inner-link layer-1">
              ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="integration type-2">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            ВНЕДРЕНИЕ<br>ВСЕГО ЗА 2 ЧАСА
          </div>
          <div class="subheader">
            Экономия времени и сил.
          </div>
          <p class="text">
            Мы создали систему максимально простой и удобной,
            чтобы ваши сотрудники смогли легко освоить ее,
            даже если до этого они никогда не работали в CRM.
            <br><br>
            А если вам понадобится помощь, просто напишите
            в поддержку. Наш менеджер свяжется с вами
            и поможет разобраться со всеми вопросами.
          </p>
        </div>
      </div>
    </section>

    <section class="clients type-3">
      <div class="content">
        <div class="text-wrapper layer-1">
          <div class="main-page__heading">
            О КЛИЕНТАХ<br>В ПЕРВУЮ ОЧЕРЕДЬ
          </div>
          <div class="subheader">
            Они скажут вам&nbsp;«Спасибо!» за&nbsp;заботу.
          </div>
          <div class="text">
            В нашем мире невозможно все держать в голове. Поэтому мы разработали несколько инструментов,
            которые помогут вам держать свою базу клиентов в актуальном состоянии, расширять ее и удерживать.
          </div>
          <router-link :to="{ name: 'home' }" class="inner-link layer-1">
            ПОДРОБНЕЕ О РАБОТЕ С КЛИЕНТАМИ БИЗНЕСА
          </router-link>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/public/Layout.vue'

export default {
  components: {
    Layout,
  },
}
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  $header-height: 80px;
  $padding-top: 53px;
  $min-height: 660px;

  $saloons: beauty spa cosmetic hairdressers barbershop massage tattoo lash manicure epilation individual solarium;

  .main-page-sections {
    section {
      &.pricing {
        height: 770px;
        @media only screen and (min-width : $tablet) {
          height: 728px;
          padding-left: 40px;
        }
        @media only screen and (min-width : $desktop) {
          height: 978px;
        }
        @media only screen and (min-width : $wide) {
          height: 1000px;
        }

        .content-wrapper {
          background: url('../../assets/images/home/bg_pricing.png') right bottom/auto 50% no-repeat #fff;
          @media only screen and (min-width : $tablet) {
            background: url('../../assets/images/home/bg_pricing.png') 90% 100px/65% no-repeat #fff;
          }
          @media only screen and (min-width : $desktop) {
            background-size: 60%;
          }
          @media only screen and (min-width : $wide) {
            background-size: 50% auto;
            background-position: right 80px;
          }

        }
      }

      &.clients {
        height: 500px;
        background: url('../../assets/images/home/bg_clients.png') 100px bottom/contain no-repeat #fff;
        @media screen and (min-width: $tablet) {
          background-position: right bottom;
        }
        @media screen and (min-width: $desktop) {
          height: 755px;
        }
        .subheader {
          max-width: 80%;
          @media screen and (min-width: $tablet) {
            max-width: none;
          }
        }
        .text {
          max-width: 60%;
          @media screen and (min-width: $tablet) {
            max-width: none;
          }
        }

      }
    }
  }

  .main-page__first {
    height: calc(100vh - #{$header-height});
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: url('../../assets/images/bg_home_first.png') center 100%/100% auto no-repeat #fff;
    background-origin: content-box;
    @media only screen and (min-width : $tablet) {
      padding-bottom: 60px;
      align-items: flex-start;
      background: url('../../assets/images/bg_home_first_tablet.png') center/100% no-repeat #fff;
    }
    @media only screen and (min-width : $desktop) {
      $header-height: 146px;
      height: calc(100vh - #{$header-height});
      position: relative;
      background: url('../../assets/images/bg_home_first_desktop.png') center bottom/100% auto no-repeat #fff;
    }
    @media only screen and (min-width : $wide) {
      background: url('../../assets/images/bg_home_first_wide.png') center top/cover no-repeat #fff;
    }
    .main-page__first-top {
      flex-grow: 1;
      display: flex;
      align-items: center;
    }
    .main-page__first-bottom {
      @media only screen and (min-width : $tablet) {
        padding-left: 109px;
      }
      @media only screen and (min-width : $desktop) {
        padding-left: 172px;
      }
      @media only screen and (min-width : $wide) {
        padding-left: 363px;
      }
    }
    .main-page__container {
      position: relative;
      padding-left: 48px;
      @media only screen and (min-width : $tablet) {
        padding-left: 109px;
      }
      @media only screen and (min-width : $desktop) {
        padding-left: 172px;
      }
      @media only screen and (min-width : $wide) {
        padding-left: 363px;
      }
    }
    .main-page__heading {
      margin-bottom: 5vh;
      @media only screen and (min-width : $tablet) {
        max-width: 570px;
      }
      @media only screen and (min-width : $desktop) {
        max-width: none;
        margin-bottom: 45px;
      }
    }
    .main-page__subheading {
      font-size: 16px;
      font-weight: 300;
      margin-bottom: 16px;
      @media only screen and (min-width : $tablet) {
        margin-bottom: 50px;
        font-size: 24px;
      }
    }
    .main-page__register-link {
      display: inline-flex;
      margin: 0;
    }
  }
  .target-audience {
    padding: 100px 6px 0;
    @media only screen and (min-width : $tablet) {
      margin-top: 55px;
    }
    @media only screen and (min-width : $desktop) {
      margin-bottom: 30px;
      padding-top: 150px;
    }
    &__list {
      display: flex;
      max-width: 1286px;
      flex-wrap: wrap;
      margin: 0 auto 42px;
      padding: 0;
      justify-content: center;
      list-style: none;
    }
    &__item {
      width: 158px;
      margin: 0 11px 57px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      @media only screen and (min-width : $tablet) {
        margin: 0 22px 57px;
      }
      @media only screen and (min-width : $desktop) {
        margin: 0 38px 57px;
      }
      @media only screen and (min-width : $wide) {
        margin: 0 19px 57px;
      }
      &:before {
        display: inline-block;
        width: 90px;
        height: 90px;
        margin-bottom: 13px;
        content: '';
        border-radius: 50%;
        box-shadow: 0px 7px 20px rgba(0, 0, 0, 0.05);
      }
      @each $saloon in $saloons {
        &.#{$saloon}:before {
          background: url('../../assets/images/svg/#{$saloon}.svg') center/contain no-repeat;
        }
      }

      div {
        height: 38px;
      }

      &._one-line {
        div {
          padding-top: 1px;
        }
      }
      &.beauty,
      &.individual,
      &.solarium {
        padding: 0 15px;
      }

    }
    .main-page__heading {
      margin-bottom: 30px;
      padding-left: 42px;
      text-align: left;
      @media only screen and (min-width : $tablet) {
        margin-bottom: 95px;
        padding-left: 103px;
      }
      @media only screen and (min-width : $desktop) {
        padding-left: 166px;
      }
      @media only screen and (min-width : $wide) {
        padding-left: 357px;
      }
    }
    .main-page__register-link {
      margin: 0 auto;
    }
  }
  .main-page__register-link {
    display: flex;
    width: 86%;
    max-width: 280px;
    height: 68px;
    margin: auto;
    padding: 0 30px;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%) #b69768;
    color: #FFFFFF;
    text-decoration: none;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.6s 0s;
    &:hover {
      background-color: #07101C;
      background-image: none;
      text-decoration: none !important;
    }
  }
  .main-page__scroll {
    display: inline-flex;
    justify-content: center;
    width: 86%;
    max-width: 280px;
    margin-top: 45px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    color: #07101C !important;
    text-decoration: none !important;
  }
  .main-page__links {
    display: flex;
    width: 207px;
    padding: 26px 0;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    @media only screen and (min-width : $tablet) {
      width: 214px;
    }
  }
  .main-page__link {
    a {
      display: inline-flex;
      &.vk {
        width: 28px;
        height: 16px;
        background: url('../../assets/images/svg/vk.svg') center/contain no-repeat;
      }
      &.fb {
        width: 16px;
        height: 29px;
        background: url('../../assets/images/svg/fb.svg') center/contain no-repeat;
      }
      &.ig {
        width: 27px;
        height: 27px;
        background: url('../../assets/images/ig.png') center/contain no-repeat;
      }
    }
  }
</style>
