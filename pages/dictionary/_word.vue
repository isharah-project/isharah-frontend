<template>
  <v-container>
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
    <v-layout :column="$vuetify.breakpoint.xsOnly" justify-space-between align-center>
      <h2 class="display-2 py-4 grey-text">
        {{ word.name }}
      </h2>
      <div class="d-flex">
        <v-chip v-for="category in word.categories" :key="category" class="btn-shadow">
          {{ category }}
        </v-chip>
      </div>
    </v-layout>
    <v-layout>
      <v-btn
        class="fixed-size-btn btn-shadow blue-cyan-gradient"
        dark
        flat
        round
        @click="goToUploadPage"
      >
        تدرب على الكلمة
        <v-icon class="mx-1">
          videocam
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
      console.log(e)
      // TODO: show error msg
    }
  },
  methods: {
    goToUploadPage () {
      this.$router.push({ path: `/contribute/upload?word=${this.word.name}` })
    }
  }
}
</script>

<style scoped>
.video-container {
  overflow: hidden;
}
</style>
