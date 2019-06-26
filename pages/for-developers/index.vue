<template>
  <v-container class="mt-3">
    <PageHeader text="للمطورين" icon="contact_mail" />
    <v-card class="medium-round-corners light-box-shadow pa-4">
      <v-form
        ref="requestForm"
        method="POST"
        action="https://formspree.io/ishara.developers.2019@gmail.com"
        @submit.prevent="submitRequest"
      >
        <v-layout wrap>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.name"
              label="الاسم"
              type="text"
              name="name"
              :rules="generalValidationRules.required"
            />
          </v-flex>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.email"
              label="البريد الإلكتروني"
              type="email"
              name="email"
              :rules="[...generalValidationRules.required, ...generalValidationRules.email]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="requestData.purpose"
              label="الغرض"
              name="purpose"
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
        this.$refs.requestForm.$el.submit()
      }
    }
  }
}
</script>

<style scoped>

</style>
