<template>
  <Layout>
    <br><br><br><br>
    <!-- <section class="intro">
    </section>

    <section class="fits">
    </section> -->

    <section class="pricing type-1">
      <div class="content-wrapper">
        <div class="content">
          <div class="overlay layer-0" />
          <div class="text-wrapper layer-1">
            <div class="header">
              ПОЛЬЗУЙТЕСЬ<br>БЕСПЛАТНО!
            </div>
            <div class="subheader">
              Мы любим своих клиентов.<br>
              Никакого навязанного сервиса.
            </div>
            <p class="text">
              Пройдите простую регистрацию и получите возможности развития и оптимизации ваших бизнес-процессов.<br>
              <ul>
                <li>Управляйте сотрудниками онлайн</li>
                <li>Ведите запись в онлайн-журнале</li>
                <li>Уведомляйте клиентов о новой записи</li>
                <li>Храните историю записей клиентов</li>
                <li>Контролируйте рабочие процессы из любой точки мира</li>
              </ul>
              Все это и другие полезные инструменты уже ждут вас в базовой версии UNO.CRM. А если вам не хватит стандартного функционала, просто добавьте действительно нужные вам платные модули и не платите за подписки и каждого мастера отдельно.
            </p>
          </div>
          <div>
            <router-link :to="{ name: 'home' }" class="inner-link layer-1">
              ПОЛУЧИТЕ ДОСТУП К СИСТЕМЕ УЖЕ СЕЙЧАС
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="integration type-2">
      <div class="content">
        <div class="overlay layer-0" />
        <div class="text-wrapper layer-1">
          <div class="header">
            ВНЕДРЕНИЕ<br>ВСЕГО ЗА 2 ЧАСА
          </div>
          <div class="subheader">
            Экономия времени и сил.
          </div>
          <p class="text">
            Мы создали систему максимально простой и удобной,<br>
            чтобы ваши сотрудники смогли легко освоить ее,<br>
            даже если до этого они никогда не работали в CRM.
            <br><br>
            А если вам понадобится помощь, просто напишите<br>
            в поддержку. Наш менеджер свяжется с вами<br>
            и поможет разобраться со всеми вопросами.
          </p>
        </div>
      </div>
    </section>

    <section class="clients type-3">
      <div class="content">
        <div class="overlay layer-0" />
        <div class="text-wrapper layer-1">
          <div class="header">
            О КЛИЕНТАХ<br>В ПЕРВУЮ ОЧЕРЕДЬ
          </div>
          <div class="subheader">
            Они скажут вам «Спасибо!» за заботу.
          </div>
          <p class="text">
            В нашем мире невозможно все держать в голове. Поэтому мы разработали несколько инструментов, которые помогут вам держать свою базу клиентов в актуальном состоянии, расширять ее и удерживать.
          </p>
        </div>
        <div>
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
  // $saloons: beauty spa cosmetic massage barbershop manicure lash solarium tattoo epilation;
  .main-page-sections {
    section {
      &.pricing {
        height: 1000px;
        .overlay {
          top: 70px;
          background: url('../../assets/images/home/bg_pricing.png') right top/contain no-repeat;
        }
      }

      &.integration {
        height: 835px;
        .overlay {
          left: 0;
          background: url('../../assets/images/home/bg_integration.png') left top/contain no-repeat;
        }
      }

      &.clients {
        height: 755px;
        background: #fff;
        .overlay {
          background: url('../../assets/images/home/bg_clients.png') right top/contain no-repeat;
        }
      }
    }
  }
</style>
