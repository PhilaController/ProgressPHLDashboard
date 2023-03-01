<template>
  <div class="tw-mx-2 tw-mt-10 tw-h-fit">
    <!-- Dimensions label -->
    <div
      class="tw-mb-2 tw-text-sm tw-font-bold tw-uppercase tw-tracking-wider tw-text-neutral-500"
    >
      Dimensions
    </div>

    <!-- Three tabs -->
    <div class="tw-flex tw-w-full tw-flex-col sm:tw-flex-row">
      <div
        v-for="(name, i) in hierarchy['social_progress_index']"
        class="tw-flex tw-w-full tw-flex-col tw-justify-center tw-rounded-t-md tw-border-2 tw-p-2 tw-text-center tw-font-bold tw-uppercase tw-tracking-wider hover:tw-cursor-pointer sm:tw-w-1/3"
        tabindex="0"
        :class="getDimensionClasses(i, name)"
        @click.prevent="setDimension(name)"
        @keydown.enter="setDimension(name)"
        @keydown.space="setDimension(name)"
      >
        {{ aliases[name] }}
      </div>
    </div>

    <!-- Main body -->
    <div
      class="tw-relative tw-h-full tw-w-full tw-rounded-b-md tw-border tw-border-neutral-300"
    >
      <svg
        class="tw-pointer-events-none tw-absolute tw-top-0 tw-left-0 tw-z-[7]"
        height="100%"
        width="100%"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMinYMin meet"
      ></svg>

      <div
        class="tw-mx-2 tw-mt-8 tw-text-center tw-text-lg tw-font-semibold sm:tw-mx-4"
      >
        {{ dimensionMessage }}
      </div>

      <!-- Header row -->
      <div class="tw-mt-8 tw-flex tw-w-full tw-flex-col sm:tw-flex-row">
        <div
          v-for="(header, i) in headers"
          class="tw-w-full tw-px-2 sm:tw-w-1/3"
          :class="{ 'sm:tw-mr-10': i < 2 }"
        >
          <!-- Column header -->
          <div
            class="tw-mx-auto tw-mt-2 tw-mb-4 tw-w-fit tw-border-b-2 tw-border-b-neutral-500 tw-text-sm tw-font-bold tw-uppercase tw-tracking-wider tw-text-neutral-500 sm:tw-mt-0"
          >
            {{ header }}
          </div>

          <!-- Components -->
          <div v-if="header == 'components'" class="tw-mb-4">
            <div
              v-for="(name, j) in hierarchy[dimension]"
              :id="`component_${name}`"
              class="tw-rounded tw-border-2 tw-p-4 tw-text-base tw-drop-shadow-md hover:tw-cursor-pointer"
              :class="getComponentClasses(j, name)"
              tabindex="0"
              @click.prevent="setComponent(name)"
              @keydown.enter="setComponent(name)"
              @keydown.space="setComponent(name)"
            >
              {{ aliases[name] }}
            </div>
          </div>

          <!-- Indicators -->
          <div v-if="header == 'indicators' && component" class="tw-mb-4">
            <div
              v-for="(name, j) in hierarchy[component]"
              :id="`indicator_${name}`"
              class="indicator tw-rounded tw-border-2 tw-bg-neutral-100 tw-p-4 tw-text-base tw-drop-shadow-md hover:tw-cursor-pointer"
              :class="getIndicatorClasses(j, name)"
              tabindex="0"
              @click.prevent="setIndicator(name)"
              @keydown.enter="setIndicator(name)"
              @keydown.space="setIndicator(name)"
            >
              {{ aliases[name] }}
            </div>
          </div>
          <div
            v-if="header == 'indicators' && component == null"
            class="tw-mb-4 tw-rounded tw-border-2 tw-border-neutral-300 tw-bg-neutral-100 tw-p-4 tw-text-sm tw-italic tw-drop-shadow-md"
          >
            Select a component to see its constitutent indicators.
          </div>

          <!-- Definition -->
          <div
            v-if="header == 'definition' && indicator"
            class="tw-mb-4 tw-rounded tw-border-2 tw-p-4 tw-text-sm tw-drop-shadow-md"
            :class="getStyleClasses(dimension, true, false)"
            id="definition"
          >
            <div class="tw-mt-2 tw-font-bold">
              {{ aliases[indicator] }}
            </div>
            <div
              class="tw-mt-4"
              v-html="definitions[indicator].description"
            ></div>
            <div class="tw-mt-8">
              Source:
              <a
                class="tw-font-bold tw-text-zinc-800 visited:tw-text-zinc-800 hover:tw-text-zinc-800 hover:tw-underline"
                :href="definitions[indicator].source.url"
                >{{ definitions[indicator].source.text }}</a
              >
            </div>
          </div>
          <div
            v-if="header == 'definition' && indicator == null"
            class="tw-mb-4 tw-rounded tw-border-2 tw-border-neutral-300 tw-bg-neutral-100 tw-p-4 tw-text-sm tw-italic tw-drop-shadow-md"
          >
            Select an indicator to see the definition and show it on the map
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { linkHorizontal } from "d3-shape";
import { select } from "d3-selection";

/**
 * Return a promise that resolves when the element is visible
 */
function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * Get SVG point coordinates from an element
 */
function getSVGPoint(svg, elem, orientation, dx = 4) {
  let clientRect = elem.getBoundingClientRect();
  let clientX = clientRect.left;
  let clientY = clientRect.top;
  let height = elem.clientHeight;
  let width = elem.clientWidth;

  let anchor;
  if (orientation == "right") {
    anchor = { x: clientX + width + dx, y: clientY + 0.5 * height };
  } else anchor = { x: clientX - dx, y: clientY + 0.5 * height };

  const pt = svg.createSVGPoint();
  pt.x = anchor.x;
  pt.y = anchor.y;

  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export default {
  name: "DefinitionsTable",
  props: ["isLoading", "hierarchy", "definitions", "aliases", "dimensionNames"],
  data() {
    return {
      headers: ["components", "indicators", "definition"],
      dimension: null,
      component: null,
      indicator: null,
    };
  },
  created() {
    if (!this.isLoading) {
      this.initialize();
    }
  },
  watch: {
    isLoading() {
      this.initialize();
    },
    dimension(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit("dimension", newValue);

        // Do nothing on mobile
        if (this.$mq === "mobile") return;

        // Remove links
        let svg = select(this.$el).select("svg");
        svg.selectAll(".indicator-link").remove();
        svg.selectAll(".definition-link").remove();
      }
    },
    component(newValue, oldValue) {
      // Do nothing on mobile
      if (this.$mq === "mobile") return;

      if (newValue != oldValue && newValue != null) {
        // Add component --> indicator links
        select(this.$el).select("svg").selectAll(".indicator-link").remove();
        this.addIndicatorLinks(newValue);
      }
    },
    indicator(newValue, oldValue) {
      // Do nothing on mobile
      if (this.$mq === "mobile") return;

      if (newValue != oldValue) {
        //
        let svg = select(this.$el).select("svg");

        // Add component --> indicator links
        svg.selectAll(".indicator-link").remove();
        this.addIndicatorLinks(this.component);

        // Add indicator --> definition link
        svg.selectAll(".definition-link").remove();
        this.addDefinitionLink(this.indicator);
      }
    },
  },
  computed: {
    dimensionMessage() {
      if (this.dimension == "basic_human_needs")
        return "Are people's most essential needs being met?";
      else if (this.dimension == "foundations_of_wellbeing")
        return "Are the building blocks in place for individuals and communities to enhance and sustain wellbeing?";
      else
        return "Is there opportunity for all individuals to reach their full potential?";
    },
  },
  methods: {
    /**
     * Initialize selected parameters
     */
    initialize() {
      // Check "value" url parameter
      let valueType,
        value = this.$route.query.value;
      if (value) {
        valueType = this.getValueType(value);
      } else {
        this.setDimension("basic_human_needs");
        return;
      }

      // We have a dimension only
      if (valueType == "dimension") {
        this.component = this.indicator = null;
        this.dimension = value;
      }
      // We have a component
      else if (valueType == "component") {
        this.indicator = null;
        this.component = value;
        this.dimension = this.findValue(this.component);
      }
      // We have an indicator
      else {
        this.indicator = value;
        this.component = this.findValue(this.indicator);
        this.dimension = this.findValue(this.component);
      }
    },

    /**
     * Return 'dimension', 'compomnent', or 'indicator'
     */
    getValueType(value) {
      // Check dimensions first
      if (this.dimensionNames.includes(value)) return "dimension";
      else {
        // Check components
        for (let i = 0; i < this.dimensionNames.length; i++) {
          let dim = this.dimensionNames[i];
          for (let j = 0; j < this.hierarchy[dim].length; j++) {
            if (this.hierarchy[dim].includes(value)) return "component";
          }
        }
      }
      // Must be an indicator
      return "indicator";
    },

    /**
     * Set the dimension and update the path
     */
    setDimension(value) {
      if (this.$route.query.value === value) return;

      // Set
      this.dimension = value;
      this.component = this.indicator = null;

      // Update path
      this.$router.replace({ query: { value: this.dimension } });
    },

    /**
     * Set the component and update the path
     */
    setComponent(value) {
      if (this.$route.query.value === value) return;

      // Set selections
      this.indicator = null;
      this.component = value;
      this.dimension = this.findValue(this.component);

      // Update path
      this.$router.replace({ query: { value: this.component } });
    },

    /**
     * Set the indicator
     */
    setIndicator(value) {
      if (this.$route.query.value === value) return;

      // Set the selections
      this.indicator = value;
      this.component = this.findValue(this.indicator);
      this.dimension = this.findValue(this.component);

      // Update path
      this.$router.replace({ query: { value: this.indicator } });
    },

    /*
      Add links from component to indicator
    */
    addIndicatorLinks(component) {
      let id_selector = `#component_${component}`;
      waitForElm(id_selector).then((elem) => {
        // Get the svg
        let svg = this.$el.querySelector("svg");

        // Create the source point
        let pt = getSVGPoint(svg, elem, "right", 4);
        let source = {
          x: pt.x,
          y: pt.y,
        };

        // Initialize the link
        let link = linkHorizontal()
          .x(function (d) {
            return d.x;
          })
          .y(function (d) {
            return d.y;
          });

        // Get the indicators
        let indicators = document.getElementsByClassName("indicator");
        let indicatorNames = this.hierarchy[this.component];

        // Draw connect to each one
        for (let i = 0; i < indicators.length; i++) {
          // This indicator
          let indicator = indicators.item(i);
          let indicatorName = indicatorNames[i];

          // The target point
          let pt = getSVGPoint(svg, indicator, "left", 0);
          let target = {
            x: pt.x,
            y: pt.y,
          };

          let data = {
            source: source,
            target: target,
          };

          // Determine the color
          let color;
          if (indicatorName == this.indicator) {
            if (this.dimension == "basic_human_needs") color = "#38bdf8";
            else if (this.dimension == "foundations_of_wellbeing")
              color = "#fb923c";
            else color = "#4ade80";
          } else color = "#d4d4d4";

          select(this.$el)
            .select("svg")
            .append("path")
            .attr("d", link(data))
            .attr("class", "indicator-link")
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", "3px");
        }
      });
    },

    /*
      Add links from component to indicator
    */
    addDefinitionLink(indicator) {
      // Return if null
      if (indicator == null) return;

      let id_selector = `#indicator_${indicator}`;
      waitForElm(id_selector).then((elem) => {
        // Get the svg
        let svg = this.$el.querySelector("svg");

        // Create the source point
        let sourcePoint = getSVGPoint(svg, elem, "right", 4);
        let source = {
          x: sourcePoint.x,
          y: sourcePoint.y,
        };

        // Initialize the link
        let link = linkHorizontal()
          .x(function (d) {
            return d.x;
          })
          .y(function (d) {
            return d.y;
          });

        // Get the definition element
        let definition = document.getElementById("definition");

        // The target point
        let targetPoint = getSVGPoint(svg, definition, "left", 0);
        let target = {
          x: targetPoint.x,
          y: targetPoint.y,
        };

        let data = {
          source: source,
          target: target,
        };

        // Determine the color
        let color;
        if (this.dimension == "basic_human_needs") color = "#38bdf8";
        else if (this.dimension == "foundations_of_wellbeing")
          color = "#fb923c";
        else color = "#4ade80";

        select(this.$el)
          .select("svg")
          .append("path")
          .attr("d", link(data))
          .attr("class", "definition-link")
          .style("fill", "none")
          .style("stroke", color)
          .style("stroke-width", "3px");
      });
    },

    /*
      Set the dimension and propagate
    */
    findValue(name) {
      for (let key in this.hierarchy) {
        let values = this.hierarchy[key];
        if (values.includes(name)) return key;
      }
    },

    /*
      Get the style classes
    */
    getStyleClasses(dim, includeBorder = true, includeHover = true) {
      let c;

      // Basic Human Needs
      if (dim == "basic_human_needs") {
        c = "tw-bg-sky-200";
        if (includeHover) c += " hover:tw-bg-sky-300";
        if (includeBorder) c += " tw-border-sky-400";
      }
      // Foundations of Wellbeing
      else if (dim == "foundations_of_wellbeing") {
        c = "tw-bg-orange-200";
        if (includeHover) c += " hover:tw-bg-orange-300";
        if (includeBorder) c += " tw-border-orange-400";
      }
      // Opportunity
      else {
        c = "tw-bg-green-200";
        if (includeHover) c += " hover:tw-bg-green-300";
        if (includeBorder) c += " tw-border-green-400";
      }
      return c;
    },

    /*
      Set the dimension style classes
    */
    getDimensionClasses(i, dim) {
      let c;
      if (dim != this.dimension)
        c = "tw-border-neutral-300 tw-bg-neutral-100 hover:tw-bg-neutral-300";
      else c = this.getStyleClasses(dim, true);

      if (i < 2) c += " tw-mr-4";
      return c + " tw-border-b-0";
    },

    /*
      Set the component style classes
    */
    getComponentClasses(j, name) {
      let c;
      if (name == this.component) {
        c = this.getStyleClasses(this.dimension, true);
        c += " tw-font-bold";
      } else {
        c = "tw-border-neutral-300 tw-bg-neutral-100 hover:tw-bg-neutral-300";
        c += " tw-opacity-75";
      }

      if (j < this.hierarchy[this.dimension].length - 1) c += " tw-mb-4";

      return c;
    },

    /*
      Set the indicator style classes
    */
    getIndicatorClasses(j, name) {
      let c;
      if (name == this.indicator) {
        c = this.getStyleClasses(this.dimension, true);
        c += " tw-font-bold";
      } else {
        c = "tw-border-neutral-300 tw-bg-neutral-100 hover:tw-bg-neutral-300";
        c += "  tw-opacity-75";
      }
      if (j < this.hierarchy[this.component].length - 1) c += " tw-mb-4";
      return c;
    },
  },
};
</script>
