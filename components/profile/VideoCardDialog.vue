<template>
  <div class="relative-position">
    <v-btn
      absolute
      icon
      dark
      fab
      right
      class="btn-position"
      @click="closeDialog()"
    >
      <v-icon>close</v-icon>
    </v-btn>
    <v-card class="small-round-corners light-box-shadow">
      <video :src="gesture.video_url" width="100%" height="100%" controls>
      </video>
      <v-container>
        <v-layout justify-space-between align-center>
          <v-layout justify-start align-baseline>
            <h2 class="display-2 py-0 pl-2">
              {{ gesture.word.name }}
            </h2>
            <div class="grey--text">
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
      <v-container v-if="review" class="py-0">
        <h4 class="pb-1">
          التعليق:
        </h4>
        <v-card flat color="#eaebed" width="50%" class="full-round-corners light-box-shadow">
          <v-card-text>
            {{ review.comment }}
            <v-card-text class="grey--text text-xs-left pa-0">
              {{ showDate(review.created_at) }}
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-container>
      <v-card-text class="grey--text text-xs-left px-4 pb-4">
        {{ showDate(gesture.created_at) }}
      </v-card-text>
      <!-- {{ gesture }} -->
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
  computed: {
    review () {
      if (this.gesture.review) {
        return this.gesture.review
      }
      return null
    }
  },
  methods: {
    showDate (date) {
      let diff = moment().diff(date, 'days')
      if (diff < 7) {
        return moment(date).locale('ar').calendar()
      } else {
        return moment(date).locale('ar').format('Do MMMM YYYY , HH:mm')
      }
    },
    closeDialog () {
      this.$emit('close-dialog', false)
    }
  }
}
</script>
<style>
  .relative-position {
    position:relative
  }
  .btn-position {
    right: 5px;
  }
</style>
