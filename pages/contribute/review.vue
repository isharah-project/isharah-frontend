<template>
  <v-container>
    <PageHeader text="قيم الإشارات" icon="rate_review" />
    <v-layout justify-center>
      <v-flex xs12 sm10 md8>
        <v-layout justify-center>
          <v-flex class="medium-round-corners light-box-shadow video-container">
            <video class="d-block full-width" controls>
              <source :src="selectedGesture.video_url">
            </video>
          </v-flex>
        </v-layout>
        <v-layout :column="$vuetify.breakpoint.xsOnly" justify-space-between align-center>
          <h2 class="display-2 py-4 grey-text">
            {{ selectedGesture.word.name }}
          </h2>
          <div class="d-flex">
            <v-chip v-for="category in selectedGesture.word.categories" :key="category.name" class="btn-shadow">
              {{ category.name }}
            </v-chip>
          </div>
        </v-layout>
        <v-layout wrap>
          <v-flex xs12>
            <v-textarea v-model="review.comment" label="تعليق" rows="2" no-resize />
          </v-flex>
          <v-flex class="px-1" xs6>
            <v-btn class="blue-cyan-gradient btn-shadow full-width ma-0 review-btn" round dark flat>
              صحيحة
              <v-icon class="mr-1">
                check_circle
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex class="px-1" xs6>
            <v-btn class="red-gradient btn-shadow full-width ma-0 review-btn" round dark flat>
              خاطئة
              <v-icon class="mr-1">
                cancel
              </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5">
      <v-flex xs12 class="gestures-list-wrapper">
        <v-card v-for="i in 9" :key="i" class="light-box-shadow small-round-corners mx-3 gesture">
          <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"></v-img>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Valley Safari
              </h3>
              <div></div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'

export default {
  components: {
    PageHeader
  },
  data () {
    return {
      gestures: null,
      selectedGesture: null,
      review: {
        accepted: null,
        comment: null
      },
      page: 1
    }
  },
  async asyncData ({ store, $axios }) {
    try {
      let response = (await $axios.get('gestures/unreviewed?page=1&per_page=20')).data
      let gestures = store.state.deserialize(response)
      let selectedGesture = gestures.length ? gestures[0] : null
      return { gestures, selectedGesture }
    } catch (e) {
      // TODO: show err message
    }
  }
}
</script>

<style scoped>
.video-container {
  overflow: hidden;
}
.review-btn {
  height: 40px;
}
.gestures-list-wrapper {
  overflow-x: auto;
  white-space: nowrap;
}
.gestures-list-wrapper .gesture {
  width: 200px;
  display: inline-block;
}
</style>
