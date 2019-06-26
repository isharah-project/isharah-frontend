<template>
  <v-container class="mt-3">
    <PageHeader icon="contact_mail" text="تواصل معنا" />
    <v-card class="medium-round-corners light-box-shadow pa-4">
      <p>لديك سؤال او استفسار؟ نحن نرحب بالتواصل معنا عن طريق ملء البيانات بالأسفل</p>
      <v-form
        ref="contactForm"
        action="https://formspree.io/ishara.developers.2019@gmail.com"
        method="POST"
        @submit.prevent="submitForm"
      >
        <v-layout wrap>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="contactForm.name"
              name="name"
              label="الاسم"
              type="text"
              :rules="generalValidationRules.required"
            />
          </v-flex>
          <v-flex xs12 sm12 md6>
            <v-text-field
              v-model="contactForm.email"
              label="البريد الإلكتروني"
              type="email"
              name="email"
              :rules="[...generalValidationRules.required, ...generalValidationRules.email]"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="contactForm.message"
              label="الرسالة"
              name="message"
              :rules="generalValidationRules.required"
            />
          </v-flex>
          <v-flex xs12>
            <button type="submit" class="submit-btn blue-gradient fixed-size-btn btn-shadow white--text">
              إرسال
            </button>
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
      contactForm: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm () {
      if (this.$refs.contactForm.validate()) {
        this.$refs.contactForm.$el.submit()
      }
    }
  }
}
</script>

<style scoped>
.submit-btn {
  border-radius: 28px;
}
</style>
