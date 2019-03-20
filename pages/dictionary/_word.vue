<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="medium-round-corners light-box-shadow video-container">
        <video class="full-width d-block" controls poster="">
          <source
            src="~/assets/video.mp4"
            type="video/mp4"
          >
        </video>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <h2 class="display-2 py-4 grey-text">
          {{ word.attributes.name }}
        </h2>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-list two-line class="user-list">
          <v-list-tile avatar class="user-list-tile">
            <v-list-tile-avatar class="light-box-shadow" :size="80">
              <img src="~/assets/images/placeholder-user.png" alt="">
            </v-list-tile-avatar>

            <v-list-tile-content class="pa-2">
              <v-list-tile-title class="user-title headline grey-text">
                طارق محمد
              </v-list-tile-title>
              <v-list-tile-sub-title class="user-subtitle">
                مصر - الأسكندرية
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
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
  async asyncData ({ $axios, route }) {
    try {
      let word = (await $axios.get(`words/${route.params.word}`)).data.data
      return { word }
    } catch (e) {
      console.log(e)
      // TODO
    }
  }
}
</script>

<style scoped>
.video-container {
  overflow: hidden;
}
.user-list {
  background: transparent;
}
.user-list >>> .v-list__tile.v-list__tile--avatar.theme--light {
  padding: 0;
}
.user-list .user-title {
  height: 35px;
  line-height: 35px;
}
</style>
