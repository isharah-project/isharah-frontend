<template>
  <v-container class="mt-3">
    <Loader :active="loading">
      <v-layout v-if="word" row wrap justify-center>
        <v-flex xs12 class="medium-round-corners light-box-shadow video-container">
          <video class="full-width d-block" controls poster="">
            <source
              :src="word.primary_dictionary_gesture.video_url"
              type="video/mp4"
            >
          </video>
        </v-flex>
      </v-layout>
      <v-layout v-if="word" justify-space-between align-center>
        <v-layout justify-start align-baseline>
          <h2 class="display-2 py-4 pl-2 grey-text">
            {{ word.name }}
          </h2>
          <div class="grey--text">
            [{{ word.part_of_speech }}]
          </div>
        </v-layout>
        <div class="d-flex">
          <v-chip v-for="category in word.categories" :key="category.id" class="btn-shadow">
            {{ category.name }}
          </v-chip>
        </div>
      </v-layout>
      <v-layout v-if="word" justify-space-between wrap class="pt-2">
        <v-btn
          class="fixed-size-btn btn-shadow blue-gradient"
          dark
          flat
          round
          @click="goToPracticePage"
        >
          تدرب على الإشارة
          <v-icon class="mx-1">
            videocam
          </v-icon>
        </v-btn>
        <v-btn
          class="btn-shadow orange-gradient"
          dark
          flat
          round
          @click="goToAddGesturePage"
        >
          شارك بإضافة إشارة للكلمة في مجموعة البيانات
          <v-icon class="mx-1">
            layers
          </v-icon>
        </v-btn>
      </v-layout>
    </Loader>
    <!--<v-divider></v-divider>-->
  </v-container>
</template>

<script>
import Loader from '~/components/generic/Loader'

export default {
  components: {
    Loader
  },
  data () {
    return {
      word: null,
      loading: false
    }
  },
  created () {
    this.fetchWord()
  },
  methods: {
    fetchWord () {
      this.loading = true
      this.$axios.get(`words/${this.$route.params.word}`)
        .then((response) => {
          this.word = this.$store.state.deserialize(response.data)
        })
        .catch((e) => {
          if (e.response.status === 404) {
            /* eslint-disable-next-line */
            this.$nuxt.error({ statusCode: 404 })
          } else {
            this.$store.commit('showErrorMsg', {
              message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    goToPracticePage () {
      this.$router.push({ path: `/contribute/practice?word=${this.word.name}` })
    },
    goToAddGesturePage () {
      this.$router.push({
        name: 'contribute-add_gesture',
        params: {
          word: this.word
        }
      })
    }
  }
}
</script>

<style scoped>
.video-container {
  overflow: hidden;
}
</style>
