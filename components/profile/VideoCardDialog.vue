<template>
  <div class="relative-position">
    <v-btn
      icon
      dark
      class="btn-position"
      @click="closeDialog()"
    >
      <v-icon>close</v-icon>
    </v-btn>
    <v-card v-if="gesture.word" class="small-round-corners light-box-shadow">
      <video :src="gesture.video_url" width="100%" height="100%" controls>
      </video>
      <v-container>
        <v-layout justify-space-between align-center>
          <v-layout justify-start align-baseline>
            <h2 class="display-2 py-0 pl-2">
              {{ gesture.word.name }}
            </h2>
            <div v-if="gesture.word.part_of_speech" class="grey--text">
              [{{ gesture.word.part_of_speech }}]
            </div>
          </v-layout>
          <div class="d-flex">
            <v-chip v-for="category in gesture.word.categories" :key="category.id" class="btn-shadow">
              {{ category.name }}
            </v-chip>
          </div>
        </v-layout>
      </v-container>
      <v-container>
        <v-icon v-if="reviewState === REVIEW_STATES.ACCEPTED" color="green">
          check_circle
        </v-icon>
        <v-icon v-if="reviewState === REVIEW_STATES.REJECTED" color="red">
          cancel
        </v-icon>
        <v-icon v-if="reviewState === REVIEW_STATES.PENDING">
          help
        </v-icon>
        {{ reviewText }}
      </v-container>
      <v-container v-if="review && review.comment" class="py-0">
        <h4 class="pb-1">
          التعليق:
        </h4>
        <v-card flat color="#eaebed" width="50%" class="full-round-corners light-box-shadow">
          <v-card-text>
            {{ review.comment }}
            <v-card-text class="grey--text text-xs-left pa-0">
              {{ getFormattedDate(review.created_at) }}
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-container>
      <v-card-text class="grey--text text-xs-left px-4 pb-4">
        {{ getFormattedDate(gesture.created_at) }}
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    gesture: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      REVIEW_STATES: {
        ACCEPTED: 0,
        REJECTED: 1,
        PENDING: 2
      }
    }
  },
  computed: {
    review () {
      if (this.gesture.review) {
        return this.gesture.review
      }
      return null
    },
    reviewState () {
      if (this.gesture.review) {
        if (this.gesture.review.accepted) {
          return this.REVIEW_STATES.ACCEPTED
        } else {
          return this.REVIEW_STATES.ACCEPTED
        }
      } else {
        return this.REVIEW_STATES.PENDING
      }
    },
    reviewText () {
      switch (this.reviewState) {
        case this.REVIEW_STATES.ACCEPTED:
          return 'مقبول'
        case this.REVIEW_STATES.REJECTED:
          return 'مرفوض'
        case this.REVIEW_STATES.PENDING:
          return 'قيد المراجعة'
        default:
          return 'قيد المراجعة'
      }
    }
  },
  methods: {
    getFormattedDate (date) {
      let diff = moment().diff(date, 'days')
      if (diff < 7) {
        return moment(date).locale('ar').calendar()
      } else {
        return moment(date).locale('ar').format('Do MMMM YYYY , HH:mm')
      }
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>
  .relative-position {
    position:relative
  }
  .relative-position > .btn-position {
    position: absolute;
    z-index: 3;
    right: 5px !important;
    top: 5px !important;
  }
</style>
