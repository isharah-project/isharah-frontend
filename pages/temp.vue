<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs4>
                <VideoCard
                    category="فعل"
                    word="الكلمة"
                    time="03-19-2019 15:30"
                    >
                </VideoCard>
                <v-card-text>
                    {{ gestures.included }}
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import VideoCard from '~/components/review/VideoCard'
export default {
  data () {
    return {
      gestures: []
    }
  },
  components: { VideoCard },
  async asyncData ({ app, $axios }) {
    try {
      let gestures = (await $axios.get('/gestures/unreviewed')).data
      console.log(gestures)
      return { gestures }
    } catch (e) {
      // TODO
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>
