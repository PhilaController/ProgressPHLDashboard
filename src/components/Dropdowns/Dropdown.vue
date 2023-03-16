<template>
  <!-- Wrapper -->
  <div id="wrapper" class="tw-relative">
    <!-- buttonWrapper -->
    <div
      ref="menuButtonActions"
      v-click-outside="onClickOutside"
      class="tw-relative tw-inline-block tw-w-full"
    >
      <!-- Menu button -->
      <button
        :id="`dd-${id}`"
        ref="buttonNode"
        class="tw-flex tw-w-full tw-items-center tw-justify-between tw-border-0 tw-border-b-2 tw-border-neutral-600 tw-bg-transparent tw-px-0.5 tw-text-left tw-text-black tw-transition tw-duration-100 tw-ease-in-out hover:tw-bg-transparent focus:tw-border-0 focus:tw-border-b-2 focus:tw-bg-transparent focus:tw-outline-2 focus:tw-outline-offset-4 focus:tw-outline-neutral-800 disabled:tw-cursor-not-allowed disabled:tw-opacity-40 disabled:focus:tw-outline-none"
        :class="selectButtonClasses"
        aria-haspopup="true"
        :aria-controls="`dd-${id}__menu`"
        :value="selectedOptionLabel"
        @click="onButtonClick"
        @keydown="onButtonKeydown"
        :disabled="disabled"
      >
        <!-- selectButtonLabel -->
        <div
          v-if="selectedOptionLabel"
          class="tw-flex tw-w-full tw-items-center tw-justify-between"
        >
          <span
            class="tw-block tw-truncate tw-break-all"
            :class="selectButtonLabelClasses"
            v-html="selectedOptionLabel"
          ></span>
          <!-- Clear button -->
          <div
            @click.prevent="handleClear"
            v-if="clearable"
            class="tw-ml-1 tw-text-base tw-text-neutral-800 hover:tw-text-neutral-500"
          >
            <i class="fas fa-times-circle"></i>
          </div>
        </div>
        <span
          v-else
          class="tw-block tw-truncate tw-break-all tw-pr-2"
          :class="placeholderClasses"
          >{{ placeholder }}</span
        >

        <!-- Expand/Collapse Icon -->
        <div
          class="tw-ml-4 tw-flex tw-flex-col tw-justify-center tw-pb-1 tw-text-xs tw-text-neutral-500 focus:tw-text-neutral-500"
        >
          <font-awesome-icon icon="fa-solid fa-angle-up" /><font-awesome-icon
            icon="fa-solid fa-angle-down"
          />
        </div>
      </button>

      <!-- Dropdown -->
      <ul
        :id="`dd-${id}__menu`"
        ref="menuNode"
        role="menu"
        tabindex="-1"
        :aria-labelledby="`dd-${id}`"
        :aria-activedescendant="
          getMenuItemId(
            focusedMenuitem === null ? selectedMenuitem : focusedMenuitem
          )
        "
        class="tw-absolute tw-z-[8] tw-mt-1 tw-hidden tw-max-h-[300px] tw-w-full tw-overflow-scroll tw-rounded-b tw-border-b tw-border-l tw-border-r tw-border-gray-300 tw-bg-white tw-shadow-sm focus:tw-text-black"
        @keydown="onMenuKeydown"
      >
        <!-- List item -->
        <li
          v-for="(option, index) in options"
          :id="getMenuItemId(index)"
          :key="getMenuItemId(index)"
          :class="getListItemStyle(index)"
          role="menuitem"
          tabindex="-1"
          :data-index="index"
          :data-value="optionValue(option, 'value')"
          @click="onMenuitemClick"
          @mouseover="onMenuitemMouseover"
        >
          <!-- Option content -->
          <div
            class="tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-2"
          >
            <!-- Option Label -->
            <span
              class="tw-block tw-truncate"
              v-html="optionValue(option, 'label')"
            ></span>

            <!-- Check mark if selected -->
            <svg
              v-if="optionValue(option, 'value') == value"
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Array of options
     */
    options: {
      type: Array,
      required: true,
    },
    /**
     * Selected value
     */
    value: {
      type: [String, Number],
      default: "",
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
     * Clearable?
     */
    clearable: { type: Boolean, default: false },
    /**
     * Additional style classes
     */
    selectButtonClasses: {
      type: String,
      default: "hover:tw-border-neutral-500 focus:tw-border-neutral-500",
    },
    selectButtonLabelClasses: {
      type: String,
      default: "tw-text-neutral-700",
    },
    focusedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-100",
    },
    focusedSelectedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-100",
    },
    placeholderClasses: {
      type: String,
      default: "tw-text-neutral-500/70 tw-italic",
    },
    selectedOptionClasses: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    selectedMenuitem: null, // which one is selected
    focusedMenuitem: null, // which one is focused
    selectedOptionLabel: null,
    firstMenuitem: 0,
    firstChars: [],
  }),
  computed: {
    lastMenuitem() {
      return this.options.length - 1;
    },
  },
  created() {
    // Get first characters
    for (let i = 0; i < this.options.length; i++) {
      let option = this.options[i];
      this.firstChars.push(
        this.optionValue(option, "label").trim()[0].toLowerCase()
      );
    }

    // Determine selected menu item
    let option;
    for (let i = 0; i < this.options.length; i++) {
      let o = this.options[i];
      if (this.optionValue(o, "value") === this.value) {
        option = o;
        this.selectedMenuitem = i;
        break;
      }
    }

    if (option !== undefined) {
      // Set the default
      this.selectedOptionLabel = this.optionValue(option, "label");
    }
  },
  watch: {
    value(newValue) {
      if (newValue !== null) {
        let option;
        for (let i = 0; i < this.options.length; i++) {
          let o = this.options[i];
          if (this.optionValue(o, "value") === newValue) {
            option = o;
            this.selectedMenuitem = i;
            this.selectedOptionLabel = this.optionValue(o, "label");
            break;
          }
        }
      } else {
        this.selectedMenuitem = null;
        this.selectedOptionLabel = null;
      }
    },
  },
  methods: {
    handleClear() {
      this.selectedMenuitem = null;
      this.selectedOptionLabel = null;
      this.$emit("input", null);
    },
    /*
      How to style the dropdown list items
    */
    getListItemStyle(index) {
      let out;

      // Selected option
      if (index == this.selectedMenuitem) {
        out = `tw-cursor-pointer`;
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

    /*
      Get the option value
    */
    optionValue(option, key) {
      if (typeof option === "string") {
        return option;
      }
      if (typeof option === "object") {
        return option[key];
      }
    },
    getMenuItemId(index) {
      return `menuitem-${index}`;
    },
    setFocusToMenuitem(newMenuitem) {
      // Set the focused menu item
      this.focusedMenuitem = newMenuitem;

      // Focus it
      if (newMenuitem !== null) {
        let el = $(`li[data-index=${newMenuitem}]`)[0];
        el.focus();
      }
    },

    setFocusToFirstMenuitem() {
      this.setFocusToMenuitem(this.firstMenuitem);
    },

    setFocusToLastMenuitem() {
      this.setFocusToMenuitem(this.lastMenuitem);
    },

    setFocusToPreviousMenuitem() {
      var newMenuitem;

      if (this.focusedMenuitem === this.firstMenuitem) {
        newMenuitem = this.lastMenuitem;
      } else {
        newMenuitem = this.focusedMenuitem - 1;
      }

      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    },

    setFocusToNextMenuitem() {
      var newMenuitem;

      if (this.focusedMenuitem === this.lastMenuitem) {
        newMenuitem = this.firstMenuitem;
      } else {
        newMenuitem = this.focusedMenuitem + 1;
      }
      this.setFocusToMenuitem(newMenuitem);

      return newMenuitem;
    },

    setFocusByFirstCharacter(char) {
      var start, index;

      if (char.length > 1) {
        return;
      }

      char = char.toLowerCase();

      // Get start index for search based on position of currentItem
      start = this.focusedMenuitem + 1;
      if (start >= this.options.length) {
        start = 0;
      }

      // Check remaining slots in the menu
      index = this.firstChars.indexOf(char, start);

      // If not found in remaining slots, check from beginning
      if (index === -1) {
        index = this.firstChars.indexOf(char, 0);
      }

      // If match was found...
      if (index > -1) {
        this.setFocusToMenuitem(index);
      }
    },

    // Utilities

    getIndexFirstChars(startIndex, char) {
      for (var i = startIndex; i < this.firstChars.length; i++) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    },

    // Popup menu methods

    openPopup() {
      this.$refs.buttonNode.setAttribute("aria-expanded", "true");
      this.$refs.menuNode.focus();
      this.setFocusToMenuitem(this.selectedMenuitem); // set to current selection
    },

    closePopup() {
      if (this.isOpen()) {
        this.$refs.buttonNode.removeAttribute("aria-expanded");
        this.$refs.menuNode.setAttribute("aria-activedescendant", "");
        this.$refs.buttonNode.focus();
        this.focusedMenuitem = null;
      }
    },

    isOpen() {
      return this.$refs.buttonNode.getAttribute("aria-expanded") === "true";
    },

    // Menu event handlers

    onButtonKeydown(event) {
      var key = event.key,
        flag = false;

      switch (key) {
        case " ":
        case "Enter":
        case "ArrowDown":
        case "Down":
          this.openPopup();
          this.setFocusToFirstMenuitem();
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
          this.setFocusToLastMenuitem();
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

    onButtonClick(event) {
      if (this.isOpen()) {
        this.closePopup();
      } else {
        this.openPopup();
      }
      event.preventDefault();
    },

    onMenuKeydown(event) {
      var key = event.key,
        flag = false;

      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.shiftKey) {
        if (isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(key);
          flag = true;
        }

        if (event.key === "Tab") {
          this.closePopup();
          flag = true;
        }
      } else {
        switch (key) {
          case " ":
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

          case "Home":
          case "PageUp":
            this.setFocusToFirstMenuitem();
            flag = true;
            break;

          case "End":
          case "PageDown":
            this.setFocusToLastMenuitem();
            flag = true;
            break;

          case "Tab":
            this.closePopup();
            break;

          default:
            if (isPrintableCharacter(key)) {
              this.setFocusByFirstCharacter(key);
              flag = true;
            }
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

    onClickOutside(event) {
      if (!this.$refs.menuButtonActions.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
        }
      }
    },

    performMenuAction() {
      // Set selection
      this.selectedMenuitem = this.focusedMenuitem;

      // Get the current selected option option
      let option = this.options[this.focusedMenuitem];

      // Set the current label
      this.selectedOptionLabel = this.optionValue(option, "label");

      // Emit the current value
      this.$emit("input", this.optionValue(option, "value"));
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0rem !important;
  font-size: 0.9rem;
}
.input-dropdown {
  z-index: 8;
}
.menu-button-actions {
  margin: 0;
  padding: 0;
}

.menu-button-actions [role="menu"] {
  display: none;
  position: absolute;
  margin: 0;
  padding: 7px 4px;
  border: 0.5px solid #222;
  border-radius: 5px;
  background-color: #fff;
}

.menu-button-actions [role="menuitem"] {
  margin: 0;
  padding: 6px;
  display: block;
  width: 4em;
  background-color: #fff;
  color: black;
  border-radius: 5px;
}

.menu-button-actions button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-button-actions button svg.down {
  padding-left: 0.125em;
  fill: currentcolor;
  stroke: currentcolor;
}

.menu-button-actions button[aria-expanded="true"] svg.down {
  transform: rotate(180deg);
}
</style>
