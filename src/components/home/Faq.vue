<template>
  <section id="faq" class="faq home-section">
    <div class="main-page__container">
      <div class="main-page__section-header _faq" />
      <MobileMenu />
      <div class="home-section__content">
        <h2 class="main-page__heading">
          Все, что вы хотели узнать об UNO CRM
        </h2>
        <div class="home-section__text">
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
              <ul>
                <li class="li-text">
                  Онлайн-запись клиентов из социальных сетей и Вашего сайта
                </li>
                <li class="li-text">
                  Журнал записи клиентов по мастерам
                </li>
                <li class="li-text">
                  Графики сотрудников
                </li>
                <li class="li-text">
                  Задачи и напоминания для сотрудников
                </li>
                <li class="li-text">
                  Удобная клиентская база и история посещений
                </li>
                <li class="li-text">
                  Sms-уведомления и напоминания для клиентов
                </li>
              </ul>
            </template>
          </Accordion>
          <Accordion>
            <template slot="heading">
              Насколько сложно ее внедрить в бизнес?
            </template>
            <template slot="content">
              <p>
                Система создана максимально простой и удобной, ее настройка и внедрение в работу займет не более двух часов.
                Если у вас возникли трудности с настройкой, воспользуйтесь 8-шаговой
                <a href="https://drive.google.com/open?id=1m_AFYItiKC64SGfXfjQbqzNeJZZvMJGC" target="_blank">
                  Краткой инструкцией для пользователей.
                </a>
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
          <Accordion>
            <template slot="heading">
              Наши реквизиты
            </template>
            <template slot="content">
              <p>
                ООО «Электронная отчетность»
              </p>
              <p>
                <b>ИНН</b> 5402580329
              </p>
              <p>
                <b>КПП</b> 540201001
              </p>
              <p>
                <b>ОГРН</b> 1145476110526
              </p>
              <p>
                <b>Телефон</b>: 8 (383) 213 14 15
              </p>
              <p>
                <b>email</b>: info@uno.salon
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
  @import '../../assets/styles/home-section';
  .faq {
    .main-page__heading {
      margin-bottom: 30px;
    }
    .accordion._expanded .accordion__header {
      border-bottom-color: #BA9462;
    }
    .li-text {
      font-weight: 700;
    }
  }
</style>
