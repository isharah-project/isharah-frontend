<template>
  <div>
    <PageHeader text="مشاركاتي" icon="videocam">
    </PageHeader>
    <v-flex
      xs12
      class="text-xs-center"
    >
      <v-btn
        class="orange-gradient video-method-btn btn-shadow title mx-2"
        flat
        dark
        round
        @click="redirect('UPLOAD')"
      >
        رفع
      </v-btn>
      <v-btn
        class="red-gradient video-method-btn btn-shadow title mx-2"
        flat
        dark
        round
        @click="redirect('RECORD')"
      >
        تسجيل
      </v-btn>
    </v-flex>
    <v-layout row wrap class="mt-2">
      <v-flex
        v-for="contribution in contributions"
        :key="contribution.word.name"
        xs12
        sm6
        md4
        pa-2
        clickable
        @click="openGesturesDialog(contribution)"
      >
        <VideoCard :gesture="contribution">
        </VideoCard>
      </v-flex>
      <v-dialog v-model="wordDialog" max-width="500px">
        <VideoCardDialog :gesture="viewedGesture" @closeDialog="wordDialog=false"></VideoCardDialog>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import VideoCard from '~/components/profile/VideoCard'
import VideoCardDialog from '~/components/profile/VideoCardDialog'
import PageHeader from '~/components/generic/PageHeader'
export default {
  components: { VideoCard, PageHeader, VideoCardDialog },
  props: {
    contributions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      wordDialog: false,
      viewedGesture: {}
    }
  },
  methods: {
    openGesturesDialog (gesture) {
      this.wordDialog = true
      this.viewedGesture = gesture
    },
    redirect (state) {
      this.$router.push({ name: 'contribute-add_gesture', params: { parentState: state } })
    }
  }
}
</script>
<style>
.video-method-btn {
  width: 200px;
  height: 50px;
}
</style>
