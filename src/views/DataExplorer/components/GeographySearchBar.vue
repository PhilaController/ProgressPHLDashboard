<template>
  <div
    ref="menuButtonActions"
    v-click-outside="onClickOutside"
    class="tw-relative tw-inline-block tw-w-full"
  >
    <!-- Menu button -->
    <button
      :id="`dd-${id}`"
      ref="buttonNode"
      class="tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-t tw-border tw-border-gray-300 tw-bg-white tw-py-1 tw-px-2 tw-text-left hover:tw-border hover:tw-border-gray-300 hover:tw-bg-white focus:tw-border focus:tw-border-gray-300 focus:tw-bg-white focus:tw-outline-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-40 disabled:focus:tw-outline-none"
      :class="{ 'tw-rounded-b': !isOpen }"
      aria-haspopup="true"
      :aria-controls="`dd-${id}__menu`"
      :value="selectedOptionLabel"
      @click="onButtonClick"
      @keydown="onButtonKeydown"
      :disabled="disabled"
    >
      <span
        v-if="alwaysPlaceholder || selectedOptionLabel == null"
        class="tw-block tw-truncate tw-break-all tw-pr-2 tw-text-[1em] tw-text-gray-700/50"
        >{{ placeholder }}</span
      >
      <span
        v-else
        class="tw-block tw-truncate tw-break-all tw-pr-2 tw-text-[1em] tw-font-bold tw-text-gray-700"
        >{{ selectedOptionLabel }}
      </span>

      <!-- Expand/Collapse Icon -->
      <div
        class="tw-ml-4 tw-flex tw-flex-col tw-justify-center tw-pb-1 tw-text-[1.2em] tw-text-[#0F7582] focus:tw-text-[#0F7582]"
      >
        <font-awesome-icon v-if="!isOpen" icon="fa-solid fa-caret-down" />
        <font-awesome-icon v-else icon="fa-solid fa-caret-up" />
      </div>
    </button>

    <!-- Dropdown -->
    <div
      :id="`dd-${id}__menu`"
      class="tw-absolute tw-z-[8] tw-hidden tw-max-h-[300px] tw-w-full tw-overflow-scroll tw-rounded-b tw-border-b tw-border-l tw-border-r tw-border-gray-300 tw-bg-white tw-shadow-sm focus:tw-text-inherit"
      :class="{ 'tw-rounded-t': !isOpen }"
    >
      <!-- Input wrapper -->
      <div class="tw-my-2 tw-flex tw-w-full tw-flex-row">
        <!-- Input -->
        <input
          class="tw-mx-1 tw-w-full tw-border tw-border-gray-300 tw-bg-white tw-p-1 tw-text-[0.75em]"
          ref="textInput"
          v-model="searchQuery"
          @input="onInput"
          @keydown="onMenuKeydown"
        />
      </div>

      <!-- List of visible options to click -->
      <ul
        v-if="visibleOptions.length > 0"
        ref="menuNode"
        role="menu"
        :aria-labelledby="`dd-${id}`"
        :aria-activedescendant="
          getMenuItemId(
            focusedMenuitem === null ? selectedMenuitem : focusedMenuitem
          )
        "
        @keydown="onMenuKeydown"
      >
        <!-- List item -->
        <li
          v-for="(option, index) in visibleOptions"
          :id="getMenuItemId(index)"
          :key="getMenuItemId(index)"
          :class="getListItemStyle(index)"
          role="menuitem"
          tabindex="-1"
          :data-index="index"
          :data-value="option.name"
          @click="onMenuitemClick"
          @mouseover="onMenuitemMouseover"
        >
          <!-- Option content -->
          <div
            class="tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-2"
          >
            <!-- Option Label -->
            <div class="tw-block tw-truncate">
              <span class="tw-text-[0.75em]">{{ option.name }}</span>
              <span
                class="tw-ml-2 tw-text-[0.55em] tw-font-semibold tw-uppercase tw-tracking-wide"
                :class="{
                  'tw-text-gray-400': index !== selectedMenuitem,
                  'tw-text-white': index === selectedMenuitem,
                }"
                >{{ option.type }}</span
              >
            </div>

            <!-- Check mark if selected -->
            <svg
              v-if="option.name == value"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="tw-h-4 tw-w-4 tw-fill-current"
            >
              <polygon points="0 11 2 9 7 14 18 3 20 5 7 18"></polygon>
            </svg>
          </div>
        </li>
      </ul>
      <div v-else-if="isLoading" class="tw-px-3 tw-py-2 tw-text-[0.75em]">
        Loading...
      </div>
      <div v-else="isLoading" class="tw-px-3 tw-py-2 tw-text-[0.75em]">
        No results found
      </div>
    </div>
  </div>
</template>

<script>
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

/**
 * Get request to the specified, or raise an error
 */
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export default {
  name: "GeographySearchBar",
  props: {
    /**
     * Census tracts geojson
     */
    tractFeatures: { type: Array, required: true },

    /**
     * Neighborhood names
     */
    neighborhoodNames: { type: Array, required: true },

    /**
     * Region names
     */
    regionNames: { type: Array, required: true },

    /**
     * Selected value
     */
    value: {
      type: [String, Number],
      default: "",
    },

    /**
     * Always show placeholder
     */
    alwaysPlaceholder: {
      type: Boolean,
      default: true,
    },

    /**
     * Random id is generated if none provided
     */
    id: {
      type: String,
      default: () => `dd_${Math.random().toString(12).substring(2, 8)}`,
    },

    /**
     * Placeholder to use
     */
    placeholder: {
      type: String,
    },

    /**
     * Is the dropdown disabled?
     */
    disabled: { type: Boolean, default: false },

    /**
     * Additional style classes
     */
    selectButtonLabelClasses: {
      type: String,
      default: "",
    },
    focusedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-300/50",
    },
    focusedSelectedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-600",
    },
    placeholderClasses: {
      type: String,
      default: "tw-text-neutral-500/70 tw-italic",
    },
    selectedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-500",
    },
  },

  data() {
    return {
      /**
       * Track while the AIS API call is in progress
       */
      isLoading: false,

      /**
       * Track the timeout for input response
       */
      timeout: null,

      /**
       * Array of visible options
       */
      visibleOptions: null,

      /**
       * Search query text from input
       */
      searchQuery: "",

      /**
       * The selected menu item
       */
      selectedMenuitem: null,

      /**
       * Which item is focused
       */
      focusedMenuitem: null,

      /**
       * The selected option label
       */
      selectedOptionLabel: null,

      /**
       * The first menu item
       */
      firstMenuitem: 0,

      /**
       * Is the popup open?
       */
      isOpen: false,
    };
  },

  computed: {
    /**
     * All options, composed of region and neighborhood names
     */
    options() {
      let options = [];
      for (let i = 0; i < this.regionNames.length; i++) {
        let name = this.regionNames[i];
        options.push({ name: name, type: "Region" });
      }
      for (let i = 0; i < this.neighborhoodNames.length; i++) {
        let name = this.neighborhoodNames[i];
        options.push({ name: name, type: "Neighborhood" });
      }
      return options;
    },

    /**
     * Track the end of the visible list
     */
    lastMenuitem() {
      return this.visibleOptions.length - 1;
    },
  },

  created() {
    // Initialize the visible options
    this.visibleOptions = this.options;

    // Determine selected menu item
    let option;
    for (let i = 0; i < this.visibleOptions.length; i++) {
      let o = this.visibleOptions[i];
      if (o.name === this.value) {
        option = o;
        this.selectedMenuitem = i;
        break;
      }
    }

    if (option !== undefined) {
      // Set the default
      this.selectedOptionLabel = option.label;
    }
  },
  watch: {
    /**
     * Handle external updates to the dropdown value
     */
    value(newValue) {
      // We have an option selected
      if (newValue !== null) {
        let flag = false;
        for (let i = 0; i < this.visibleOptions.length; i++) {
          let o = this.visibleOptions[i];
          if (o.name === newValue) {
            this.selectedMenuitem = i;
            this.selectedOptionLabel = o.name;
            flag = true;
            break;
          }
        }

        // If we didn't find a match, set the label
        if (!flag) {
          this.visibleOptions.push({
            name: newValue,
            type: "Neighborhood Tract",
          });
          this.selectedMenuitem = this.visibleOptions.length - 1;
          this.selectedOptionLabel = newValue;
        }
      }
      // Clear
      else {
        this.selectedMenuitem = null;
        this.selectedOptionLabel = null;
      }
    },
  },
  methods: {
    /**
     * Async function to search for address
     */
    async searchAddress(value) {
      this.isLoading = true;
      let url = `https://api.phila.gov/ais/v1/search/${value}?gatekeeperKey=c9c8f288dd8ece82a5b870d6dad470a0`;
      let response = await safeFetch(url);

      if (response.status === 404) {
        this.errors = ["No matching addresses."];
        this.isLoading = false;
      } else {
        if (response.features.length < 1) {
          this.errors = ["No matching addresses."];
          this.isLoading = false;
        } else {
          let pt = point(response.features[0].geometry.coordinates);

          // Find the census tract match
          let match;
          for (let i = 0; i < this.tractFeatures.length; i++) {
            let feature = this.tractFeatures[i];
            if (booleanPointInPolygon(pt, feature)) {
              match = feature.properties;
              break;
            }
          }

          if (match) {
            this.visibleOptions.push({
              name: `${match.neighborhood_name} ${match.tract_id}`,
              type: "Neighborhood Tract",
            });
          }

          this.isLoading = false;
        }
      }
    },

    /**
     * Handle the keydown event on the button
     */
    onButtonKeydown(event) {
      let key = event.key;
      let flag = false;

      switch (key) {
        case " ":
        case "Enter":
        case "ArrowDown":
        case "Down":
          this.openPopup();
          flag = true;
          break;
        case "Esc":
        case "Escape":
          this.closePopup();
          flag = true;
          break;
        case "Up":
        case "ArrowUp":
          this.openPopup();
          flag = true;
          break;
        default:
          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    /**
     * Open/close when the button is clicked
     */
    onButtonClick(event) {
      if (this.isOpen) {
        this.closePopup();
      } else {
        this.openPopup();
      }
      event.preventDefault();
    },

    /**
     * Handle keydown on the menu
     */
    onMenuKeydown(event) {
      let key = event.key;
      let flag = false;

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.shiftKey) {
        if (event.key === "Tab") {
          this.closePopup();
          flag = true;
        }
      } else {
        switch (key) {
          case " ":
            break;
          case "Enter":
            this.performMenuAction();
            this.closePopup();
            flag = true;
            break;

          case "Esc":
          case "Escape":
            this.closePopup();
            flag = true;
            break;

          case "Up":
          case "ArrowUp":
            this.setFocusToPreviousMenuitem();
            flag = true;
            break;

          case "ArrowDown":
          case "Down":
            this.setFocusToNextMenuitem();
            flag = true;
            break;

          case "Tab":
            this.closePopup();
            break;

          default:
            break;
        }
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },

    onMenuitemMouseover(event) {
      var tgt = event.currentTarget;
      let index = parseInt(tgt.getAttribute("data-index"));
      this.setFocusToMenuitem(index);
    },

    onMenuitemClick() {
      this.performMenuAction();
      this.closePopup();
    },

    /**
     * Trim visible options list by the input (on a delay)
     */
    onInput(event, time = 500) {
      // Clear any existing timeout
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        // Try GEOIDs
        let isnum = /^\d+$/.test(this.searchQuery);
        let flag = false;

        if (this.searchQuery.length == 11 && isnum) {
          let match = this.tractFeatures.filter(
            (d) => d.properties.geoid === this.searchQuery
          );

          if (match) {
            match = match[0].properties;
            this.visibleOptions = [
              {
                name: `${match.neighborhood_name} ${match.tract_id}`,
                type: "Neighborhood Tract",
              },
            ];
            flag = true;
          }
        }

        // Set the visible options
        if (!flag) {
          this.visibleOptions = this.options.filter((d) =>
            this.filterByInput(d.name, this.searchQuery)
          );

          // Search the address too
          this.searchAddress(this.searchQuery);
        }

        // Set focus state to first item in list
        this.setFocusToFirstMenuitem();
      }, time);
    },

    /**
     * Return whether queryText is contained within itemText
     * in a case-insensitive manner
     */
    filterByInput(itemText, queryText) {
      const textOne = itemText.toLowerCase();
      const searchText = queryText.toLowerCase().trim();
      return textOne.indexOf(searchText) > -1;
    },

    /*
      How to style the dropdown list items
    */
    getListItemStyle(index) {
      let out;

      // Selected option
      if (index == this.selectedMenuitem) {
        out = `tw-cursor-pointer  tw-text-white`;
        if (index == this.focusedMenuitem)
          out += ` ${this.focusedSelectedOptionClasses}`;
        else out += ` ${this.selectedOptionClasses}`;

        // Not selected
      } else {
        out = "tw-cursor-pointer";
        if (index == this.focusedMenuitem)
          out += ` ${this.focusedOptionClasses}`;
      }
      return out;
    },

    /**
     * Return menu item string
     */
    getMenuItemId(index) {
      return `menuitem-${index}`;
    },

    /**
     * Set the focused menu item
     */
    setFocusToMenuitem(newMenuitem) {
      this.focusedMenuitem = newMenuitem;
    },

    /**
     * Focus the first element
     */
    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    },

    /**
     * Move the focus up by one, unless we are at the top
     */
    setFocusToPreviousMenuitem() {
      if (this.focusedMenuitem === this.firstMenuitem) {
        return;
      } else {
        this.setFocusToMenuitem(this.focusedMenuitem - 1);
      }
    },

    /**
     * Focus the next element, unless we're at the end
     */
    setFocusToNextMenuitem() {
      if (this.focusedMenuitem === this.lastMenuitem) {
        return;
      } else {
        this.setFocusToMenuitem(this.focusedMenuitem + 1);
      }
    },

    /**
     * Open the popup
     */
    openPopup() {
      // Clear the search text
      this.searchQuery = "";
      this.visibleOptions = this.options;

      // Open the dropdown
      this.isOpen = true;
      this.$refs.buttonNode.setAttribute("aria-expanded", "true");

      // Set focus state to first item in list
      this.setFocusToFirstMenuitem();

      // Focus the input
      this.focusInput();
    },

    /**
     * Focus the input element in the popup
     */
    focusInput() {
      let el = $(`#dd-${this.id}__menu input`)[0];
      el.focus();
    },

    /**
     * Close the popup
     */
    closePopup() {
      if (this.isOpen) {
        this.$refs.buttonNode.removeAttribute("aria-expanded");
        this.$refs.menuNode.setAttribute("aria-activedescendant", "");
        this.$refs.buttonNode.focus();
        this.isOpen = false;
        this.focusedMenuitem = null;
      }
    },

    /**
     * Close the popup when click is outside
     */
    onClickOutside(event) {
      if (!this.$refs.menuButtonActions.contains(event.target)) {
        if (this.isOpen) {
          this.closePopup();
        }
      }
    },

    /**
     * Perform the menu action
     */
    performMenuAction() {
      if (this.visibleOptions.length > 0) {
        // Set selection
        this.selectedMenuitem = this.focusedMenuitem;

        // Get the current selected option option
        let option = this.visibleOptions[this.focusedMenuitem];

        // Set the current label
        this.selectedOptionLabel = option.name;

        // Emit the current selected geography
        this.$emit("input", {
          name: option.name,
          type: option.type,
        });
      }
    },
  },
};
</script>
