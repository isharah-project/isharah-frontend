<template>
  <div id="gestures-container">
    <PageHeader :text="text" :icon="icon">
    </PageHeader>
    <Loader :active="loading">
      <div v-if="!gestures.length" class="headline text-xs-center">
        لم تقم بإضافة إشارات بعد.
        <br />
        <v-btn flat round class="blue-cyan-gradient btn-shadow white--text mt-3" @click="redirect()">
          أضف إشارة
        </v-btn>
      </div>
      <v-layout row wrap class="mt-2">
        <v-flex
          v-for="gesture in gestures"
          :key="gesture.id"
          xs12
          sm4
          md3
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
    </Loader>
    <v-layout v-if="gestures.length" row justify-center>
      <v-pagination
        v-model="page.current"
        class="flat-pagination round-pagination"
        :length="page.total"
        :total-visible="paginationVisibleCount"
        @input="fetchData($event, true)"
      >
      </v-pagination>
    </v-layout>
  </div>
</template>
<script>
import VideoCard from '~/components/profile/VideoCard'
import VideoCardDialog from '~/components/profile/VideoCardDialog'
import PageHeader from '~/components/generic/PageHeader'
import Loader from '~/components/generic/Loader'
import { deserialize } from 'jsonapi-deserializer'

export default {
  components: {
    VideoCard,
    PageHeader,
    VideoCardDialog,
    Loader
  },
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
      },
      loading: true
    }
  },
  computed: {
    paginationVisibleCount () {
      if (this.$vuetify.breakpoint.xsOnly) return 4
      else if (this.$vuetify.breakpoint.smAndDown) return 5
      else return 6
    },
    perPage () {
      return this.$vuetify.breakpoint.xsOnly ? 6 : 12
    }
  },
  created () {
    this.fetchData(1, false)
  },
  methods: {
    openGesturesDialog (gesture) {
      this.wordDialog = true
      this.viewedGesture = gesture
    },
    fetchData (pageNumber, scrollUp) {
      this.loading = true
      this.page.current = pageNumber
      this.$axios.get(`${this.url}?page=${pageNumber}&per_page=${6}`)
        .then((response) => {
          this.gestures = deserialize(response.data)
          this.page.total = response.data.page_meta.total_pages
        })
        .catch(() => {
          this.$store.commit('showErrorMsg', {
            message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
          })
        })
        .finally(() => {
          this.loading = false
          if (scrollUp) {
            this.$vuetify.goTo('#gestures-container')
          }
        })
    },
    redirect () {
      this.$router.push({ path: '/contribute/add-gesture' })
    }
  }
}
</script>
