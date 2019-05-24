<template>
  <v-container>
    <PageHeader icon="person" text="الصفحة الشخصية" />
    <v-layout row wrap class="justify-center">
      <v-flex xs12>
        <v-card class="light-box-shadow small-round-corners pa-4">
          <v-layout row wrap>
            <v-flex
              lg1
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
            <v-flex lg2 md2 sm3 xs8>
              <div class="headline font-weight-medium" :class="{'title': $vuetify.breakpoint.mdAndDown}">
                {{ user.first_name }} {{ user.last_name }}
              </div>
              <v-card-text class="ma-0 pa-0 grey--text">
                <div v-if="isUser(['User'])">
                  "مشارك"
                </div>
                <div v-if="isUser(['Reviewer'])">
                  "مراجع"
                </div>
                <div v-if="isUser(['Admin'])">
                  "مشرف"
                </div>
                {{ user.email }}
                <br />
                {{ user.city }} , {{ user.country }}
              </v-card-text>
            </v-flex>
            <v-flex lg7 md6 sm7 class="text-xs-center" :class="{ 'my-3': $vuetify.breakpoint.xsOnly }">
              <v-layout
                justify-space-between
                row
                fill-height
                class="subheading"
                :class="{ 'align-start': $vuetify.breakpoint.xsOnly, 'align-center': $vuetify.breakpoint.smAndUp }"
              >
                <v-flex xs6>
                  <v-layout row wrap justify-center align-center>
                    <v-flex lg3 sm5 xs12>
                      <v-icon size="40px">
                        video_library
                      </v-icon>
                      <div class="body-1" :class="{ 'font-weight-bold': $vuetify.breakpoint.xsOnly, 'caption': $vuetify.breakpoint.smOnly }">
                        المشاركات
                      </div>
                    </v-flex>
                    <v-divider v-if="$vuetify.breakpoint.smAndUp" vertical></v-divider>
                    <v-flex lg4 sm6 xs12>
                      <div class="body-1" :class="{ 'caption': $vuetify.breakpoint.mdAndDown }">
                        {{ acceptedCount }} مقبول
                      </div>
                      <div class="body-1" :class="{ 'caption': $vuetify.breakpoint.mdAndDown }">
                        {{ rejectedCount }} مرفوض
                      </div>
                      <div class="body-1" :class="{ 'caption': $vuetify.breakpoint.mdAndDown }">
                        {{ pendingCount }} قيد المراجعة
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs6>
                  <v-layout row wrap justify-center align-center>
                    <v-flex lg3 sm4 xs12>
                      <v-icon size="40px">
                        event
                      </v-icon>
                      <div class="body-1" :class="{ 'font-weight-bold': $vuetify.breakpoint.xsOnly, 'caption': $vuetify.breakpoint.smOnly }">
                        عضو منذ
                      </div>
                    </v-flex>
                    <v-divider v-if="$vuetify.breakpoint.smAndUp" vertical></v-divider>
                    <v-flex lg4 sm7 xs12>
                      <div :class="{ 'body-2': $vuetify.breakpoint.mdAndDown }">
                        {{ accountDate }}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex md2 xs12 align-self-end class="text-xs-center" :class="{ 'mt-3': $vuetify.breakpoint.smOnly }">
              <v-btn
                class="blue-border-btn btn-shadow edit-btn-width"
                flat
                round
                small
                @click="openEditDialog"
              >
                تعديل البيانات
              </v-btn>
              <v-btn
                v-if="user.provider == 'email'"
                class="blue-border-btn btn-shadow edit-btn-width"
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
      <v-dialog v-model="editDialog" max-width="400px" @keydown.esc="editDialog = false">
        <EditDialog :userClone="userClone" @closeDialog="editDialog = false"></EditDialog>
      </v-dialog>
      <v-dialog v-model="changePasswordDialog" max-width="400px" @keydown.esc="changePasswordDialog = false">
        <ChangePasswordDialog @closeDialog="changePasswordDialog = false"></ChangePasswordDialog>
      </v-dialog>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 mt-3>
        <v-card class="small-round-corners light-box-shadow">
          <v-container>
            <Gestures text="المشاركات" icon="videocam" url="/user/contributions"></Gestures>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import image from '~/assets/images/placeholder-user.jpg'
import PageHeader from '~/components/generic/PageHeader'
import EditDialog from '~/components/profile/EditDialog'
import ChangePasswordDialog from '~/components/profile/ChangePasswordDialog'
import Gestures from '~/components/profile/Gestures'
import moment from 'moment'
import _ from 'lodash'
import { deserialize } from 'jsonapi-deserializer'

export default {
  components: {
    PageHeader,
    EditDialog,
    ChangePasswordDialog,
    Gestures
  },
  data () {
    return {
      defaultImage: image,
      accountDate: '',
      pendingCount: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      editDialog: false,
      changePasswordDialog: false,
      userClone: {}
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userImageSrc () {
      if (!this.user || !this.user.image) {
        return this.defaultImage
      }
      return this.user.image
    }
  },
  async asyncData ({ app, $axios }) {
    try {
      let account = deserialize((await $axios.get('/user/')).data)
      let pendingCount = account.pending_contributions_count.toLocaleString('ar-EG')
      let rejectedCount = account.rejected_contributions_count.toLocaleString('ar-EG')
      let acceptedCount = account.accepted_contributions_count.toLocaleString('ar-EG')
      let accountDate = account.created_at
      accountDate = moment(accountDate).locale('ar').format('Do MMMM YYYY')
      return { accountDate, pendingCount, rejectedCount, acceptedCount }
    } catch (e) {
      this.$store.commit('showErrorMsg', {
        message: 'حدث خطأ ما, الرجاء المحاولة مرة اخرى'
      })
    }
  },
  methods: {
    openEditDialog () {
      this.userClone = _.cloneDeep(this.user)
      this.editDialog = true
    }
  }
}
</script>

<style scoped>
.user-image {
  border-radius: 50%;
}
.edit-btn-width {
  width: 120px
}
</style>
