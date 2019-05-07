<template>
  <div>
    <PageHeader v-if="$vuetify.breakpoint.mdAndUp" :text="text" :icon="icon">
    </PageHeader>
    <div v-if="!gestures" class="headline text-xs-center">
      لا يوجد إشارات
    </div>
    <!-- <v-flex
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
    </v-flex> -->
    <v-layout row wrap class="mt-2">
      <v-flex
        v-for="gesture in gestures"
        :key="gesture.word.name"
        xs12
        sm6
        md4
        pa-2
        clickable
        @click="openGesturesDialog(gesture)"
      >
        <VideoCard :gesture="gesture">
        </VideoCard>
      </v-flex>
      <v-dialog v-model="wordDialog" max-width="500px">
        <VideoCardDialog :gesture="viewedGesture" @closeDialog="wordDialog=false"></VideoCardDialog>
      </v-dialog>
    </v-layout>
    <v-layout row justify-center>
      <v-pagination
        v-model="page.current"
        class="flat-pagination round-pagination"
        :length="page.total"
        :total-visible="paginationVisibleCount"
        @input="changeCurrentPage($event)"
      >
      </v-pagination>
    </v-layout>
  </div>
</template>
<script>
import VideoCard from '~/components/profile/VideoCard'
import VideoCardDialog from '~/components/profile/VideoCardDialog'
import PageHeader from '~/components/generic/PageHeader'
import { deserialize } from 'jsonapi-deserializer'
export default {
  components: { VideoCard, PageHeader, VideoCardDialog },
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      wordDialog: false,
      viewedGesture: {},
      gestures: [],
      page: {
        current: 1,
        total: null
      }
    }
  },
  computed: {
    paginationVisibleCount () {
      if (this.$vuetify.breakpoint.xsOnly) return 4
      else if (this.$vuetify.breakpoint.smAndDown) return 5
      else return 6
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    openGesturesDialog (gesture) {
      this.wordDialog = true
      this.viewedGesture = gesture
    },
    redirect (state) {
      this.$router.push({ name: 'contribute-add_gesture', params: { parentState: state } })
    },
    changeCurrentPage (pageNumber, callback) {
      this.page.current = pageNumber
      this.$axios.get(`${this.url}?page=${pageNumber}&per_page=6`).then((response) => {
        this.page.total = response.data.page_meta.total_pages
        this.gestures = deserialize(response.data)
        if (callback) callback()
      }).catch((e) => {
        this.$store.commit('showErrorMsg', {
          message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
        })
      })
    },
    fetchData () {
      this.$axios.get(`${this.url}?page=1&per_page=6`).then((response) => {
        this.gestures = deserialize(response.data)
        this.page.total = response.data.page_meta.total_pages
      }).catch(() => {
        this.$store.commit('showErrorMsg', {
          message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
        })
      })
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
