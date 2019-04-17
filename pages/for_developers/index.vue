<template>
  <v-container>
    <PageHeader text="للمطورين" icon="contact_mail" />
    <v-card class="medium-round-corners light-box-shadow pa-4">
      <p class="body-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusamus alias animi aut delectus deleniti error excepturi exercitationem incidunt inventore, laboriosam molestias, nulla porro quis recusandae reprehenderit sunt veritatis voluptates.
      </p>
      <v-form ref="requestForm" @submit.prevent="submitRequest">
        <v-layout wrap>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.name"
              label="الاسم"
              type="text"
              :rules="validationRules.required"
            />
          </v-flex>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="requestData.email"
              label="البريد الإلكتروني"
              type="email"
              :rules="[...validationRules.required, ...validationRules.email]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="requestData.purpose"
              label="الغرض"
              :rules="validationRules.required"
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
