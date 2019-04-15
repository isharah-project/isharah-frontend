<template>
  <v-container>
    <PageHeader icon="person" text="الصفحة الشخصية" />
    <v-layout row wrap class="justify-center">
      <v-flex sm6 xs12>
        <v-card class="light-box-shadow small-round-corners pa-4">
          <v-layout row wrap>
            <v-flex
              lg2
              md3
              sm4
              xs4
              align-self-center
              class="text-xs-center"
            >
              <v-img
                :src="imageSrc()"
                max-width="100"
                :aspect-ratio="1/1"
                class="full-round-corners-square ml-2"
              >
              </v-img>
            </v-flex>
            <v-flex lg5 md4 sm8 xs8 :class="{'pb-1':$vuetify.breakpoint.smAndDown}">
              <h2>
                {{ user.first_name }} {{ user.last_name }}
              </h2>
              <v-card-text class="ma-0 pa-0 grey--text">
                {{ user.email }}
                <br />
                {{ arabicDate() }}
                <br />
                {{ user.city }} , {{ user.country }}
              </v-card-text>
            </v-flex>
            <v-flex md5 xs12 align-self-end class="text-xs-center">
              <nuxt-link
                is="v-btn"
                class="red-border-btn btn-shadow edit-btn-width"
                flat
                round
                small
                @click="editDialog = true"
              >
                تعديل البيانات
              </nuxt-link>
              <nuxt-link
                is="v-btn"
                class="red-border-btn btn-shadow edit-btn-width"
                flat
                round
                small
                @click="changePasswordDialog = true"
              >
                تغيير كلمة السر
              </nuxt-link>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-dialog v-model="editDialog" max-width="400px">
        <editDialog :upcomingUser="user" @close-dialog="editDialog=false"></editDialog>
      </v-dialog>
      <v-dialog v-model="changePasswordDialog" max-width="400px">
        <changePasswordDialog :upcomingUser="user" @close-dialog="changePasswordDialog=false"></changePasswordDialog>
      </v-dialog>
      <v-flex xs6 sm3 class="text-xs-center px-2" :class="{'btn-height my-2':$vuetify.breakpoint.xsOnly}">
        <v-btn
          :class="{'display-1':$vuetify.breakpoint.smAndUp}"
          class="orange-gradient btn-shadow full-height small-round-corners ma-0"
          height="100%"
          large
          block
          flat
          dark
          @click="redirect('UPLOAD')"
        >
          ارفع
        </v-btn>
      </v-flex>
      <v-flex xs6 sm3 class="text-xs-center px-2" :class="{'btn-height my-2':$vuetify.breakpoint.xsOnly}">
        <v-btn
          :class="{'display-1':$vuetify.breakpoint.smAndUp}"
          class="red-gradient btn-shadow full-height small-round-corners ma-0"
          large
          block
          flat
          dark
          round
          @click="redirect('RECORD')"
        >
          سجل
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        v-for="contribution in contributions"
        :key="contribution.word.name"
        xs12
        sm6
        md4
        pa-3
        clickable
        @click="openGesturesDialog(contribution)"
      >
        <VideoCard :gesture="contribution">
        </VideoCard>
      </v-flex>
      <v-dialog v-model="wordDialog" max-width="500px">
        <VideoCardDialog :gesture="viewedGesture" @close-dialog=" wordDialog=false "></VideoCardDialog>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import image from '~/assets/images/placeholder-user.png'
import PageHeader from '~/components/generic/PageHeader'
import VideoCard from '~/components/profile/VideoCard'
import VideoCardDialog from '~/components/profile/VideoCardDialog'
import editDialog from '~/components/profile/editDialog'
import changePasswordDialog from '~/components/profile/changePasswordDialog'
import moment from 'moment'
import { deserialize } from 'jsonapi-deserializer'
export default {
  components: { PageHeader, VideoCard, VideoCardDialog, editDialog, changePasswordDialog },
  data () {
    return {
      defaultImage: image,
      contributions: [],
      wordDialog: false,
      editDialog: false,
      changePasswordDialog: false,
      viewedGesture: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  async asyncData ({ app, $axios }) {
    try {
      let contributions = deserialize((await $axios.get('/user/contributions')).data)
      return { contributions }
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    imageSrc () {
      if (!this.user.image) {
        return this.defaultImage
      }
      return this.user.image
    },
    arabicDate () {
      return moment(this.user.date_of_birth).locale('ar').format('Do MMMM YYYY')
    },
    openGesturesDialog (gesture) {
      this.wordDialog = true
      this.viewedGesture = gesture
    },
    redirect (state) {
      this.$router.push({ name: 'contribute-upload', params: { parentState: state } })
    }
  }
}
</script>

<style scoped>
  .video-method-btn {
    width: 200px;
    height: 50px;
  }
  .full-round-corners-square {
    border-radius:50%
  }
  h2 {
    font-weight: normal
  }
  .full-height {
    height: 100%
  }
  .btn-height {
    height: 50px
  }
  .edit-btn-width {
    width: 120px
  }
</style>
