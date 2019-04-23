<template>
  <v-container>
    <PageHeader icon="person" text="الصفحة الشخصية" />
    <v-layout row wrap class="justify-center">
      <v-flex sm6 xs12 pr-2>
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
                :src="userImageSrc"
                max-width="100"
                :aspect-ratio="1/1"
                class="user-image ml-2"
              >
              </v-img>
            </v-flex>
            <v-flex lg5 md4 sm8 xs8 :class="{ 'pb-1': $vuetify.breakpoint.smAndDown }">
              <div class="headline font-weight-medium">
                {{ user.first_name }} {{ user.last_name }}
              </div>
              <v-card-text class="ma-0 pa-0 grey--text">
                {{ user.email }}
                <br />
                {{ userFormattedDate }}
                <br />
                {{ user.city }} , {{ user.country }}
              </v-card-text>
            </v-flex>
            <v-flex md5 xs12 align-self-end class="text-xs-center">
              <v-btn
                class="red-border-btn btn-shadow edit-btn-width"
                flat
                round
                small
                @click="openEditDialog"
              >
                تعديل البيانات
              </v-btn>
              <v-btn
                class="red-border-btn btn-shadow edit-btn-width"
                flat
                round
                small
                @click="changePasswordDialog = true"
              >
                تغيير كلمة السر
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-dialog v-model="editDialog" max-width="400px">
        <editDialog :userClone="userClone" @closeDialog="editDialog = false"></editDialog>
      </v-dialog>
      <v-dialog v-model="changePasswordDialog" max-width="400px">
        <changePasswordDialog @closeDialog="changePasswordDialog = false"></changePasswordDialog>
      </v-dialog>
      <v-flex xs6 sm3 class="text-xs-center px-2" :class="{ 'btn-height my-2': $vuetify.breakpoint.xsOnly }">
        <v-btn
          :class="{ 'display-1':$vuetify.breakpoint.smAndUp, 'title': $vuetify.breakpoint.xsOnly }"
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
      <v-flex xs6 sm3 class="text-xs-center pl-2" :class="{ 'btn-height my-2': $vuetify.breakpoint.xsOnly }">
        <v-btn
          :class="{ 'display-1':$vuetify.breakpoint.smAndUp, 'title': $vuetify.breakpoint.xsOnly }"
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
import _ from 'lodash'
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
      viewedGesture: {},
      userClone: {}
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userImageSrc () {
      if (!this.user.image) {
        return this.defaultImage
      }
      return this.user.image
    },
    userFormattedDate () {
      return moment(this.user.date_of_birth).locale('ar').format('Do MMMM YYYY')
    }
  },
  async asyncData ({ app, $axios }) {
    try {
      let contributions = deserialize((await $axios.get('/user/contributions')).data)
      return { contributions }
    } catch (e) {
      console.log(e)
      this.$store.commit('showErrorMsg', {
        message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
      })
    }
  },
  methods: {
    openEditDialog () {
      this.userClone = _.cloneDeep(this.user)
      this.editDialog = true
    },
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

<style scoped>
.user-image {
  border-radius: 50%;
}
.full-height {
  height: 100%;
}
.btn-height {
  height: 50px;
}
.edit-btn-width {
  width: 120px
}
</style>
