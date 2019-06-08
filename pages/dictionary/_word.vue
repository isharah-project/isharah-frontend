<template>
  <v-container class="mt-3">
    <v-layout row wrap justify-center>
      <v-flex xs12 class="medium-round-corners light-box-shadow video-container">
        <video class="full-width d-block" controls poster="">
          <source
            :src="word.primary_dictionary_gesture.video_url"
            type="video/mp4"
          >
        </video>
      </v-flex>
    </v-layout>
    <v-layout justify-space-between align-center>
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
    <!--<v-divider></v-divider>-->
    <v-layout justify-space-between wrap class="pt-2">
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
        شارك بإضافة هذه الإشارة في مجموعة البيانات
        <v-icon class="mx-1">
          layers
        </v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      word: null
    }
  },
  async asyncData ({ $axios, route, store }) {
    try {
      let response = (await $axios.get(`words/${route.params.word}`)).data
      let word = store.state.deserialize(response)
      return { word }
    } catch (e) {
      store.commit('showErrorMsg', {
        message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
      })
    }
  },
  methods: {
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
