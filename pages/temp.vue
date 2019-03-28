<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs4>
                <VideoCard :gesture = "gestures[0]">
                </VideoCard>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import VideoCard from '~/components/review/VideoCard'
import { deserialize } from 'jsonapi-deserializer'
export default {
  data () {
    return {
      gestures: []
    }
  },
  components: { VideoCard },
  async asyncData ({ app, $axios }) {
    try {
      let gestures = deserialize((await $axios.get('/gestures/unreviewed')).data)
      return { gestures }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>

</style>
