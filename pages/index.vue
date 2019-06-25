<template>
  <div>
    <section class="head-section grey-text">
      <div class="head-text">
        <h1 class="font-weight-bold mb-4">
          إشارة
        </h1>
        <p class="head-slogan">
          قاموس لغة الإشارة مفتوحة المصدر للمتعلمين والباحثين
        </p>
        <p class="head-description">
          موقع إشارة هو موقع يهدف لبناء مجموعة بيانات "dataset" وقاموس يحتوي على فيديوهات لمفردات لغة الإشارة المصرية.
          وجود مجموعة بيانات يحسن من مستوى البحث العلمي والتطبيقات والمواقع التي تخدم مجتمع الصم وضعاف السمع في مصر، ويوفر كذلك قاموس رقمي سهل التصفح يساعد كل من يريد تعلم لغة الإشارة المصرية أيا كان مجاله.
          <span class="d-block mt-2">
            "شارك" أدناه بإضافة فيديو لمجموعة بيانات إشارة أو قم بتصفح "القاموس"
          </span>
        </p>
        <div class="mt-5">
          <nuxt-link
            is="v-btn"
            to="contribute/add-gesture"
            class="fixed-size-btn blue-gradient btn-shadow"
            flat
            round
            dark
          >
            شارك
          </nuxt-link>
          <nuxt-link
            is="v-btn"
            to="dictionary?page=1"
            class="fixed-size-btn orange-gradient btn-shadow"
            flat
            round
            dark
          >
            القاموس
          </nuxt-link>
        </div>
      </div>
      <div class="head-visuals-wrapper">
        <!-- eslint-disable-next-line -->
        <HeadVisuals class="head-visuals" />
      </div>
      <div v-if="$vuetify.breakpoint.mdAndDown" class="head-overlay"></div>
    </section>
    <section class="grey-text text-xs-center section-margin py-3 mt-3">
      <h1 class="headline font-weight-bold">
        ابدأ البحث في القاموس
      </h1>
      <v-layout justify-center>
        <v-flex xs10 sm8 md6>
          <v-form @submit.prevent="dictionarySearch">
            <v-text-field
              v-model="searchQuery"
              class="light-shadow-input round-input input-hidden-underline my-4"
              placeholder="الكلمة"
              hide-details
              solo
            />
          </v-form>
        </v-flex>
      </v-layout>
      <v-btn class="blue-gradient fixed-size-btn btn-shadow" round dark @click="dictionarySearch">
        البحث
      </v-btn>
    </section>
    <section class="grey-text text-xs-center my-5 px-5">
      <h1 class="headline font-weight-bold mb-4">
        كلمات مضافة حديثًا
      </h1>
      <Loader :active="loading">
        <v-layout :wrap="$vuetify.breakpoint.smAndDown" justify-center>
          <v-flex
            v-for="gesture in dynamicGestures"
            :key="gesture.id"
            :class="{ 'mb-3': $vuetify.breakpoint.smAndDown }"
            class="px-3"
            xs12
            sm6
            md4
            lg3
            @click="goToWord(gesture)"
          >
            <VideoCard :gesture="gesture" :showReviewText="false" />
          </v-flex>
        </v-layout>
      </Loader>
    </section>
  </div>
</template>

<script>
import Loader from '~/components/generic/Loader'
import VideoCard from '~/components/profile/VideoCard'
import HeadVisuals from '~/assets/images/home-visuals-full.svg'

export default {
  components: {
    Loader,
    VideoCard,
    HeadVisuals
  },
  data () {
    return {
      searchQuery: '',
      mostRecentGestures: [],
      loading: true
    }
  },
  computed: {
    dynamicGestures () {
      if (this.$vuetify.breakpoint.md) {
        return this.mostRecentGestures.slice(0, 3)
      }
      return this.mostRecentGestures.slice(0, 4)
    }
  },
  created () {
    this.fetchGestures()
  },
  methods: {
    fetchGestures () {
      this.loading = true
      this.$axios.get('gestures/recently_added')
        .then((response) => {
          this.mostRecentGestures = this.deserialize(response.data)
        })
        .finally(() => {
          this.loading = false
        })
    },
    dictionarySearch () {
      if (this.searchQuery) {
        this.$router.push(`/dictionary?page=1&q=${this.searchQuery}`)
      }
    },
    goToWord (gesture) {
      this.$router.push(`/dictionary/${gesture.word.name}`)
    }
  }
}
</script>

<style>
.section-margin {
  margin-bottom: 100px;
}
.head-section {
  display: flex;
  justify-content: space-between;
  padding-right: calc((100% - 1185px) / 2);
  padding-bottom: 10%;
  margin-bottom: 130px;
}
.head-section .head-text {
  flex: 7;
  padding-top: 13%;
}
.head-section .head-text h1 {
  font-size: 80px;
}
.head-section .head-slogan {
  font-size: 30px;
}
.head-section .head-description {
  font-size: 16px;
  width: 90%;
  color: rgba(64, 64, 64, 0.6);
}
.head-visuals-wrapper {
  flex: 8;
}
.head-visuals {
  transform: scale(2) translateX(-115px) translateY(-10px);
}

@media screen and (max-width: 1400px){
  .head-visuals {
    transform: scale(1.9) translateX(-105px) translateY(0);
  }
}

@media screen and (max-width: 1264px) {
  .head-section {
    padding-right: calc((100% - 900px) / 2);
  }
  .head-section .head-text h1 {
    font-size: 50px;
  }
  .head-section .head-slogan {
    font-size: 24px;
  }
  .head-visuals {
    transform: scale(1.9) translateX(-75px) translateY(-5px);
  }
}
@media screen and (max-width: 960px) {
  .head-section {
    position: relative;
    min-height: calc(100vh - 64px);
    flex-direction: column;
    justify-content: center;
    margin-bottom: 80px;
  }
  .head-section .head-text {
    width: 75%;
    position: relative;
    z-index: 2;
    padding: 0 16px;
    text-align: center;
    flex: none;
    margin: 0 auto;
  }
  .head-section .head-slogan {
    text-shadow: 0 0 25px rgba(0, 0, 0, 0.2)
  }
  .head-section .head-description {
    width: 100%;
    text-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  }
  .head-visuals-wrapper {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: -30%;
    top: -17%;
    opacity: 0.15;
  }
  .head-visuals {
    height: 100%;
    width: 100%;
    transform: scale(1.5);
  }
}
@media screen and (max-width: 450px) {
  .head-section .head-text {
    width: 95%;
  }
  .head-section .head-description {
    font-size: 14px;
    color: rgba(64, 64, 64, 0.8);
  }
}
</style>
