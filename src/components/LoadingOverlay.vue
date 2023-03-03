<template>
  <div
    class="tw-absolute tw-top-0 tw-left-0 tw-z-[7] tw-h-full tw-w-full tw-items-center tw-justify-center tw-bg-white tw-bg-opacity-75"
  >
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingOverlay",
};
</script>

<style scoped>
.loader-wrapper {
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #e5e7eb;
  border-bottom-color: #0f7582;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
