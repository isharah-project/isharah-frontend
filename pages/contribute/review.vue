<template>
  <v-container>
    <PageHeader id="pageHeader" text="قيم الإشارات" icon="rate_review" />
    <v-layout v-if="!gestures.length">
      <v-flex>
        <div class="headline text-xs-center">
          ﻷ توجد إشارات للتقيم الاّن..
        </div>
      </v-flex>
    </v-layout>
    <template v-else>
      <v-layout justify-center>
        <v-flex xs12 sm10 md8>
          <v-layout justify-center>
            <v-flex class="medium-round-corners light-box-shadow video-container">
              <video ref="review-video" class="d-block full-width" controls @ended="enableButtons">
                <source :src="selectedGesture.video_url">
              </video>
            </v-flex>
          </v-layout>
          <v-layout justify-space-between align-center>
            <v-layout justify-start align-baseline>
              <h2 class="display-2 py-4 pl-2 grey-text">
                {{ selectedGesture.word.name }}
              </h2>
              <div class="grey--text">
                [{{ selectedGesture.word.part_of_speech }}]
              </div>
            </v-layout>
            <div class="d-flex">
              <v-chip v-for="category in selectedGesture.word.categories" :key="category.id" class="btn-shadow">
                {{ category.name }}
              </v-chip>
            </div>
          </v-layout>
          <v-layout wrap class="form-wrapper" :class="{ 'disabled-form': disableForm }">
            <v-flex xs12>
              <v-textarea v-model="review.comment" :disabled="disableForm" label="تعليق" rows="2" no-resize />
            </v-flex>
            <v-flex class="px-1" xs6>
              <v-btn
                class="blue-cyan-gradient btn-shadow full-width ma-0 review-btn"
                :disabled="disableForm"
                round
                dark
                flat
                @click="submitReview(true)"
              >
                صحيحة
                <v-icon class="mr-1">
                  check
                </v-icon>
              </v-btn>
            </v-flex>
            <v-flex class="px-1" xs6>
              <v-btn
                class="red-gradient btn-shadow full-width ma-0 review-btn"
                :disabled="disableForm"
                round
                dark
                flat
                @click="submitReview(false)"
              >
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
        <v-flex xs12 class="gestures-list-wrapper py-4 px-2">
          <v-card
            v-for="gesture in gestures"
            :key="gesture.id"
            :class="{ 'selected': gesture.id === selectedGesture.id }"
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
            @input="fetchGestures($event)"
          />
        </v-flex>
      </v-layout>
    </template>
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
        comment: null
      },
      page: null,
      disableForm: true
    }
  },
  async asyncData ({ store, $axios }) {
    try {
      let response = (await $axios.get('gestures/unreviewed?page=1&per_page=3')).data
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
    fetchGestures (page, callback) {
      this.$axios.get(`gestures/unreviewed?page=${page}&per_page=3`).then((response) => {
        this.gestures = this.deserialize(response.data)
        if (callback) callback()
      }).catch((e) => {
        // TODO: show err message
      })
    },
    submitReview (value) {
      let postData = {
        accepted: value,
        comment: this.review.comment
      }
      this.$axios.post(`gestures/${this.selectedGesture.id}/review`, postData).then((response) => {
        this.fetchGestures(this.page.current, () => {
          this.selectGesture(this.gestures.length ? this.gestures[0] : null)
        })
        // TODO: show success message
      }).catch((e) => {
        // TODO: show err message
      })
    },
    enableButtons () {
      this.disableForm = false
    },
    selectGesture (gesture) {
      this.selectedGesture = gesture
      this.review.comment = ''
      if (gesture) {
        this.disableForm = true
        this.$nextTick(() => {
          this.$refs['review-video'].load()
          this.$refs['review-video'].play()
          this.$vuetify.goTo('#pageHeader')
        })
      }
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
.disabled-form {
  opacity: 0.5;
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
.gestures-list-wrapper .gesture:hover,
.gestures-list-wrapper .gesture.selected {
  box-shadow: 0 5px 35px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-3px);
}
.gestures-list-wrapper .word-text {
  white-space: normal;
}
</style>
