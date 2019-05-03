<template>
  <v-container>
    <PageHeader icon="videocam" text="اضف إشارة للقاموس" class="mb-0" />
    <GestureUpload
      submitEndPoint="gestures"
      autoCompleteEndPoint="autocomplete/words"
      autoCompleteItemText="name"
      autoCompleteLabel="اختر الكلمة"
      :autoCompleteDeserializeResults="true"
    />
  </v-container>
</template>

<script>
import PageHeader from '~/components/generic/PageHeader'
import GestureUpload from '~/components/contribute/GestureUpload'

export default {
  components: {
    PageHeader,
    GestureUpload
  }
}
</script>

<style>

</style>
