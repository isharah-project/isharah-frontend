<template>
  <v-card class="small-round-corners light-box-shadow">
    <v-img :src="image" aspect-ratio="1.5">
      <v-container>
        <v-card flat class="absolute-position px-5 py-1 color-opacity full-round-corners">
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
      <v-icon v-if="review==='مقبول'" color="green">
        check_circle
      </v-icon>
      <v-icon v-if="review==='مرفوض'" color="red">
        cancel
      </v-icon>
      <v-icon v-if="review==='قيد المراجعة..'">
        help
      </v-icon>
      {{ review }}
    </v-card-text>
    <v-card-text class="grey--text text-xs-left px-4 pb-4">
      {{ showDate }}
    </v-card-text>
  </v-card>
</template>
<script>
import image from '~/assets/images/image.jpg'
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
      image: image
    }
  },
  computed: {
    showDate () {
      let diff = moment().diff(this.gesture.created_at, 'days')
      if (diff < 7) {
        return moment(this.gesture.created_at).locale('ar').calendar()
      } else {
        return moment(this.gesture.created_at).locale('ar').format('Do MMMM YYYY , HH:mm')
      }
    },
    review () {
      if (this.gesture.review) {
        if (this.gesture.review.accepted) {
          return 'مقبول'
        } else {
          return 'مرفوض'
        }
      } else {
        return 'قيد المراجعة..'
      }
    }
  }
}
</script>
<style>
  .color-opacity {
    opacity: 0.65
  }
</style>
