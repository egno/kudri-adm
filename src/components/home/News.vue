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
          :navigate-to="2"
          :pagination-enabled="false"
          :per-page="1"
          navigation-next-label
          navigation-prev-label
          @navigation-click="closeAccordions"
        >
          <slide>
            <Slide0 />
          </slide>
          <slide>
            <Slide1 />
          </slide>
          <slide>
            <Slide2 />
          </slide>
        </carousel>
      </div>
    </div>
  </section>
</template>

<script>
import MobileMenu from '@/components/home/MobileMenu'
import { Carousel, Slide } from 'vue-carousel'
import Slide0 from '@/components/versions/v1.0.5.vue'
import Slide1 from '@/components/versions/v1.0.6.vue'
import Slide2 from '@/components/versions/v1.0.7.vue'

export default {
  name: 'News',
  components: {
    MobileMenu,
    Carousel,
    Slide,
    Slide0,
    Slide1,
    Slide2
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
            { class: 'stats', color: '#C9A15D', active: false }
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
            { class: 'stats', color: '#C9A15D', active: false }
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
            { class: 'stats', color: '#C9A15D', active: false }
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
      const accordionHeaders = this.$el.querySelectorAll(
        '.accordion._expanded .accordion__header'
      )

      Array.from(accordionHeaders).forEach(el => el.click())
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/home-section';
$indicators: (
  critical: #ef4d37,
  visual: #5bcd5e,
  visit-calendar: #5699ff,
  additional: #07101c,
  stats: #c9a15d,
  widget: #b35dc9,
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
    @media only screen and (min-width: $desktop) {
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
    border: 1px solid #07101c !important;
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
        background: #ef4d37;
      }
      &._expanded .accordion__header {
        border-bottom-color: #ef4d37;
      }
    }

    &.visual {
      .accordion__header {
        background: #5bcd5e;
      }
      &._expanded .accordion__header {
        border-bottom-color: #5bcd5e;
      }
    }

    &.visit-calendar {
      .accordion__header {
        background: #5699ff;
      }
      &._expanded .accordion__header {
        border-bottom-color: #5699ff;
      }
    }

    &.additional {
      .accordion__header {
        background: #07101c;
      }
      &._expanded .accordion__header {
        border-bottom-color: #07101c;
      }
    }

    &.stats {
      .accordion__header {
        background: #c9a15d;
      }
      &._expanded .accordion__header {
        border-bottom-color: #c9a15d;
      }
    }

    &.widget {
      .accordion__header {
        background: #b35dc9;
      }
      &._expanded .accordion__header {
        border-bottom-color: #b35dc9;
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
