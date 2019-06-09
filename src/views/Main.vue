<template>
  <div class="main-page">
    <section class="main-page__first">
      <div class="main-page__container">
        <h1 class="main-page__heading">
          Новая система учета <br class="main-page__heading-br">  для индустрии красоты <br class="main-page__heading-br"> и здоровья        
        </h1>
        <h2 class="main-page__subheading">
          Оптимизируй процессы –  <br> и занимайся любимым делом
        </h2>
        <router-link :to="{ name: 'register' }" class="main-page__register-link">
          ПОПРОБУЙТЕ ДЕМО-ВЕРСИЮ БЕСПЛАТНО
        </router-link>
      </div>     
      <div class="main-page__scroll">
        <span>Вниз</span>
      </div> 
    </section>

    <v-layout id="home-menu" justify-start row class="home-menu">
      <button type="button" :class="['home-menu__activator', { active: isMenuVisible }]" @click="isMenuVisible = !isMenuVisible">
        <span>Меню</span>
      </button>
      <v-expand-x-transition>
        <div v-show="isMenuVisible" class="home-menu__items">
          <a
            v-for="(item, i) in menuItems"
            :key="i"
            v-smooth-scroll
            :href="item.hash"
          >
            {{ item.title }}
          </a>
        </div>
      </v-expand-x-transition>
    </v-layout>

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

    <section id="faq" class="faq">
      <div class="main-page__container">
        <div class="main-page__section-header _faq" />
        <div class="faq__content">
          <h2 class="main-page__heading">
            Все, что вы хотели узнать об UNO CRM
          </h2>
          <div class="faq__text">
            <Accordion>
              <template slot="heading">
                Для кого подойдет эта система?
              </template>
              <template slot="content">
                <p>
                  <b>UNO.CRM</b> разработана специально для beauty-индустрии.
                </p>
              </template>
            </Accordion>
            <Accordion>
              <template slot="heading">
                Сколько стоит?
              </template>
              <template slot="content">
                <p>
                  Прямо сейчас Вы можете получить <b>UNO.CRM </b>  <router-link :to="{ name: 'register' }">
                    совершенно бесплатно
                  </router-link>. 
                </p>
                <p>
                  Платой за использование для нас будет Ваша обратная связь, а также мнение о новом функционале нашей системы. 
                </p>
              </template>
            </Accordion>
            <Accordion>
              <template slot="heading">
                Какие возможности предоставляет UNO CRM?
              </template>
              <template slot="content">
                <p> 
                  В нашей системе Вы получаете все необходимое  для качественного ведения клиентов:            
                </p>
                <p>
                  <ul>
                    <li>Онлайн-запись клиентов из социальных сетей и Вашего сайта</li>
                    <li>Журнал записи клиентов по мастерам </li>
                    <li>Графики сотрудников</li>
                    <li>Задачи и напоминания для сотрудников</li>
                    <li>Удобная клиентская база и история посещений</li>
                    <li>Sms-уведомления и напоминания для клиентов</li>
                  </ul>
                </p>
              </template>
            </Accordion>
            <Accordion>
              <template slot="heading">
                Насколько сложно ее внедрить в бизнес?
              </template>
              <template slot="content">
                <p>
                  Система создана максимально простой и удобной, ее настройка и внедрение в работу займет не более двух часов. 
                </p>
                <p>
                  А также у Вас будет личный менеджер, который будет готов помочь по любому вопросу в кратчайшие сроки.
                </p>             
              </template>
            </Accordion>
            <Accordion>
              <template slot="heading">
                Боюсь хранить данные в облаке, это безопасно?
              </template>
              <template slot="content">
                <p>
                  Наша компания несет ответственность за сохранение Ваших данных. 
                </p>
                <p>
                  Регистрируясь в системе, Вы подписываете 
                  <a href="https://docs.google.com/document/d/1Ioe9v58FGXfI7o1ExWPGR9aMkeYyU6LCJenMniPSsl4" target="_blank">договор оферты</a>
                  и <a href="https://docs.google.com/document/d/1JWxq7uHt7H9CKhqyJLIozc-JeAT9aNXUszZ1m2Dd4Os" target="_blank">политику конфиденциальности</a>.
                </p>
                <p>
                  С этого момента мы заботимся и сохраняем Ваши данные в безопасности, без права распространять, использовать без Вашего разрешения.
                </p>
              </template>
            </Accordion>
            <Accordion>
              <template slot="heading">
                Что будет после начального бесплатного периода?
              </template>
              <template slot="content">
                <p>
                  До сентября вы сможете использовать систему совершенно бесплатно. Также именно вы напрямую влияете на появление нового функционала 
                  и создание программы, оптимально подходящей именно для вашего бизнеса.
                </p>
                <p>
                  Начиная с сентября, вы сможете использовать <i>базовую версию продукта</i> бесплатно или выбрать для себя удобный пакет функционала.
                </p>
              </template>
            </Accordion>
          </div>
        </div>              
      </div>
    </section>
    <!-- <section id="news">
      <div class="main-page__container">
        <div class="main-page__section-header _news"></div>
        <ReleaseNotes v-for="(note, noteIndex) in news" :key="noteIndex" :note="note" />
      </div>
    </section> -->
  </div>
</template>

<script>
  // import ReleaseNotes from "../components/home/ReleaseNotes"
import Accordion from '@/components/common/Accordion.vue'

export default {
  components: {
    Accordion,
    // ReleaseNotes
  },
  data () {
    return {
      isMenuVisible: false,
      menuItems: [
        { title: 'О проекте', hash: '#about' },
        { title: 'Продукт', hash: '#faq' },
        { title: 'Новости', hash: '#news' },
      ],
      news: []
    }
  },
  computed : {
    windowHeight () {
      return document.documentElement.clientHeight - 73
    }
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

  @keyframes shake {
    100% {
      transform: translateY(-4px);    
    }
  }

  .main-page {
    height: 100%;
    padding-top: $padding-top;
    background: #fff;
    @media only screen and (min-width : $desktop) { 
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
      position: relative;
      height: calc(100vh - #{$header-height + $padding-top});
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 55px;
      background: url('../assets/images/bg_home_first.png') center/cover no-repeat;
      @media only screen and (min-width : $tablet) {
        height: calc(100vh - #{$header-height + $padding-top} - 60px);
        align-items: flex-start;
        background-image: url('../assets/images/bg_home_first_tablet.png');
      }
      @media only screen and (min-width : $desktop) { 
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
        @media only screen and (min-width : $tablet) {
          padding-left: 80px;
        }
        @media only screen and (min-width : $desktop) { 
          padding-left: 280px;
        }
      }
      .main-page__register-link {
        @media only screen and (min-width : $tablet) {
          margin: 0;
        }
      }
    }
    &__heading {
      margin-bottom: 17px;
      text-align: center;
      font-weight: 900;
      font-size: 30px;
      @media only screen and (min-width : $tablet) {
        text-align: left;
      }
    }
    &__subheading {
      margin-bottom: 53px;
      text-align: center;
      font-weight: bold;
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
      background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%);
      color: #FFFFFF;
      text-decoration: none;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      @media only screen and (min-width : $tablet) {
        max-width: 447px;
      }
    }
    &__scroll {
      position: absolute;
      bottom: 40px;
      left: 0;
      right: 0;
      margin: auto;
      padding-left: 45px; 
      height: 44px;
      background: url('../assets/images/scroll.png') center/contain no-repeat transparent;
      transform: translateY(10px);
      animation: shake .7s ease alternate infinite;
      @media only screen and (min-width : $tablet) {
        background-position: left;
        left: 185px;
        margin: 0;
        display: flex;
        align-items: center;
      }
      @media only screen and (min-width : $desktop) {
        left: 360px;
      }
      span {
        display: none;
        font-weight: bold;
        @media only screen and (min-width : $tablet) {
          display: inline;
        }
      }
    }
    section {
      margin-bottom: 20px;
    }
    .home-menu {
      padding-left: 20px;
      align-items: center;
      @media only screen and (min-width : $tablet) {
        display: none;
      }
      &__activator {
        height: 35px;
        padding-left: 40px;
        background: url('../assets/images/svg/home_menu.svg') center left no-repeat #fff;
        font-weight: bold;
        font-size: 16px;
        outline: none;

        span {
          display: block;
          margin-left: 30px;
          transition: width 0.3s;
          overflow: hidden;
        }
        &.active {
          background: url('../assets/images/svg/home_menu_open.svg') center left no-repeat #fff;

          span {
            width: 0;
          }
        }
      }
      &__items {
        height: 16px;
        overflow: hidden;
        a {
          color: #07101C;
          text-transform: uppercase;
          text-decoration: none;
        }
      }
      .v-menu__content {
        width: 100%;
      }
      .v-list {
        display: flex;
      }
    }
    .target-audience {
      padding: 0 6px;
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
        font-weight: bold;
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
      }
      .main-page__register-link {
        margin: 0 auto;
      }
    }
    .about {
      padding: 50px 0;
      &__text {
        margin-bottom: 55px;
        padding: 0 20px 0 48px;
        @media only screen and (min-width : $desktop) {
          display: flex;
          padding-left: 142px;
        }
      }
      &__left,
      &__right {
        @media only screen and (min-width : $desktop) {
          width: 39%;
        }
      }
      &__left {
        @media only screen and (min-width : $tablet) {
          padding-left: 30px;
        }
      }
      &__right {
        @media only screen and (min-width : $tablet) {
          width: 50%;
        }
      }
      &__heading {
        margin: 33px 0 22px;
      }
      &__quote {
        width: 90%;
        margin-bottom: 30px;
        font-weight: 900;
        font-size: 30px;
        @media only screen and (min-width : $tablet) {
          max-width: 460px;
        }
        @media only screen and (min-width : $desktop) {
          max-width: 390px;
        }
      }
      &__cite {
        font-weight: 900;
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
    .faq {
      &__content {
        @media only screen and (min-width : $desktop) {
          display: flex;
        }
      }
      &__text {
        max-width: 768px;
        padding: 0 20px;
        @media only screen and (min-width : $tablet) {
          padding: 0 40px;
        }
        @media only screen and (min-width : $desktop) {
          width: 607px; 
          margin-left: 50px;
        }
      }
      .main-page__heading {
        padding-left: 48px;
        text-align: left;
        @media only screen and (min-width : $tablet) {
          padding-left: 78px;
        }
        @media only screen and (min-width : $desktop) {
          width: 410px;
          padding-left: 172px;
        }
      }
    }
    .accordion {
      &__container { 
        background-color: transparent;
      }
      &._expanded .accordion__header {
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
      &__header {
        font-size: 16px;
        color: #fff;
        background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%);
        &:after {
          width: 12px;
          background-image: url('../assets/angle-down.svg');
        }
      }
      p {
        padding-top: 15px;
        margin-bottom: 0;
      }
      ul {
        list-style: none;
        font-weight: bold;
      }
      li {
        margin: 5px 0;
      }
    } 
    
  }
  
</style>

