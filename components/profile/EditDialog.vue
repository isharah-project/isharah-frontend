<template>
  <v-card class="relative-position small-round-corners light-box-shadow text-xs-center">
    <v-btn
      icon
      class="btn-position"
      @click="closeDialog()"
    >
      <v-icon>close</v-icon>
    </v-btn>
    <v-container>
      <v-card-text>
        <h2>
          تعديل البيانات
        </h2>
      </v-card-text>
      <Loader :active="loading">
        <v-form ref="editForm" @submit.prevent="submitEdit">
          <v-text-field
            v-model="userClone.first_name"
            label="الاسم الأول"
            validate-on-blur
            :rules="generalValidationRules.required"
          >
          </v-text-field>
          <v-text-field
            v-model="userClone.last_name"
            label="الاسم الأخير"
            validate-on-blur
            :rules="generalValidationRules.required"
          >
          </v-text-field>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="userClone.date_of_birth"
                label="تاريخ الميلاد"
                prepend-icon="event"
                readonly
                validate-on-blur
                :rules="generalValidationRules.required"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="userClone.date_of_birth"
              :max="minAge()"
              min="1950-01-01"
              locale="ar-EG"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
          <v-btn
            :ripple="false"
            dark
            flat
            round
            class="blue-cyan-gradient fixed-size-btn btn-shadow"
            type="submit"
          >
            تعديل
          </v-btn>
          <div v-for="error in editErrors" :key="error" class="red--text">
            - {{ error }}
          </div>
        </v-form>
      </Loader>
    </v-container>
  </v-card>
</template>
<script>
import Loader from '~/components/generic/Loader'
import { deserialize } from 'jsonapi-deserializer'

export default {
  components: { Loader },
  props: {
    userClone: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      date: null,
      today: new Date().toISOString(),
      maxYear: 0,
      editErrors: [],
      menu: false,
      loading: false
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.menu.save(date)
    },
    minAge () {
      this.maxYear = Number(this.today.substr(0, 4)) - 18
      return `${this.maxYear}${this.today.substr(4, 6)}`
    },
    submitEdit () {
      if (this.$refs.editForm.validate()) {
        this.loading = true
        this.$axios.$put('auth', {
          'first_name': this.userClone.first_name,
          'last_name': this.userClone.last_name,
          'date_of_birth': this.userClone.date_of_birth
        }).then((response) => {
          this.$store.commit('showSuccessMsg', {
            message: 'تم تعديل البيانات بنجاح'
          })
          this.$store.commit('setUser', deserialize(response))
          this.closeDialog()
          this.editErrors = []
        }).catch((e) => {
          this.editErrors = []
          this.editErrors.push(...e.response.data.errors.full_messages)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    closeDialog () {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style>
.relative-position {
  position: relative;
}
.btn-position {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 3;
}
</style>
