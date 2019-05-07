<template>
  <v-container>
    <v-layout row wrap>
      <v-flex v-if="$vuetify.breakpoint.mdAndUp" md3>
        <v-layout fill-height>
          <v-list subheader class="small-round-corners full-width ml-4">
            <v-list-tile
              :class="{ 'list-active': state === 'profile' }"
              @click="changeState('profile')"
            >
              الصفحة الشخصية
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile
              :class="{ 'list-active': state === 'contributions' }"
              @click="changeState('contributions')"
            >
              المشاركات
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile
              :class="{ 'list-active': state === 'reviews' }"
              @click="changeState('reviews')"
            >
              التقييمات
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile
              :class="{ 'list-active': state === 'edit' }"
              @click="changeState('edit')"
            >
              تغيير البيانات
            </v-list-tile>
            <v-divider></v-divider>
          </v-list>
        </v-layout>
      </v-flex>
      <v-flex v-else xs12 mb-3>
        <v-card flat class="small-round-corners light-box-shadow">
          <v-layout row wrap class="text-xs-center">
            <v-flex xs6 sm3>
              <v-btn flat :class="{'tab-active': state === 'profile'}" @click="changeState('profile')">
                الصفحة الشخصية
              </v-btn>
            </v-flex>
            <v-flex xs6 sm3>
              <v-btn flat :class="{'tab-active': state === 'contributions'}" @click="changeState('contributions')">
                المشاركات
              </v-btn>
            </v-flex>
            <v-flex xs6 sm3>
              <v-btn flat :class="{'tab-active': state === 'reviews'}" @click="changeState('reviews')">
                التقييمات
              </v-btn>
            </v-flex>
            <v-flex xs6 sm3>
              <v-btn flat :class="{'tab-active': state === 'edit'}" @click="changeState('edit')">
                تغيير البيانات
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
        <!-- <v-tabs subheader hide-slider class="small-round-corners">
          <v-tab
            :class="{ 'tab-active': state === 'profile' }"
            @click="changeState('profile')"
          >
            الصفحة الشخصية
          </v-tab>
          <v-tab
            :class="{ 'tab-active': state === 'contributions' }"
            @click="changeState('contributions')"
          >
            المشاركات
          </v-tab>
          <v-tab
            :class="{ 'tab-active': state === 'reviews' }"
            @click="changeState('reviews')"
          >
            التقييمات
          </v-tab>
          <v-tab
            :class="{ 'tab-active': state === 'edit' }"
            @click="changeState('edit')"
          >
            تغيير البيانات
          </v-tab>
        </v-tabs> -->
      </v-flex>
      <v-flex xs12 md9>
        <div v-if="state==='profile'">
          <PageHeader v-if="$vuetify.breakpoint.mdAndUp" icon="person" text="الصفحة الشخصية" />
          <v-layout row wrap class="justify-center">
            <v-flex xs12>
              <v-card class="light-box-shadow small-round-corners pa-4">
                <v-layout row wrap>
                  <v-flex
                    lg2
                    md3
                    sm2
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
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 mt-3>
              <v-card class="small-round-corners light-box-shadow">
                <v-container>
                  <PageHeader text="المشاركات" icon="videocam">
                  </PageHeader>
                  <v-layout row wrap class="mt-2">
                    <div v-if="!contributions" class="headline text-xs-center">
                      لا يوجد إشارات
                    </div>
                    <v-flex
                      v-else
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="openGesturesDialog(contributions[0])"
                    >
                      <VideoCard :gesture="contributions[0]">
                      </VideoCard>
                    </v-flex>
                    <v-flex
                      v-if="contributions[1] && $vuetify.breakpoint.mdAndUp"
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="openGesturesDialog(contributions[1])"
                    >
                      <VideoCard :gesture="contributions[1]">
                      </VideoCard>
                    </v-flex>
                    <v-flex
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="changeState('contributions')"
                    >
                      <v-card flat hover color="#eaeaea" class="small-round-corners full-height light-box-shadow pa-3">
                        <v-layout column align-center justify-center fill-height>
                          <v-icon size="80px" color="black">
                            arrow_back
                          </v-icon>
                          <h2>
                            المزيد
                          </h2>
                        </v-layout>
                      </v-card>
                    </v-flex>
                    <v-dialog v-model="wordDialog" max-width="500px">
                      <VideoCardDialog :gesture="viewedGesture" @closeDialog="wordDialog=false"></VideoCardDialog>
                    </v-dialog>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 mt-3>
              <v-card class="small-round-corners light-box-shadow">
                <v-container>
                  <PageHeader text="التقييمات" icon="rate_review">
                  </PageHeader>
                  <v-layout row wrap class="mt-2">
                    <div v-if="!contributions" class="headline text-xs-center">
                      لا يوجد إشارات
                    </div>
                    <v-flex
                      v-else
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="openGesturesDialog(contributions[0])"
                    >
                      <VideoCard :gesture="contributions[0]">
                      </VideoCard>
                    </v-flex>
                    <v-flex
                      v-if="contributions[1] && $vuetify.breakpoint.mdAndUp"
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="openGesturesDialog(contributions[1])"
                    >
                      <VideoCard :gesture="contributions[1]">
                      </VideoCard>
                    </v-flex>
                    <v-flex
                      xs12
                      sm6
                      md4
                      pa-2
                      clickable
                      @click="changeState('reviews')"
                    >
                      <v-card flat hover color="#eaeaea" class="small-round-corners full-height light-box-shadow pa-3">
                        <v-layout column align-center justify-center fill-height>
                          <v-icon size="80px" color="black">
                            arrow_back
                          </v-icon>
                          <h2>
                            المزيد
                          </h2>
                        </v-layout>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="state==='contributions'">
          <gestures text="المشاركات" icon="videocam" url="/user/contributions"></gestures>
        </div>
        <div v-if="state==='reviews'">
          <gestures text="التقييمات" icon="rate_review" url="/user/contributions"></gestures>
        </div>
        <div v-if="state==='edit'">
          <editProfile :userClone="userClone"></editProfile>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import image from '~/assets/images/placeholder-user.png'
import PageHeader from '~/components/generic/PageHeader'
import gestures from '~/components/profile/gestures'
import editProfile from '~/components/profile/editProfile'
import VideoCard from '~/components/profile/VideoCard'
import VideoCardDialog from '~/components/profile/VideoCardDialog'
import moment from 'moment'
import _ from 'lodash'
import { deserialize } from 'jsonapi-deserializer'

export default {
  components: { PageHeader, gestures, editProfile, VideoCard, VideoCardDialog },
  data () {
    return {
      defaultImage: image,
      contributions: [],
      userClone: {},
      state: 'profile',
      wordDialog: false,
      viewedGesture: {},
      response: []
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
      let response = (await $axios.get('/user/contributions?page=1&per_page=2'))
      let contributions = deserialize(response.data)
      return { contributions }
    } catch (e) {
      console.log(e)
      this.$store.commit('showErrorMsg', {
        message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
      })
    }
  },
  methods: {
    changeState (state) {
      this.state = state
      if (state === 'edit') {
        this.userClone = _.cloneDeep(this.user)
      }
    },
    openGesturesDialog (gesture) {
      this.wordDialog = true
      this.viewedGesture = gesture
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
.list-active {
  border-right: solid 2px blue;
}
.tab-active {
  border-bottom: solid 2px blue;
  font-weight: bold
}
.list-active >>> .v-list__tile {
  font-weight: bold
}
</style>
