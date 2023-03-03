<template>
  <div class="tw-flex tw-h-screen tw-w-full tw-items-center tw-justify-center">
    <span class="loader"></span>
  </div>
</template>

<script>
export default {
  name: "LoadingPage",
};
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #e5e7eb;
  border-bottom-color: #0f7582;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
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
