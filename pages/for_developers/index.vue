<template>
  <v-container class="mt-3">
    <PageHeader text="للمطورين" icon="contact_mail" />
    <v-card class="medium-round-corners light-box-shadow pa-4">
      <p class="body-2">
        لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور

        أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد

        أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس

        أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت

        نيولا باراياتيور. أيكسسيبتيور ساينت أوككايكات كيوبايداتات نون بروايدينت ,سيونت ان كيولبا

        كيو أوفيسيا ديسيريونتموليت انيم أيدي ايست لابوريوم.
      </p>
      <v-form ref="requestForm" @submit.prevent="submitRequest">
        <v-layout wrap>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.name"
              label="الاسم"
              type="text"
              :rules="generalValidationRules.required"
            />
          </v-flex>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.email"
              label="البريد الإلكتروني"
              type="email"
              :rules="[...generalValidationRules.required, ...generalValidationRules.email]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="requestData.purpose"
              label="الغرض"
              :rules="generalValidationRules.required"
            />
          </v-flex>
          <v-flex xs12>
            <v-btn class="blue-cyan-gradient fixed-size-btn" flat round dark @click="submitRequest">
              اطلب
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'

export default {
  components: {
    PageHeader
  },
  data () {
    return {
      requestData: {
        name: null,
        email: null,
        purpose: null
      }
    }
  },
  methods: {
    submitRequest () {
      if (this.$refs.requestForm.validate()) {
        // TODO: send request
      }
    }
  }
}
</script>

<style scoped>

</style>
