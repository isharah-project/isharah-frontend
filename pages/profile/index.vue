<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs3>
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
              مشاركاتي
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile
              :class="{ 'list-active': state === 'reviews' }"
              @click="changeState('reviews')"
            >
              تقييماتي
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
      <v-flex xs9>
        <div v-if="state==='profile'">
          <PageHeader icon="person" text="الصفحة الشخصية" />
          <v-layout row wrap class="justify-center">
            <v-flex xs12>
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
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 my-3>
              <v-card class="small-round-corners light-box-shadow">
                <v-container>
                  <myContributions :contributions="contributions"></myContributions>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 my-3>
              <v-card class="small-round-corners light-box-shadow">
                <v-container>
                  <myReviews></myReviews>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="state==='contributions'">
          <myContributions :contributions="contributions"></myContributions>
        </div>
        <div v-if="state==='reviews'">
          <myReviews></myReviews>
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
import myContributions from '~/components/profile/myContributions'
import myReviews from '~/components/profile/myReviews'
import editProfile from '~/components/profile/editProfile'
import moment from 'moment'
import _ from 'lodash'
import { deserialize } from 'jsonapi-deserializer'

export default {
  components: { PageHeader, myContributions, myReviews, editProfile },
  data () {
    return {
      defaultImage: image,
      contributions: [],
      userClone: {},
      state: 'profile'
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
    changeState (state) {
      this.state = state
      if (state === 'edit') {
        this.userClone = _.cloneDeep(this.user)
      }
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
.list-active >>> .v-list__tile {
  font-weight: bold
}
</style>
