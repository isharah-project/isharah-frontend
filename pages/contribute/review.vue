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
            {{ selectedGesture.word.name }} <small>[{{ selectedGesture.word.part_of_speech }}]</small>
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
                check
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex class="px-1" xs6>
            <v-btn class="red-gradient btn-shadow full-width ma-0 review-btn" round dark flat>
              خاطئة
              <v-icon class="mr-1">
                clear
              </v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <h2 class="display-1 mt-4 mb-3">
      المزيد
    </h2>
    <v-layout class="mt-">
      <v-flex xs12 class="gestures-list-wrapper py-3">
        <v-card
          v-for="gesture in gestures"
          :key="gesture.id"
          class="light-box-shadow small-round-corners mx-3 gesture"
          @click="selectGesture(gesture)"
        >
          <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"></v-img>
          <v-card-text primary-title>
            <h3 class="word-text headline mb-0">
              {{ gesture.word.name }}
            </h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="py-4" justify-center>
      <v-flex class="text-xs-center">
        <v-pagination
          v-model="page.current"
          class="round-pagination"
          :length="page.total"
          :total-visible="$vuetify.breakpoint.xsOnly ? 4 : 6"
          @input="changeCurrentPage($event)"
        />
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
      page: null
    }
  },
  async asyncData ({ store, $axios }) {
    try {
      let response = (await $axios.get('gestures/unreviewed?page=2&per_page=3')).data
      let gestures = store.state.deserialize(response)
      let selectedGesture = gestures.length ? gestures[0] : null
      let page = {
        current: 1,
        total: response.page_meta.total_pages
      }
      return { gestures, selectedGesture, page }
    } catch (e) {
      // TODO: show err message
    }
  },
  methods: {
    changeCurrentPage (page) {
    },
    selectGesture () {
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
.gestures-list-wrapper::-webkit-scrollbar {
  height: 5px;
}
.gestures-list-wrapper::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 10px;
}
.gestures-list-wrapper .gesture {
  width: 200px;
  display: inline-block;
  cursor: pointer;
}
.gestures-list-wrapper .word-text {
  white-space: normal;
}
</style>
