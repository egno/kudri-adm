<template>
  <section id="news" class="news home-section">
    <div class="main-page__container">
      <div class="main-page__section-header _news" />
      <MobileMenu />
      <div class="home-section__content">
        <carousel
          ref="newsCarousel"
          :min-swipe-distance="25"
          :navigation-enabled="true"
          :navigate-to="news.length - 1"
          :pagination-enabled="false"
          :per-page="1"
          navigation-next-label=""
          navigation-prev-label=""
          @navigation-click="closeAccordions"
        >
          <slide>
            <h2 class="main-page__heading">
              <div>
                Обновления системы версии {{ news[2].version }} от {{ news[2].date }}
              </div>
              <div>
                <span
                  v-for="(indicator, i) in newsIndicators(news[2])"
                  :key="i"
                  :class="indicator.class"
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
                    <li class="update-item">
                      <h3>Исправлено отображение номеров телефонов в списке клиентов</h3>
                      <p>Теперь вы сможете видеть номера клиентов в формате +7 (XXX) XXX-XX-XX.</p>
                    </li>
                    <li class="update-item">
                      <h3>Добавлена возмозможность звонка из мобильной версии программы</h3>
                      <p>Теперь вы сможете найти клиента в списке и позвонить ему прямо из системы.</p>
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
                          Скорректировано поведение виджета для пользователей iOS
                        </li>
                        <li class="li-text">
                          Скорректировано отображение боковых полей и функциональных кнопок для пользователей iOS
                        </li>
                        <li class="li-text">
                          Скорректировано поведение журнала записей для пользователей iOS
                        </li>
                      </ul>
                    </li>
                  </ul>
                </template>
              </Accordion>
            </div>
          </slide>

          <slide>
            <h2 class="main-page__heading">
              <div>
                Обновления системы версии {{ news[1].version }} от {{ news[1].date }}
              </div>
              <div>
                <span
                  v-for="(indicator, i) in newsIndicators(news[1])"
                  :key="i"
                  :class="indicator.class"
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
                      <p>
                        В связи с работами по улучшению и упрощению сервиса смс-рассылок блок “Настройки” пока недоступен.
                        Все настроенные данные действуют в назначенном виде. Для изменения настроек обратитесь к вашему менеджеру.
                      </p>
                    </li>
                    <li class="update-item">
                      <p>
                        Добавлен пункт  “Реквизиты” на странице <router-link :to="{ name: 'faq' }">
                          “Продукт”
                        </router-link>.
                      </p>
                    </li>
                    <li class="update-item">
                      <p>
                        Добавлена Инструкция во вкладке “Насколько сложно ее внедрить в бизнес?” на странице
                        <router-link :to="{ name: 'faq' }">
                          “Продукт”
                        </router-link>
                        и будет всегда доступна для просмотра из страницы информации о вашей компании.
                      </p>
                    </li>
                    <li class="update-item">
                      <p>
                        Изменена механика возврата из филиала на уровень компании.
                        Теперь переход на уровень компании будет осуществляться по нажатию на значок “Домой” в верхней правой части экрана, рядом с вашим аватаром.
                      </p>
                    </li>
                  </ul>
                </template>
              </Accordion>

              <Accordion class="visit-calendar">
                <template slot="heading">
                  Журнал записи
                </template>
                <template slot="content">
                  <ul>
                    <li class="update-item">
                      <h3>Изменен режим графика “День”</h3>
                      <p>
                        Теперь график на день отображает столбцы сотрудников, для улучшения контроля нагрузки салона.
                      </p>
                    </li>

                    <li class="update-item">
                      <h3>Режим графика по умолчанию изменен на “День”</h3>
                      <p>
                        Теперь при переходе в журнал записи, в первую очередь вы будете видеть информацию о записях в текущий день, в настоящее время.
                      </p>
                    </li>

                    <li class="update-item">
                      <h3>Закреплено верхнее информационное поле журнала записи</h3>
                      <p>
                        Теперь при прокручивании журнала записи вниз, в зависимости от устройства будет отображаться следующая информация:
                      </p>
                      <ul>
                        <li class="li-text">
                          <h4>Версия для мобильных устройств:</h4>
                          <ul>
                            <li>
                              Отображается информация о выбранном сотруднике.
                            </li>
                          </ul>
                        </li>
                        <li class="li-text">
                          <h4>Десктоп версия:</h4>
                          <ul>
                            <li>В режиме “День” будут отображаться данные о выбранной дате и о сотрудниках работающих в этот день;</li>
                            <li>В режиме неделя будут отображаться даты текущей недели и информация о выбранном сотруднике.</li>
                          </ul>
                        </li>
                      </ul>
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
                      <h3>Изменение полей заполнений</h3>
                      <ul>
                        <li class="li-text">
                          Изменена цветовая гамма полей под заполнение;
                        </li>
                        <li class="li-text">
                          Изменена форма полей под заполнение.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </template>
              </Accordion>
            </div>
          </slide>

          <slide>
            <h2 class="main-page__heading">
              <div>
                Обновления системы версии {{ news[0].version }} от {{ news[0].date }}
              </div>
              <div>
                <span
                  v-for="(indicator, i) in newsIndicators(news[0])"
                  :key="i"
                  :class="indicator.class"
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
                      <p>
                        Добавлено автоматическое создание пользователя “Администратор компании”  по регистрационным данным.
                        Теперь, зарегистрировав свой бизнес, Вы автоматически становитесь администратором всей компании и Вам не нужно заполнять дополнительную информацию.
                      </p>
                    </li>
                    <li class="update-item">
                      <p>
                        Добавлено автоматическое заполнение первого филиала компании. Теперь, после заполнения информации о компании,
                        данные автоматически переносятся в первый филиал, и Вам не нужно заполнять информацию повторно.
                      </p>
                    </li>
                    <li class="update-item">
                      <p>
                        Удалена дополнительная проверка согласия с договором оферты при смене пароля.
                      </p>
                    </li>
                  </ul>
                </template>
              </Accordion>

              <Accordion class="visit-calendar">
                <template slot="heading">
                  Журнал записи
                </template>
                <template slot="content">
                  <ul>
                    <li class="update-item">
                      <p>
                        Добавлено автоматическое пролистывание журнала записи до текущего времени.
                        Теперь, заходя в журнал записи, Вы будете видеть ближайшие записи, и Вам не придется пролистывать ленту в поисках нужного времени.
                      </p>
                    </li>

                    <li class="update-item">
                      <p>
                        Добавлено изменение мастера, отображаемого в журнале в режиме “Неделя”, через стрелки навигации.
                        Для более быстрого просмотра журнала на неделю, вы можете выбирать сотрудников пролистыванием.
                      </p>
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
                    <li>
                      <p>
                        Изменено выделение сегодняшнего дня в журнале записи.
                      </p>
                    </li>
                    <li>
                      <p>
                        Изменено выделение выбранной даты в журнале записи.
                      </p>
                    </li>
                    <li>
                      <p>
                        Изменен цвет шрифта для дат будущего и прошлого месяца для мобильных устройств в журнале записи.
                      </p>
                    </li>
                  </ul>
                </template>
              </Accordion>
            </div>
          </slide>
        </carousel>
      </div>
    </div>
  </section>
</template>

<script>
  import Accordion from '@/components/common/Accordion.vue'
  import MobileMenu from '@/components/home/MobileMenu'
  import { Carousel, Slide } from 'vue-carousel'

  export default {
    name: 'News',
    components: {
      Accordion,
      MobileMenu,
      Carousel,
      Slide
    },
    data () {
      return {
        activeSlide: 0,
        news: [
          {
            version: '1.0.6',
            date: '01.07.2019',
            items: [
              { class: 'critical', color: '#EF4D37', active: true },
              { class: 'visit-calendar', color: '#5699FF', active: true },
              { class: 'visual', color: '#5BCD5E', active: true },
              { class: 'additional', color: '#07101C', active: false },
              { class: 'stats', color: '#C9A15D', active: false },
            ]
          },
          {
            version: '1.0.5',
            date: '24.06.2019',
            items: [
              { class: 'critical', color: '#EF4D37', active: true },
              { class: 'visit-calendar', color: '#5699FF', active: true },
              { class: 'visual', color: '#5BCD5E', active: true },
              { class: 'additional', color: '#07101C', active: false },
              { class: 'stats', color: '#C9A15D', active: false },
            ]
          },
          {
            version: '1.0.4',
            date: '17.06.2019',
            items: [
              { class: 'critical', color: '#EF4D37', active: true },
              { class: 'visit-calendar', color: '#5699FF', active: false },
              { class: 'visual', color: '#5BCD5E', active: true },
              { class: 'additional', color: '#07101C', active: false },
              { class: 'stats', color: '#C9A15D', active: false },
            ]
          }

        ]
      }
    },
    methods: {
      newsIndicators (newsItem) {
        return newsItem.items.filter(n => n.active)
      },
      closeAccordions () {
        const accordionHeaders = this.$el.querySelectorAll('.accordion._expanded .accordion__header')

        Array.from(accordionHeaders).forEach(el => el.click())
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/styles/home-section';
  $indicators: (
    critical: #EF4D37,
    visual: #5BCD5E,
    visit-calendar: #5699FF,
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

    .main-page__container {
      @media only screen and (min-width: 1440px) {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          width: 470px;
          height: 470px;
          top: 200px;
          right: 100px;
          border-radius: 50%;
          box-shadow: 0 4px 50px rgba(0, 0, 0, 0.05);
        }
      }
    }
    .home-section__text {
      flex-grow: 1;
      &:before {
        display: none;
      }
    }

    .VueCarousel-wrapper {
      min-height: 45vh;
    }

    .VueCarousel-slide {
      display: flex;
      flex-direction: column;
      @media only screen and (min-width : $desktop) {
        flex-direction: row;
      }
    }

    .VueCarousel-navigation {
      position: absolute;
      top: 100%;
      width: 98vw;
      display: flex;
      justify-content: center;
      margin: 40px 0;
    }

    .VueCarousel-navigation-button {
      position: static !important;
      width: 24px;
      height: 24px;
      margin: 0 5px !important;
      outline: none !important;
      background: url('../../assets/images/svg/down.svg') center no-repeat;
      border: 1px solid #07101C !important;
      border-radius: 50%;
    }

    .VueCarousel-navigation-prev {
      transform: rotate(90deg) !important;
    }

    .VueCarousel-navigation-next {
      transform: rotate(-90deg) !important;
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

      &.visit-calendar {
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

      a {
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
