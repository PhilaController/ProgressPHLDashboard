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
      class="tw-flex tw-w-full tw-justify-between tw-border tw-border-gray-300 tw-bg-white tw-py-1 tw-px-2 tw-text-left hover:tw-border hover:tw-border-gray-300 hover:tw-bg-white focus:tw-border focus:tw-border-gray-300 focus:tw-bg-white focus:tw-outline-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-40 disabled:focus:tw-outline-none"
      :class="buttonClasses"
      aria-haspopup="true"
      :aria-controls="`dd-${id}__menu`"
      :value="selectedOptionLabel"
      @click="onButtonClick"
      @keydown="onButtonKeydown"
    >
      <div
        class="tw-flex tw-flex-col tw-justify-start tw-truncate tw-break-all"
      >
        <!-- Label -->
        <div v-if="label" class="tw-pt-1 tw-text-xs tw-italic tw-text-gray-700">
          {{ label }}
        </div>
        <!-- selectButtonLabel -->
        <div
          class="tw-block tw-truncate tw-break-all tw-pr-2 tw-text-[1em] tw-font-bold tw-text-gray-700"
          :class="selectButtonLabelClasses"
        >
          {{ selectedOptionLabel }}
        </div>
      </div>

      <!-- Expand/Collapse Icon -->
      <div
        class="tw-ml-4 tw-pb-1 tw-text-[1.5em] tw-text-[#0F7582] focus:tw-text-[#0F7582]"
      >
        <font-awesome-icon v-if="!isOpen" icon="fa-solid fa-caret-down" />
        <font-awesome-icon v-else icon="fa-solid fa-caret-up" />
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
      class="tw-absolute tw-z-[8] tw-hidden tw-max-h-[20rem] tw-w-full tw-overflow-scroll tw-border-b tw-border-l tw-border-r tw-border-gray-300 tw-bg-white tw-shadow-sm focus:tw-text-black"
      :class="{
        '-tw-translate-y-[23rem]': label && direction == 'up',
        '-tw-translate-y-[22.5rem]': !label && direction == 'up',
        'tw-rounded-t ': direction == 'up',
        'tw-rounded-b ': direction == 'down',
      }"
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
          class="tw-flex tw-items-center tw-justify-between tw-border-l-2 tw-px-3 tw-py-2"
          :class="getIndentedBorderColor(index)"
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
</template>

<script>
export default {
  props: {
    /**
     * Metadata hierarchy for SPI
     */
    hierarchy: { type: Object },

    /**
     * Metadata aliases for SPI
     */
    aliases: { type: Object },

    /**
     * Selected value
     */
    value: {
      type: [String, Number],
      default: "",
    },

    label: {
      type: String,
    },

    direction: { type: String, default: "up" },

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
    selectedOptionClasses: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selectedMenuitem: null, // which one is selected
      focusedMenuitem: null, // which one is focused
      selectedOptionLabel: null,
      firstMenuitem: 0,
      firstChars: [],
      isOpen: false,
    };
  },
  computed: {
    buttonClasses() {
      let out = [];
      if (this.direction === "up") {
        out.push("tw-rounded-b");
        if (!this.isOpen) out.push("tw-rounded-t");
      } else {
        out.push("tw-rounded-t");
        if (!this.isOpen) out.push("tw-rounded-b");
      }
      if (this.label) out.push("tw-h-12 tw-items-end");
      else out.push("tw-h-10 tw-items-center");

      return out.join(" ");
    },

    /**
     * Last item number
     */
    lastMenuitem() {
      return this.options.length - 1;
    },

    /**
     * SPI variable names
     */
    SPIVariables() {
      let out = ["social_progress_index"];
      const dimensions = this.hierarchy["social_progress_index"];

      // Loop over dimensions and components and indicators
      for (let i = 0; i < dimensions.length; i++) {
        const dim = dimensions[i];
        out.push(dim);
        const components = this.hierarchy[dim];
        for (let j = 0; j < components.length; j++) {
          const component = components[j];
          out.push(component);
        }
      }

      return out;
    },

    /**
     * Dropdown options with value/label
     */
    options() {
      return this.SPIVariables.map((d) => {
        return { label: this.aliases[d], value: d };
      });
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
    getBorderColorByDimension(index) {
      if (index == 0) return "tw-border-transparent";
      else if (index <= 5) return "tw-border-cyan-400/75";
      else if (index > 5 && index <= 10) return "tw-border-orange-400/75";
      else return "tw-border-green-400/75";
    },

    getIndentedBorderColor(index) {
      if (index == 0 || index == 1 || index == 6 || index == 11)
        return "tw-border-transparent";
      else return this.getBorderColorByDimension(index);
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

      return (
        out +
        " tw-ml-2 tw-border-l-2 tw-pl-2 " +
        this.getBorderColorByDimension(index)
      );
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
      this.isOpen = true;
      this.$refs.buttonNode.setAttribute("aria-expanded", "true");
      this.$refs.menuNode.focus();
      this.setFocusToMenuitem(this.selectedMenuitem); // set to current selection
    },

    closePopup() {
      if (this.isOpen) {
        this.$refs.buttonNode.removeAttribute("aria-expanded");
        this.$refs.menuNode.setAttribute("aria-activedescendant", "");
        this.$refs.buttonNode.focus();
        this.isOpen = false;
        this.focusedMenuitem = null;
      }
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
      if (this.isOpen) {
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
        if (this.isOpen) {
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
