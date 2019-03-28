<template>
  <v-card class="round-corners light-box-shadow">
    <v-img :src= image  aspect-ratio="1.5">
      <v-container>
        <v-card flat class="absolute-position px-5 py-1 round-corners color-opacity full-round-corners">
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
      الفئات:
      <v-chip v-for="category in gesture.word.categories" :key="category.id" >
        {{ category.name }}
      </v-chip>
    </v-card-text>
    <v-card-text class="grey--text text-xs-left px-4 pb-4"> {{ showDate }} </v-card-text>
  </v-card>
</template>
<script>
import image from '~/assets/miral.jpg'
import moment from 'moment'
export default {
  data () {
    return {
      image: image
    }
  },
  props: {
    gesture: {
      type: Object,
      required: true
    }
  },
  computed: {
    showDate () {
      let diff = moment().diff(this.time, 'days')
      if (diff < 7) {
        return moment(this.time).locale('ar').calendar()
      } else {
        return moment(this.time).locale('ar').format('Do MMMM YYYY , HH:mm')
      }
    }
  }
}
</script>
