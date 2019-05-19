<template>
  <svg class="spinner" viewBox="0 0 50 50">
    <circle
      class="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke-width="5"
    ></circle>
  </svg>
</template>

<script>
export default {
  name: 'LoadingSpinner'
};
</script>

<style scoped>
.spinner {
  -webkit-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
  z-index: 2;
  width: 40px;
  height: 40px;
  margin-top: 11px;
  margin-bottom: 11px;
}
.spinner .path {
  stroke: white;
  stroke-linecap: round;
  -webkit-animation: dash 1.5s ease-in-out infinite;
  animation: dash 1.5s ease-in-out infinite;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
