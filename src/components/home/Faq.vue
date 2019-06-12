<template>
  <section id="faq" class="faq">
    <div class="main-page__container">
      <div class="main-page__section-header _faq" />
      <MobileMenu />
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
</template>

<script>
  import Accordion from '@/components/common/Accordion.vue'
  import MobileMenu from '@/components/home/MobileMenu'

  export default {
    components: {
      Accordion,
      MobileMenu
    },
  }
</script>

<style lang="scss">
  @import '../../assets/styles/common';

  @mixin dots {
    position: absolute;
    top: 260px;
    left: 172px;
    content: '';
    width: 118px;
    height: 86px;
    background: url('../../assets/images/dots.png') center/contain no-repeat;
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
      @media only screen and (min-width: 1440px) {
        position: relative;
        margin-left: 230px;
        &:before {
          content: '';
          position: absolute;
          width: 470px;
          height: 470px;
          top: 0;
          left: 400px;
          border-radius: 50%;
          box-shadow: 0 4px 50px rgba(0, 0, 0, 0.05);
        }
      }
    }
    .main-page__heading {
      padding-left: 48px;
      text-align: left;
      @media only screen and (min-width : $tablet) {
        max-width: 410px;
        padding-left: 78px;
      }
      @media only screen and (min-width : $desktop) {
        position: relative;
        padding-left: 172px;
        &:after {
          @include dots;
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
        font-weight: 400;
        font-size: 16px;
        color: #fff;
        background: linear-gradient(90deg, #C9A15D 0%, #BA9462 100%);
        &:after {
          width: 12px;
          background-image: url('../../assets/angle-down.svg');
        }
      }
      p {
        padding-top: 15px;
        margin-bottom: 0;
      }
      ul {
        list-style: none;
        font-weight: 400;
      }
      li {
        margin: 5px 0;
      }
    }
  }

</style>
