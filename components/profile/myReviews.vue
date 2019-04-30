<template>
  <div>
    <PageHeader text="تقييماتي" icon="rate_review">
    </PageHeader>
    <!-- <v-layout row wrap class="mt-2">
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
    </v-layout> -->
  </div>
</template>
<script>
// import VideoCard from '~/components/profile/VideoCard'
import PageHeader from '~/components/generic/PageHeader'
export default {
  components: { PageHeader },
  props: {
    contributions: {
      type: Object,
      required: true
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
