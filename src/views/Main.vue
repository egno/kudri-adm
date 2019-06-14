<template>
  <div class="main-page">
    <template v-if="$route.name === 'faq'">
      <Faq />
    </template>
    <template v-else-if="$route.name === 'news'">
      <News />
    </template>
    <template v-else>
      <section class="main-page__first">
        <div class="main-page__container">
          <h2 class="main-page__subheading">
            Оптимизируй процессы –  <br> и занимайся любимым делом
          </h2>
          <h1 class="main-page__heading">
            Новая система учета <br class="main-page__heading-br">  для индустрии красоты <br class="main-page__heading-br"> и здоровья
          </h1>
          <router-link :to="{ name: 'register' }" class="main-page__register-link">
            ПОПРОБУЙТЕ ДЕМО-ВЕРСИЮ БЕСПЛАТНО
          </router-link>
          <div class="main-page__scroll">
            <span>Вниз</span>
          </div>
        </div>
      </section>
      <MobileMenu />
      <section id="about" class="about">
        <div class="main-page__container">
          <div class="main-page__section-header _about" />
          <div class="about__text">
            <div class="about__left">
              <blockquote class="about__quote">
                «Кто весь день работает, тому некогда зарабатывать деньги»
              </blockquote>
              <cite class="about__cite">Джон Рокфеллер</cite>
            </div>
            <div class="about__right">
              <h2 class="about__heading">
                Идея
              </h2>
              <p>Идея проекта родилась у лидера нашей команды, <i>Власова Юрия Сергеевича</i>, во время прохождения тренинга у Оскара Хартманна.</p>

              <h2 class="about__heading">
                Трудности индустрии
              </h2>
              <p>
                В первую очередь мы собрали команду специалистов и начали общаться
                с представителями beauty-бизнеса, выслушали все боли и страхи, каждое желание и мнение.
              </p>
              <p>
                Оказалось, что самая главная трудность у бизнеса – это большие объемы рутины
                и отсутствие простого и понятного инструмента для ведения отношений с клиентами. Менеджеры и администраторы
                уделяют очень много времени бумагам и процессами, а не общению с клиентами.
              </p>

              <h2 class="about__heading">
                Решение проблемы
              </h2>
              <p>
                Так родилась <b>UNO CRМ.</b> Мы поняли: для того, чтобы пространство работало и клиенты могли общаться с любым мастером или салоном,
                нам нужно достичь очень амбициозной цели – оцифровать beauty-рынок России.
              </p>
              <p>
                Ведь с каждым днем все сферы нашей жизни все активнее уходят в web-пространство, и нужно сделать этот переход комфортным
                и удобным как для бизнеса, так и для клиентов компаний.
              </p>

              <h2 class="about__heading">
                Наша миссия
              </h2>
              <blockquote class="">
                «Мы экономим время и силы сотрудников компаний beauty-индустрии для того, чтобы они могли вкладывать их в самую важную цель – сделать этот мир прекраснее»
              </blockquote>
              <p>
                Теперь наша система доступна каждому салону, вне зависимости от его размеров и возможностей. И для того, чтобы ее использовать,
                нужно лишь любое устройство с выходом в интернет.
              </p>
            </div>
          </div>
          <div class="target-audience">
            <h2 class="main-page__heading">
              Для кого разработана система UNO CRM
            </h2>
            <ul class="target-audience__list">
              <li class="target-audience__item beauty">
                <div>САЛОНЫ КРАСОТЫ</div>
              </li>
              <li class="target-audience__item spa">
                <div>SPA-ЦЕНТРЫ</div>
              </li>
              <li class="target-audience__item cosmetic">
                <div>КЛИНИКИ КОСМЕТОЛОГИИ</div>
              </li>
              <li class="target-audience__item massage">
                <div>КАБИНЕТЫ МАССАЖА</div>
              </li>
              <li class="target-audience__item barbershop">
                <div>ПАРИКМАХЕРСКИЕ И БАРБЕРШОПЫ</div>
              </li>
              <li class="target-audience__item manicure">
                <div>МАНИКЮРНЫЕ САЛОНЫ</div>
              </li>
              <li class="target-audience__item lash">
                <div>LASH- И BROW-КАБИНЕТЫ</div>
              </li>
              <li class="target-audience__item solarium">
                <div>СТУДИИ ЗАГАРА </div>
              </li>
              <li class="target-audience__item tattoo">
                <div>ТАТУ-САЛОНЫ</div>
              </li>
              <li class="target-audience__item epilation">
                <div>КАБИНЕТЫ ЭПИЛЯЦИИ</div>
              </li>
            </ul>
            <router-link :to="{ name: 'register' }" class="main-page__register-link">
              ЗАРЕГИСТРИРОВАТЬ СЕЙЧАС
            </router-link>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  import Faq from "../components/home/Faq"
  import News from "../components/home/News"
  import MobileMenu from "../components/home/MobileMenu"

export default {
  components: {
    Faq,
    MobileMenu,
    News
  },
  methods: {
  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';
  $header-height: 91px;
  $padding-top: 53px; 
  $saloons: beauty spa cosmetic massage barbershop manicure lash solarium tattoo epilation;
  $min-height: 660px;

  @keyframes shake {
    100% {
      transform: translateY(-4px);
    }
  }

  @mixin dots {
    position: absolute;
    top: 386px;
    right: 90px;
    content: '';
    width: 118px;
    height: 86px;
    background: url('../assets/images/dots.png') center/contain no-repeat;
  }

  @mixin circle {
    content: '';
    position: absolute;
    width: 304px;
    height: 304px;
    border-radius: 50%;
    box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.05);
  }


  .main-page {
    height: 100%;
    padding-top: $padding-top;
    background: #fff;
    @media only screen and (min-height : $min-height) and (min-width : $desktop) {
      $padding-top: 96px;
      padding-top: $padding-top;
    }
    &__container {
      width: 100%;
      max-width: 1496px;
      margin: 0 auto;
    }
    &__section-header {
      height: 30px;
      margin-left: 20px;
      margin-bottom: 30px;
      background-position: left center;
      background-repeat: no-repeat;
      background-size: contain;
      @media only screen and (min-width : $tablet) {
        margin-left: 40px;
        margin-bottom: 70px;
      }
      @media only screen and (min-width : $desktop) {
        margin-left: 172px;
        height: 60px;
        margin-bottom: 90px;
      }
      &._about {
        background-image: url('../assets/images/svg/about.svg');
      }
      &._faq {
        background-image: url('../assets/images/svg/faq.svg');
      }
      &._news {
        background-image: url('../assets/images/svg/news.svg');
      }
    }
    &__first {
      height: calc(100vh - #{$header-height + $padding-top});
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 55px;
      background: url('../assets/images/bg_home_first.png') center/cover no-repeat;
      @media only screen and (min-height : $min-height) {
        padding-bottom: 65px;
      }
      @media only screen and (min-width : $tablet) {
        height: calc(100vh - #{$header-height + $padding-top} - 60px);
        align-items: flex-start;
        background-image: url('../assets/images/bg_home_first_tablet.png');
      }
      @media only screen and (min-width : $desktop) {
        position: relative;
        $header-height: 146px;
        $padding-top: 96px;
        height: calc(100vh - #{$header-height + $padding-top} - 42px);
        background-image: url('../assets/images/bg_home_first_desktop.png');
      }
      @media only screen and (min-width : 1920px) {
        background-image: url('../assets/images/bg_home_first_wide.png');
      }
      .main-page__heading {
        @media only screen and (min-width : $desktop) { 
          color: transparent;
          background: url('../assets/images/main_heading_desktop.png') left center/contain no-repeat;
        }
      }
      .main-page__container {
        position: relative;
        @media only screen and (min-width : $tablet) {
          padding-left: 80px;
        }
        @media only screen and (min-width : $desktop) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding-left: 280px;
          &:before {
            @include dots;
            right: 207px;
            top: -65px;
          }
        }
        @media only screen and (min-width: 1440px) {

          &:after {
            position: absolute;
            right: 134px;
            width: 2px;
            height: calc(100% + 180px);
            top: -76px;
            content: '';
            background-color: #07101C;
          }
        }
      }
      .main-page__register-link {
        @media only screen and (min-width : $tablet) {
          margin: 0;
        }
      }
      .main-page__heading {
        margin-bottom: 4vh;
        @media only screen and (min-height : $min-height) {
          margin-bottom: 53px;
        }
      }
    }
    &__heading {
      margin-bottom: 17px;
      text-align: center;
      font-weight: 700;
      font-size: 30px;
      @media only screen and (min-width : $tablet) {
        text-align: left;
      }
    }
    &__subheading {
      margin-bottom: 4vh;
      text-align: center;
      font-weight: 700;
      font-size: 18px;
      @media only screen and (min-width : $tablet) {
        text-align: left;
      }
    }
    &__register-link {
      display: flex;
      width: 91%;
      max-width: 339px;
      height: 68px;
      margin: auto;
      padding: 0 48px;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%) #b69768;
      color: #FFFFFF;
      text-decoration: none;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      transition: background-color 0.6s 0s;
      @media only screen and (min-width : $tablet) {
        max-width: 447px;
      }
      &:hover {
        background-color: #07101C;
        background-image: none;
      }
    }
    &__scroll {
      display: none;
      position: absolute;
      top: 120%;
      left: 0;
      right: 0;
      margin: auto;
      padding-left: 45px;
      height: 44px;
      background: url('../assets/images/scroll.png') center/contain no-repeat transparent;
      transform: translateY(10px);
      animation: shake .7s ease alternate infinite;
      @media only screen and (min-height : $min-height) {
        display: block;
      }
      @media only screen and (min-height : $min-height) and (min-width : $tablet) {
        background-position: left;
        left: 185px;
        margin: 0;
        display: flex;
        align-items: center;
      }
      @media only screen and (min-height : $min-height) and (min-width : $desktop) {
        top: 99%;
        left: 360px;
      }
      span {
        display: none;
        font-weight: 700;
        @media only screen and (min-width : $tablet) {
          display: inline;
        }
      }
    }
    section {
      margin-bottom: 20px;
    }
    
    .target-audience {
      padding: 0 6px;
      @media only screen and (min-width : $tablet) {
        margin-top: 55px;
      }
      @media only screen and (min-width : $desktop) {
        margin-bottom: 30px;
      }
      &__list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 15px;
        padding: 0;
        justify-content: center;
        list-style: none;
      }
      &__item {
        width: 158px;
        margin: 0 11px 60px;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
        @media only screen and (min-width : $desktop) {
          margin: 0 45px 60px;
        }
        @media only screen and (min-width : 1920px) {
          margin: 0 68px 60px;
        }
        &:before {
          display: inline-block;
          width: 150px;
          height: 150px;
          margin-bottom: 20px;
          content: '';
        }
        @each $saloon in $saloons {
          &.#{$saloon}:before {
            background: url('../assets/images/#{$saloon}.png') center/contain no-repeat;
          }
        }    
        div {
          height: 38px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }  
        
      }
      .main-page__heading {
        margin-bottom: 55px;
        padding-left: 14px;
        text-align: left;
        @media only screen and (min-width : $desktop) {
          margin-bottom: 80px;
        }
      }
      .main-page__register-link {
        margin: 0 auto;
      }
    }
    .about {
      padding-bottom: 50px;
      &__text {
        padding: 0 20px 0 48px;
        @media only screen and (min-width : $desktop) {
          display: flex;
          padding-left: 142px;
          margin-bottom: 80px;
        }
      }

      &__left {
        @media only screen and (min-width : $tablet) {
          padding-left: 30px;
        }
        @media only screen and (min-width: $desktop) {
          position: relative;
          width: 39%;
          &:before {
            @include circle;
            top: 200px;
            left: 15%;
          }
          &:after {
            @include dots;
          }
        }
      }
      &__right {
        @media only screen and (min-width : $tablet) {
          position: relative;
          width: 64%;
          padding: 0 0 34px 90px;
          &:after {
            position: absolute;
            width: 110px;
            height: 2px;
            left: 30px;
            top: 100%;
            background: #C9A15D;
            content: '';
          }
        }
        @media only screen and (min-width: $desktop) {
          position: relative;
          width: 40%;
          &:before {
            @include circle;
            width: 470px;
            height: 470px;
            top: 490px;
            left: 455px;
          }
        }
      }
      &__heading {
        margin: 33px 0 22px;
      }
      &__quote {
        width: 90%;
        margin-bottom: 30px;
        font-weight: 700;
        font-size: 30px;
        @media only screen and (min-width : $tablet) {
          max-width: 460px;
        }
        @media only screen and (min-width : $desktop) {
          max-width: 390px;
        }
      }
      &__cite {
        font-weight: 700;
        font-size: 16px;
        font-style: normal;
      }
      .main-page__heading {
        max-width: 363px;
        @media only screen and (min-width : $desktop) {
          margin-left: 152px;
        }
      }
    }
  }
  
</style>

