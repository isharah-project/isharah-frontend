<template>
  <div class="container text-xs-center">
    <div v-if="error.statusCode === 404">
      <h1 class="status-code">
        404
      </h1>
      <h1>الصفحة غير موجودة</h1>
    </div>
    <h1 v-else>
      حدث خطأ ما, برجاء المحاولة مرة اخرى
    </h1>
    <v-btn flat round class="white--text btn-shadow blue-cyan-gradient mt-3" @click="navigate">
      {{ error.statusCode === 404 ? 'الرئيسية' : 'الرجوع' }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  methods: {
    navigate () {
      if (this.error.statusCode === 404) {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 100px;
}
.status-code {
  font-size: 10rem;
}
</style>
