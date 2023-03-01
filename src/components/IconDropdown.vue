<template>
  <!-- Wrapper -->
  <div class="tw-relative">
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
        class="tw-flex tw-w-full tw-items-end tw-justify-between tw-border-0 tw-bg-transparent tw-px-0.5 tw-text-left tw-transition tw-duration-100 tw-ease-in-out hover:tw-cursor-pointer hover:tw-bg-transparent hover:tw-text-[#0F7582] focus:tw-border-0 focus:tw-bg-transparent focus:tw-text-[#0F7582] focus:tw-outline-0 focus:tw-outline-offset-4 focus:tw-outline-neutral-800 disabled:tw-cursor-not-allowed disabled:tw-opacity-40 disabled:focus:tw-outline-none"
        aria-haspopup="true"
        :aria-controls="`dd-${id}__menu`"
        :value="selectedOptionLabel"
        @click="onButtonClick"
        @keydown="onButtonKeydown"
      >
        <slot>
          <i class="fas fa-bars tw-ml-2 tw-text-xl"></i>
        </slot>
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
        class="tw-absolute tw-right-0 tw-z-[11] tw-mt-1 tw-hidden tw-max-h-[300px] tw-overflow-scroll tw-rounded-b tw-border tw-border-gray-300 tw-bg-white tw-text-sm tw-shadow-sm focus:tw-text-black"
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
            <span class="tw-block tw-truncate">
              {{ optionValue(option, "label") }}
              <i class="fas fa-chevron-right tw-ml-1"></i>
            </span>
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
    optionCallbacks: {
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
     * Additional style classes
     */

    selectButtonLabelClasses: {
      type: String,
      default: "tw-text-neutral-500",
    },
    focusedOptionClasses: {
      type: String,
      default: "tw-bg-neutral-100",
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
      let callback = this.optionCallbacks[this.focusedMenuitem];
      callback();
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
