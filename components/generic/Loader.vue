<template>
  <div class="content-wrapper">
    <div v-if="active" class="spinner-container medium-round-corners">
      <v-progress-circular
        v-if="$attrs.progress"
        :rotate="-90"
        :size="100"
        :width="15"
        :value="progressValue"
        color="primary"
      >
        <b>
          {{ `${progressValue} %` }}
        </b>
      </v-progress-circular>
      <div v-else class="spinner"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    progressValue: {
      type: Number,
      required: false,
      default: 0
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/helpers/colors";

.content-wrapper {
  position: relative;
}
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 4;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.65);
}
.spinner {
  width: 40px;
  height: 40px;
  background-color: $blue;
  border-radius: 100%;
  -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
  animation: sk-scaleout 1.0s infinite ease-in-out;
}

@keyframes sk-scaleout {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1.0);
    opacity: 0;
  }
}
</style>
