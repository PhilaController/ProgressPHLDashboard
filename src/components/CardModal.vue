<template>
  <transition name="fade">
    <div
      v-if="showing"
      class="tw-fixed tw-inset-0 tw-z-[10] tw-flex tw-h-screen tw-w-screen tw-items-center tw-justify-center tw-bg-slate-100/50 tw-px-10 tw-pb-4"
      @click.self="close"
    >
      <div
        class="tw-relative tw-max-h-[80vh] tw-w-full tw-rounded-lg tw-bg-white tw-p-8 tw-shadow-lg"
        id="scrollableContainer"
        :class="styleClasses"
      >
        <button
          aria-label="close"
          class="modal-close-button tw-absolute tw-top-0 tw-right-0 tw-my-2 tw-mx-4 tw-border-0 tw-text-4xl tw-text-gray-500 hover:tw-text-[#0F7582] focus:tw-text-[#0F7582]"
          @click.prevent="close"
        >
          ×
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showing: {
      required: true,
      type: Boolean,
    },

    useScroll: {
      type: Boolean,
      default: true,
    },

    widthClass: {
      type: String,
      default: "tw-max-w-2xl",
    },
  },
  data() {
    return { scrollTop: null };
  },
  computed: {
    styleClasses() {
      let out = this.widthClass;
      if (this.useScroll) out += " tw-overflow-y-scroll";
      return out;
    },
  },
  watch: {
    showing(value) {
      if (value) {
        return document.querySelector("body").classList.add("overflow-hidden");
      }

      document.querySelector("body").classList.remove("overflow-hidden");
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-close-button:active,
.modal-close-button:focus,
.modal-close-button:visited {
  background-color: transparent !important;
  outline-width: 0px !important;
}
</style>
