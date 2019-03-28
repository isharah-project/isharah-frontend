<template>
  <v-card class="round-corners light-box-shadow">
    <v-img :src= image  aspect-ratio="1.5">
      <v-container>
        <v-card flat class="absolute-position px-5 py-1 round-corners color-opacity full-round-corners">
          {{category}}
        </v-card>
      </v-container>
    </v-img>
    <v-card-title>
      <h2 class="pr-3 pt-2"> {{ word }} </h2>
      <v-card-text class="grey--text text-xs-left"> {{ showDate }} </v-card-text>
    </v-card-title>
  </v-card>
</template>
<script>
import image from '~/assets/miral.jpg'
import moment from 'moment'
export default {
  data () {
    return {
      image: image
      // date: showDate(Time)
      // date: moment('03-25-2019 15:53').lang('ar').fromNow()
    }
  },
  props: {
    category: {
      type: String,
      required: true
    },
    word: {
      type: String,
      required: true
    },
    time: {
      type: String,
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
