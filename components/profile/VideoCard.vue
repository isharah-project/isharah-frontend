<template>
  <v-card class="video-card-wrapper small-round-corners light-box-shadow">
    <v-img :src="imgSrc" aspect-ratio="1.77">
      <template v-slot:placeholder>
        <v-layout
          fill-height
          align-center
          justify-center
          ma-0
        >
          <v-progress-circular indeterminate color="grey" size="48"></v-progress-circular>
        </v-layout>
      </template>
      <v-container v-if="gesture.word.part_of_speech">
        <v-card flat class="absolute-position px-5 py-1 card-pos full-round-corners">
          {{ gesture.word.part_of_speech }}
        </v-card>
      </v-container>
    </v-img>
    <v-card-title>
      <h2 class="pr-2 pt-2">
        {{ gesture.word.name }}
      </h2>
    </v-card-title>
    <v-card-text v-if="hasCategories" class="text-xs-right py-0">
      <v-chip v-for="category in gesture.word.categories" :key="category.id">
        {{ category.name }}
      </v-chip>
    </v-card-text>
    <v-card-text v-if="showReviewText" class="py-0 px-4" :class="{ 'pt-2': hasCategories }">
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
    </v-card-text>
    <v-card-text class="grey--text text-xs-left px-4 pb-4">
      {{ formattedDate }}
    </v-card-text>
  </v-card>
</template>
<script>
import placeholder from '~/assets/images/video-card-placeholder.jpg'
import moment from 'moment'

export default {
  props: {
    gesture: {
      type: Object,
      required: true
    },
    showReviewText: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      placeholder: placeholder,
      REVIEW_STATES: {
        ACCEPTED: 0,
        REJECTED: 1,
        PENDING: 2
      }
    }
  },
  computed: {
    imgSrc () {
      return this.gesture.preview_url || placeholder
    },
    formattedDate () {
      let diff = moment().diff(this.gesture.created_at, 'days')
      if (diff < 7) {
        return moment(this.gesture.created_at).locale('ar').calendar()
      } else {
        return moment(this.gesture.created_at).locale('ar').format('Do MMMM YYYY , HH:mm')
      }
    },
    reviewState () {
      if (this.gesture.review) {
        if (this.gesture.review.accepted) {
          return this.REVIEW_STATES.ACCEPTED
        } else {
          return this.REVIEW_STATES.REJECTED
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
    },
    hasCategories () {
      return this.gesture.word.categories && this.gesture.word.categories.length
    }
  }
}
</script>
<style>
.video-card-wrapper:hover {
  cursor: pointer;
  box-shadow: 0 5px 35px rgba(0, 0, 0, 0.3) !important;
}
.card-pos {
  opacity: 0.65
}
</style>
