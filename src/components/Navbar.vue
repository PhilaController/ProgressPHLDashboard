<template>
  <!-- Navbar -->
  <div
    class="tw-z-[9] tw-flex tw-w-full tw-justify-between tw-bg-gradient-to-b tw-from-[#D6F0F2] tw-to-[#fff] tw-py-2 tw-px-1 tw-pb-3 tw-text-sm sm:tw-pl-2 sm:tw-pr-4 sm:tw-text-base"
    :style="`height: ${height}px`"
    id="phl-progress-navbar"
  >
    <!-- Logo -->
    <div
      class="tw-flex tw-h-full hover:tw-cursor-pointer focus:tw-outline-offset-4"
      tabindex="0"
      @click.prevent="goTo('')"
      @keydown.enter.prevent="goTo('')"
      @keydown.space.prevent="goTo('')"
    >
      <div class="tw-flex tw-w-[40px] tw-items-end">
        <div
          class="tw-mx-[1px] tw-h-1/3 tw-flex-grow tw-border tw-border-green-500 tw-bg-green-300"
        ></div>
        <div
          class="tw-mx-[1px] tw-h-2/3 tw-flex-grow tw-border tw-border-orange-500 tw-bg-orange-300"
        ></div>
        <div
          class="tw-mx-[1px] tw-h-full tw-flex-grow tw-border tw-border-cyan-500 tw-bg-cyan-300"
        ></div>
      </div>

      <!-- Name -->
      <div
        class="tw-ml-2 tw-flex tw-h-full tw-flex-row tw-items-end tw-font-['Montserrat'] tw-text-2xl tw-font-semibold tw-leading-none tw-text-[#0F7582] hover:tw-underline"
      >
        <div>Progress</div>
        <div class="tw-ml-0.5 tw-uppercase">PHL</div>
      </div>
      <div
        class="tw-pt-1 tw-font-['Montserrat'] tw-text-sm tw-font-medium tw-uppercase tw-leading-none tw-text-[#0F7582]"
      >
        BETA
      </div>
    </div>

    <!-- Right part (not mobile) -->
    <div v-if="$mq !== 'mobile'" class="tw-flex tw-h-full tw-items-end">
      <!-- Go to -->
      <div class="tw-flex tw-items-end">
        <div class="tw-pb-1 tw-text-sm tw-italic">go to:</div>
        <div
          v-for="page in pages"
          class="tw-ml-4 tw-border-b-2 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-border-[#0F7582] focus:tw-text-[#0F7582] focus:tw-outline-offset-4"
          :class="{
            'tw-border-zinc-800 tw-font-bold hover:tw-border-[#0F7582] focus:tw-border-[#0F7582]':
              isSelected(page),
            'tw-border-zinc-800/0': !isSelected(page),
          }"
          tabindex="0"
          :key="page"
          @click.prevent="goTo(page)"
          @keydown.enter.prevent="goTo(page)"
          @keydown.space.prevent="goTo(page)"
        >
          {{ page }}
        </div>
      </div>

      <!-- About -->
      <div
        class="tw-ml-8 tw-flex tw-items-end tw-border-b-2 hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-text-[#0F7582] focus:tw-outline-offset-4"
        :class="{
          'tw-border-zinc-800 tw-font-bold hover:tw-border-[#0F7582] focus:tw-border-[#0F7582]':
            isSelected('about'),
          'tw-border-zinc-800/0': !isSelected('about'),
        }"
        tabindex="0"
        @click.prevent="goTo('about')"
        @keydown.enter.prevent="goTo('about')"
        @keydown.space.prevent="goTo('about')"
      >
        <span>about</span
        ><span class="tw-ml-2 tw-text-xl"
          ><i class="fas fa-question-circle"></i
        ></span>
      </div>
    </div>
    <!-- Menu on mobile-->
    <div v-else class="tw-flex tw-h-full tw-items-end">
      <icon-dropdown
        :options="mobileMenuOptions"
        :option-callbacks="mobileMenuCallbacks"
      >
        <i class="fas fa-bars tw-text-2xl"></i>
      </icon-dropdown>
    </div>
  </div>
</template>

<script>
import IconDropdown from "./IconDropdown";

export default {
  name: "Navbar",
  components: { IconDropdown },
  props: {
    /**
     * Height of the navbar
     */
    height: { type: Number, required: true },
  },

  data() {
    return {
      pages: ["explorer", "definitions"],
    };
  },

  computed: {
    mobileMenuOptions() {
      let out = this.pages.map((text) =>
        text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      );
      out.push("About");
      return out;
    },

    mobileMenuCallbacks() {
      let out = this.pages.map((s) => () => this.goTo(s));
      out.push(() => this.goTo("about"));
      return out;
    },
  },

  methods: {
    goTo(page) {
      let path = `/${page}`;
      if (this.$route.path !== path) this.$router.push(path);
    },
    isSelected(page) {
      return this.$route.path.startsWith(`/${page}`);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@700&display=swap");

#logo {
  font-family: "Kanit", sans-serif;
}

#phl-progress-navbar {
  position: fixed;
}
@media (max-width: 736px) {
  #phl-progress-navbar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }
}
</style>
