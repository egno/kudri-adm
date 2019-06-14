<template>
  <section id="news" class="news home-section">
    <div class="main-page__container">
      <div class="main-page__section-header _news" />
      <MobileMenu />
      <div class="home-section__content">
        <h2 class="main-page__heading">
          <div>
            Обновления системы версии {{ news[0].version }} от {{ news[0].date }}
          </div>
          <div>
            <span
              v-for="(item, i) in activeNews"
              :key="i"
              :class="item.class"
              class="news__indicator"
            />
          </div>
        </h2>
        <div class="home-section__text">
          <Accordion class="critical">
            <template slot="heading">
              Критическое обновление
            </template>
            <template slot="content">
              <ul>
                <li class="update-item">
                  <h3>Добавлена главная страница</h3>
                  <p>
                    Теперь при входе по ссылке uno.salon вы попадаете на главную страницу.
                    На этой странице вы можете ознакомиться с ответами на популярные вопросы и просмотреть изменения в работе системы.
                    Переход на главную страницу всегда доступен из вашего личного кабинета.
                    Возврат в ваш личный кабинет также доступен с главной страницы по нажатию на название вашей компании.
                  </p>
                </li>
                <li>
                  <h3>Скорректировано поведение виджета для пользователей iOS</h3>
                  <p>Скорректировано поведение виджета записи для пользователей браузера Safari</p>
                </li>
              </ul>
            </template>
          </Accordion>

          <Accordion class="visual">
            <template slot="heading">
              Визуал
            </template>
            <template slot="content">
              <ul>
                <li class="update-item">
                  <h3>Корректировка мобильных версий программы для iOS и Android: </h3>
                  <ul>
                    <li class="li-text">
                      Адаптирована ширина полей
                    </li>
                    <li class="li-text">
                      Скорректировано отображение боковых полей и функциональных кнопок для пользователей iOS
                    </li>
                  </ul>
                </li>
              </ul>
            </template>
          </Accordion>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Accordion from '@/components/common/Accordion.vue'
  import MobileMenu from '@/components/home/MobileMenu'

  export default {
    name: 'News',
    components: {
      Accordion,
      MobileMenu
    },
    data () {
      return {
        news: [
          {
            version: '1.0.4',
            date: '17.06.2019',
            items: [
              { class: 'critical', color: '#EF4D37', active: true },
              { class: 'visual', color: '#5BCD5E', active: true },
              { class: 'visit-log', color: '#5699FF', active: false },
              { class: 'additional', color: '#07101C', active: false },
              { class: 'stats', color: '#C9A15D', active: false },
            ]
          }

        ]
      }
    },
    computed: {
      activeNews () {
        const latestNews = this.news[0]

        return latestNews.items.filter(n => n.active)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/styles/home-section';
  $indicators: (
    critical: #EF4D37,
    visual: #5BCD5E,
    visit-log: #5699FF,
    additional: #07101C,
    stats: #C9A15D
  );

  .news {
    &__indicator {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 14px;
      @each $status, $color in $indicators {
        &.#{$status} {
          background: $color;
        }
      }
    }
    .main-page__heading {

    }

    .accordion {
      .accordion__container {
        padding: 0 23px 0 36px;
      }
      &.critical {
        .accordion__header {
          background: #EF4D37;
        }
        &._expanded .accordion__header {
          border-bottom-color: #EF4D37;
        }
      }

      &.visual {
        .accordion__header {
          background: #5BCD5E;
        }
        &._expanded .accordion__header {
          border-bottom-color: #5BCD5E;
        }
      }

      &.visit-log {
        .accordion__header {
          background: #5699FF;
        }
        &._expanded .accordion__header {
          border-bottom-color: #5699FF;
        }
      }

      &.additional {
        .accordion__header {
          background: #07101C;
        }
        &._expanded .accordion__header {
          border-bottom-color: #07101C;
        }
      }

      &.stats {
        .accordion__header {
          background: #C9A15D;
        }
        &._expanded .accordion__header {
          border-bottom-color: #C9A15D;
        }
      }

      .update-item {
        margin: 30px 0;
      }
    }
  }
</style>
