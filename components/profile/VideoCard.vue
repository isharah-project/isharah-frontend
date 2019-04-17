<template>
  <v-card class="small-round-corners light-box-shadow">
    <v-img :src="image" aspect-ratio="1.5">
      <v-container v-if="gesture.word.part_of_speech">
        <v-card flat class="absolute-position px-5 py-1 pos-card full-round-corners">
          {{ gesture.word.part_of_speech }}
        </v-card>
      </v-container>
    </v-img>
    <v-card-title>
      <h2 class="pr-2 pt-2">
        {{ gesture.word.name }}
      </h2>
    </v-card-title>
    <v-card-text class="py-0 px-4">
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
import image from '~/assets/images/card_placeholder.jpg'
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
      image: image,
      REVIEW_STATES: {
        ACCEPTED: 0,
        REJECTED: 1,
        PENDING: 2
      }
    }
  },
  computed: {
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
  }
}
</script>
<style>
.pos-card {
  opacity: 0.65
}
</style>
