<template>
  <div class="main-page">
    <section class="main-page__first">
      <h1 class="main-page__heading">
        Оптимизируй процессы и занимайся любимым делом
      </h1>
      <h2 class="main-page__subheading">
        Новая система учета для индустрии красоты и здоровья
      </h2>
      <router-link :to="{ name: 'register' }" class="main-page__register-link">
        ПОПРОБУЙТЕ ДЕМО-ВЕРСИЮ БЕСПЛАТНО
      </router-link>
    </section>
    <v-layout justify-start row class="home-menu">
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
    <section id="news">
      <ReleaseNotes v-for="(note, noteIndex) in news" :key="noteIndex" :note="note" />
    </section>
    <section id="about">
      <div>      
        <blockquote class="about__quote">
          «Кто весь день работает, тому некогда зарабатывать деньги»
        </blockquote> 
        <cite class="about__cite">Джон Рокфеллер</cite>

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
      <div class="target-audience">
        <h2 class="about__h3">
          Для кого разработана система UNO CRM
        </h2>
        <ul class="target-audience__list">
          <li class="target-audience__item">
            САЛОНЫ КРАСОТЫ
          </li>
          <li class="target-audience__item">
            SPA-ЦЕНТРЫ
          </li>
          <li class="target-audience__item">
            ЛИНИКИ КОСМЕТОЛОГИИ
          </li>
          <li class="target-audience__item">
            КАБИНЕТЫ МАССАЖА
          </li>
          <li class="target-audience__item">
            ПАРИКМАХЕРСКИЕ И БАРБЕРШОПЫ
          </li>
          <li class="target-audience__item">
            МАНИКЮРНЫЕ САЛОНЫ
          </li>
          <li class="target-audience__item">
            ТАТУ-САЛОНЫ
          </li>
          <li class="target-audience__item">
            КАБИНЕТЫ ЭПИЛЯЦИИ
          </li>
        </ul>
        <router-link :to="{ name: 'register' }" class="main-page__register-link">
          ЗАРЕГИСТРИРОВАТЬ СЕЙЧАС
        </router-link>
      </div>
    </section>
    <section id="faq" />
  </div>
</template>

<script>
  import ReleaseNotes from "../components/home/ReleaseNotes"

export default {
  components: {
    ReleaseNotes
  },
  data () {
    return {
      isMenuVisible: false,
      menuItems: [
        { title: 'Новости', hash: '#news' },
        { title: 'О проекте', hash: '#about' },
        { title: 'Продукт', hash: '#faq' },
      ],
      news: []
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
  @import '../assets/styles/common';

  .main-page {
    height: 100%;
    &__first {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url('../assets/images/bg_home_first.png') center/cover no-repeat;
      @media only screen and (min-width : $tablet) {
        background-image: url('../assets/images/bg_home_first_tablet.png');
      }
      @media only screen and (min-width : $desktop) {
        background-image: url('../assets/images/bg_home_first_desktop.png');
      }
      @media only screen and (min-width : 1920px) {
        background-image: url('../assets/images/bg_home_first_wide.png');
      }
    }
  }
  .home-menu {
    align-items: center;
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
    &__list {
      list-style: none;
      padding: 0;
    }
  }
</style>

