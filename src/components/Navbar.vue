<template>
  <!-- Navbar -->
  <div
    class="tw-z-[9] tw-flex tw-w-full tw-justify-between tw-bg-gradient-to-b tw-from-[#D6F0F2] tw-to-[#fff] tw-py-2 tw-px-1 tw-pb-3 tw-text-sm sm:tw-pl-2 sm:tw-pr-4 sm:tw-text-base"
    :style="`height: ${height}px`"
    id="phl-progress-navbar"
  >
    <card-modal :showing="showDownloadPopup" widthClass="tw-max-w-lg">
      <div
        class="tw-my-4 tw-flex tw-h-full tw-min-h-[300px] tw-w-full tw-flex-col"
      >
        <!-- Title-->
        <div class="tw-text-2xl tw-font-semibold">Download Data</div>

        <div class="tw-mt-8">
          <label class="tw-text-xs tw-italic"
            >Choose variable to download</label
          >
          <dropdown
            class="-tw-mt-1 tw-text-base"
            :options="downloadOptions"
            v-model="selectedDownloadOption"
          />
        </div>

        <!-- Download button -->
        <div class="tw-mt-10 tw-flex tw-w-full tw-justify-center">
          <div
            class="btn-default-colors tw-mt-4 tw-min-w-[100px] tw-rounded tw-border-[1px] tw-border-solid tw-px-3 tw-py-3 tw-text-center tw-text-sm tw-font-semibold tw-uppercase tw-tracking-[2px] sm:tw-w-fit sm:tw-border-[2px] sm:tw-text-xs md:tw-text-sm"
            role="button"
            tabindex="0"
            @click.prevent="downloadData"
            @keydown.enter.prevent="downloadData"
            @keydown.space.prevent="downloadData"
          >
            Download data
          </div>
        </div>
      </div>
    </card-modal>

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
    <div v-if="useFullNavbar" class="tw-flex tw-h-full tw-items-end">
      <!-- Go to -->
      <div class="tw-flex tw-items-end">
        <div class="tw-pb-1 tw-text-sm tw-italic">go to:</div>

        <template v-for="(page, i) in pages">
          <div
            class="tw-border-b-2 tw-text-base hover:tw-cursor-pointer hover:tw-text-[#0F7582] focus:tw-text-[#0F7582] focus:tw-outline-offset-4"
            :class="{
              'tw-border-zinc-800 tw-font-semibold hover:tw-border-[#0F7582] focus:tw-border-[#0F7582]':
                isSelected(page),
              'tw-border-zinc-800/0': !isSelected(page),
              'tw-ml-4': i == 0,
              'tw-ml-6': i > 0,
            }"
            tabindex="0"
            @click.prevent="goTo(page)"
            @keydown.enter.prevent="goTo(page)"
            @keydown.space.prevent="goTo(page)"
          >
            {{ page }}
          </div>
          <div
            v-if="page !== 'scorecards'"
            class="tw-ml-1.5 tw-pb-0.5 tw-text-base"
          >
            <i :class="icons[i]"></i>
          </div>
          <div v-else class="tw-ml-1.5 tw-pb-0.5 tw-text-base">
            <font-awesome-layers full-width>
              <font-awesome-icon icon="fas fa-table" />
              <font-awesome-layers-text
                v-show="showScorecardBadge"
                counter
                :value="scorecardTractNames ? scorecardTractNames.length : 0"
                position="top-right"
                class="scorecard-badge"
              />
            </font-awesome-layers>
          </div>
        </template>
      </div>

      <icon-dropdown
        class="tw-ml-8"
        :options="menuOptions"
        :option-callbacks="menuCallbacks"
      >
        <i class="fas fa-bars tw-text-2xl"></i>
      </icon-dropdown>
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
import IconDropdown from "./Dropdowns/IconDropdown";
import Dropdown from "./Dropdowns/Dropdown";
import CardModal from "./CardModal";
import { mapState } from "vuex";
import * as Papa from "papaparse";

/***
 * Download the content to the specified file
 */
export function downloadFile(content, contentType, fileName) {
  // Create the link
  const a = document.createElement("a");

  // Create object to download
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);

  // Set the file name
  a.download = fileName;

  // Trigger download
  a.click();
}

export default {
  name: "Navbar",
  components: { IconDropdown, CardModal, Dropdown },
  props: {
    /**
     * Height of the navbar
     */
    height: { type: Number, required: true },
  },

  data() {
    return {
      pages: ["explorer", "scorecards", "definitions"],
      icons: ["fas fa-search", "fas fa-table", "fas fa-info-circle"],

      /**
       * Show download modal
       */
      showDownloadPopup: false,
      selectedDownloadOption: "all_variables",
    };
  },

  computed: {
    ...mapState(["scorecardTractNames", "metadata", "data"]),

    useFullNavbar() {
      if (this.$mq == "mobile") return false;
      else if (this.$mq == "sm") return false;
      else return true;
    },

    menuOptions() {
      let out = [
        "About",
        "Download Data",
        "Detailed Methodology",
        "Social Progress Imperative",
      ];
      return out;
    },

    menuCallbacks() {
      return [
        () => this.goTo("about"),
        () => (this.showDownloadPopup = true),
        () => {
          this.externalLink(
            "https://controller.phila.gov/wp-content/uploads/2023/03/ProgressPHL-Methodological-Note.pdf"
          );
        },
        () => {
          this.externalLink("https://www.socialprogress.org/");
        },
      ];
    },

    mobileMenuOptions() {
      let out = this.pages
        .filter((d) => d !== "scorecards")
        .map((text) => text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()));
      return out.concat(this.menuOptions);
    },

    mobileMenuCallbacks() {
      let out = this.pages
        .filter((d) => d !== "scorecards")
        .map((s) => () => this.goTo(s));
      return out.concat(this.menuCallbacks);
    },

    showScorecardBadge() {
      return (
        this.scorecardTractNames !== undefined &&
        this.scorecardTractNames.length > 0
      );
    },

    /**
     * SPI variable names
     */
    SPIVariables() {
      let out = ["social_progress_index"];
      const dimensions = this.metadata.hierarchy["social_progress_index"];

      // Loop over dimensions and components and indicators
      for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        out.push(dim);
        const components = this.metadata.hierarchy[dim];
        for (let j = 0; j < components.length; j++) {
          const component = components[j];
          out.push(component);
        }
      }

      return out;
    },

    downloadOptions() {
      let out = [{ label: "All variables", value: "all_variables" }];
      for (let i = 0; i < this.SPIVariables.length; i++) {
        let variable = this.SPIVariables[i];
        out.push({ label: this.metadata.aliases[variable], value: variable });
      }
      return out;
    },
  },

  methods: {
    /**
     * Download the data as a CSV
     */
    downloadData() {
      // Which variables to download
      let variables;
      if (this.selectedDownloadOption === "all_variables")
        variables = this.SPIVariables;
      else variables = [this.selectedDownloadOption];

      // Concat and add a variable column
      let out = [];
      for (let i = 0; i < variables.length; i++) {
        out = out.concat(
          this.data[variables[i]].map((v) => ({
            ...v,
            variable: this.metadata.aliases[variables[i]],
          }))
        );
      }

      let content = Papa.unparse(out);
      let filename;
      console.log(variables);
      if (variables.length == 1)
        filename = `progressphl_data_${this.selectedDownloadOption}.csv`;
      else filename = "progressphl_data_all_variables.csv";

      let contentType = "text/plain";
      downloadFile(content, contentType, filename);

      // Close popup
      this.showDownloadPopup = false;
    },
    goTo(page) {
      let path = `/${page}`;
      if (page === "scorecards" && this.showScorecardBadge) {
        path = `${page}/${this.scorecardTractNames.join("/")}`;
      }
      if (this.$route.path !== path) this.$router.push(path);
    },
    isSelected(page) {
      return this.$route.path.startsWith(`/${page}`);
    },
    externalLink(url) {
      window.open(url, "_blank").focus();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@700&display=swap");

.scorecard-badge {
  background: Tomato;
  transform: scale(0.7, 0.7);
  top: -0.75rem;
  right: -0.5rem;
}
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
