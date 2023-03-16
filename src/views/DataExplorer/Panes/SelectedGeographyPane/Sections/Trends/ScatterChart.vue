<template>
  <div></div>
</template>

<script>
import ResponsiveChart from "@/components/ResponsiveChart";

// d3
import { max } from "d3-array";
import { select } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { regressionLoess } from "d3-regression";
import { line } from "d3-shape";

export default {
  name: "ScatterChart",
  mixins: [ResponsiveChart],
  components: {},
  props: [
    "data",
    "height",
    "maxWidth",
    "focusedIds",
    "hiddenIds",
    "xlabel",
    "ylabel",
    "xTickFormat",
    "xLabelFormat",
  ],
  data() {
    return {
      useRadiusScale: false,
      chartClass: "trends-scatter-chart",
      regressionBandWidth: 0.5,
      margin: {
        top: 30,
        right: 30,
        bottom: 75,
        left: 75,
      },
      /**
       * Circle options
       */
      circleSize: 6,
      focusedOpacity: 0.7,
      selectedOpacity: 1.0,
      hoverOpacity: 1.0,
      defaultOpacity: 0.25,
      hiddenOpacity: 0.0,

      // Selected
      rightClickIds: [],
    };
  },

  watch: {
    /**
     * Update styles when focused ids change
     */
    hiddenIds() {
      this.styleCircles();
    },
    /**
     * If data changes, update chart
     */
    data() {
      // Remove if we need to
      if (this.svg) this.svg.select(".padding-group").selectAll("*").remove();

      // Update
      this.updateChart();
    },

    /**
     * Update styles when focused ids change
     */
    focusedIds() {
      this.styleCircles();
    },
  },
  computed: {
    /**
     * Scale for x-axis
     */
    xScale() {
      return scaleLinear()
        .domain([0, max(this.data, (d) => d.x)])
        .range([0, this.width - this.margin.left - this.margin.right])
        .nice();
    },

    /**
     * Scale for y-axis
     */
    yScale() {
      let limits;
      if (this.ylabel == "Social Progress Index") limits = [20, 80];
      else limits = [0, 100];
      return scaleLinear()
        .domain(limits)
        .range([this.height - this.margin.top - this.margin.bottom, 0]);
    },

    /**
     * Selected GEOID
     */
    selectedGeoid() {
      if (this.focusedIds.length === 1) return this.focusedIds[0];
    },
  },
  methods: {
    addRightClickSelection(geoid) {
      if (!this.rightClickIds.includes(geoid)) this.rightClickIds.push(geoid);
    },
    removeRightClickSelection(geoid) {
      this.rightClickIds = this.rightClickIds.filter((d) => d !== geoid);
    },

    resetRightClickSelection() {
      this.rightClickIds = [];
      this.styleCircles();
    },

    styleCircles() {
      // Save the vue instance
      let t = this;

      // Remove the old crosshair
      this.removeCrosshairs("select");

      // Get the circles and style them
      let svg = this.svg.select(".padding-group");
      let selectedCircle;
      svg.selectAll("circle").each(function (d, i) {
        // Get the circle selection
        let circle = select(this);

        // This value is hidden
        if (t.hiddenIds.includes(d.geoid)) {
          circle.call(t.setHiddenStyle);

          if (d.geoid === t.selectedGeoid) {
            t.removeCrosshairs("select");
          }
        } else {
          // Reset back to default
          if (t.focusedIds.includes(d.geoid)) {
            circle.call(t.setFocusedStyle);
          } else if (t.rightClickIds.includes(d.geoid)) {
            circle.call(t.setRightClickStyle);
          } else {
            circle.call(t.setDefaultStyle);
          }
          if (d.geoid === t.selectedGeoid) {
            t.addCrosshairs(d, "select");
            selectedCircle = circle;
          }
        }
      });

      // Raise the selected circle
      if (selectedCircle) selectedCircle.raise();
    },
    /**
     * Add crosshairs
     */
    addCrosshairs(d, tag) {
      // Get the svg
      let svg = this.svg.select(".padding-group");

      // Get width/height of chart area
      const height = this.height - this.margin.top - this.margin.bottom;
      const width = this.width - this.margin.left - this.margin.right;

      // x/y location of selected point
      const x = this.xScale(d.x);
      const y = this.yScale(d.y);

      // Value offsets
      const offsetY = -50;
      const offsetX = 35;

      // Get the class name prefix
      let classPrefix = `crosshair-${tag}`;

      // Add horizontal line
      svg
        .append("line")
        .attr("class", `${classPrefix}-line`)
        .attr("x1", offsetY)
        .attr("x2", x)
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "#a3a3a3")
        .attr("stroke-width", "1px")
        .raise();

      // Add vertical line
      svg
        .append("line")
        .attr("class", `${classPrefix}-line`)
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", height + offsetX)
        .attr("y2", y)
        .attr("stroke", "#a3a3a3")
        .attr("stroke-width", "1px")
        .raise();

      // Add text
      const textAnchor = x >= width * 0.5 ? "end" : "start";
      const dx = x >= width * 0.5 ? "-0.75rem" : "0.75rem";
      const text = svg
        .append("text")
        .attr("class", `${classPrefix}-label`)
        .attr("x", x)
        .attr("y", y)
        .attr("dx", dx)
        .attr("dy", "-0.5rem")
        .style("font-size", "0.9rem")
        .style("fill", "#1f2937")
        .style("font-weight", "500")
        .style("text-anchor", textAnchor)
        .text(d.name)
        .raise();

      const bbox = text.node().getBBox();

      // Add background
      svg
        .append("rect")
        .attr("class", `${classPrefix}-label`)
        .attr("x", bbox.x)
        .attr("y", bbox.y)
        .attr("width", bbox.width)
        .attr("height", bbox.height)
        .style("fill", "#f5f5f5")
        .style("fill-opacity", 0.9)
        .raise();
      text.raise(); // bring text to front

      // Value text on the y-axis
      svg
        .append("text")
        .attr("class", `${classPrefix}-label`)
        .attr("x", offsetY)
        .attr("y", y)
        .attr("dx", 0)
        .attr("dy", -5)
        .style("font-size", "0.9rem")
        .style("fill", "#a3a3a3")
        .style("font-weight", "500")
        .style("text-anchor", "middle")
        .text(d.y.toFixed(1));

      // Value text on the x-axis
      svg
        .append("text")
        .attr("class", `${classPrefix}-label`)
        .attr("x", x)
        .attr("y", height + offsetX)
        .attr("dx", 0)
        .attr("dy", "0.8rem")
        .style("font-size", "0.9rem")
        .style("fill", "#a3a3a3")
        .style("font-weight", "500")
        .style("text-anchor", "middle")
        .text(this.xLabelFormat(d.x));
    },

    /**
     * Remove crosshairs
     */
    removeCrosshairs(tag) {
      const classPrefix = `crosshair-${tag}`;
      this.svg.selectAll(`.${classPrefix}-line`).remove();
      this.svg.selectAll(`.${classPrefix}-label`).remove();
    },

    /**
     * Hide selected crosshairs
     */
    hideSelectedCrosshairs() {
      const classPrefix = `crosshair-select`;
      this.svg.selectAll(`.${classPrefix}-line`).style("visibility", "hidden");
      this.svg.selectAll(`.${classPrefix}-label`).style("visibility", "hidden");
    },

    /**
     * Show selected crosshairs
     */
    showSelectedCrosshairs() {
      const classPrefix = `crosshair-select`;
      this.svg.selectAll(`.${classPrefix}-line`).style("visibility", "visible");
      this.svg
        .selectAll(`.${classPrefix}-label`)
        .style("visibility", "visible");
    },

    /**
     * Set the default style for visible, non-focused circles
     */
    setDefaultStyle(circles) {
      return circles
        .style("fill", "#a3a3a3")
        .style("fill-opacity", this.defaultOpacity)

        .style("stroke-width", 0)
        .style("pointer-events", "auto");
    },

    /**
     * Set alt-click style
     */
    setRightClickStyle(circles) {
      return circles
        .style("stroke-width", 2.0)
        .style("stroke", "#262626")
        .style("stroke-opacity", 1.0);
    },

    /**
     * Set the style for when circles are hovered over
     */
    setHoverStyle(circles) {
      return circles
        .style("stroke-width", 2.0)
        .style("stroke", "#262626")
        .style("stroke-opacity", 1.0)
        .style("fill-opacity", (d) =>
          d.geoid === this.selectedGeoid
            ? this.selectedOpacity
            : this.hoverOpacity
        );
    },

    /**
     * Set the style for hidden circles
     */
    setHiddenStyle(circles) {
      return circles
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)
        .style("pointer-events", "none");
    },

    /**
     * Set the style for focused circles
     */
    setFocusedStyle(circles) {
      return circles
        .style("fill", "#ef4444")
        .style("fill-opacity", (d) =>
          d.geoid === this.selectedGeoid
            ? this.selectedOpacity
            : this.focusedOpacity
        )
        .style("stroke", "#262626")
        .style("stroke-opacity", 0.8)
        .style("stroke-width", 1.5)
        .style("pointer-events", "auto")
        .raise();
    },
    /**
     * Update the chart
     */
    updateChart() {
      const firstTime = !this.svg;
      if (!this.width) return;
      if (firstTime) this.createPaddedSVG();

      // Size the svg
      const margin = this.margin;
      const height = this.height - margin.top - margin.bottom;
      const width = this.width - margin.left - margin.right;

      // Set the size attributes
      const svg = this.svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select(".padding-group");

      // Set up axes
      let numTicks;
      if (this.$mq === "mobile") numTicks = 4;
      const xAxis = axisBottom(this.xScale)
        .tickFormat(this.xTickFormat)
        .ticks(numTicks);
      const yAxis = axisLeft(this.yScale);

      // Draw the axes
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
      svg.append("g").attr("class", "y-axis").call(yAxis);

      // Add axes labels
      svg
        .append("text")
        .attr("class", "axes-label")
        .attr("x", -40)
        .attr("y", -15)
        .attr("dx", 0)
        .attr("dy", 0)
        .style("font-size", "1rem")
        .style("fill", "#262626")
        .style("font-weight", "700")
        .style("text-anchor", "start")
        .text(this.ylabel);
      svg
        .append("text")
        .attr("class", "axes-label")
        .attr("x", width)
        .attr("y", height - 10)
        .attr("dx", 0)
        .attr("dy", 0)
        .style("font-size", "1rem")
        .style("fill", "#262626")
        .style("font-weight", "700")
        .style("text-anchor", "end")
        .text(this.xlabel);

      // Add the circles
      let circles = svg
        .selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr("cx", (d) => this.xScale(d.x))
        .attr("cy", (d) => this.yScale(d.y))
        .attr("r", this.circleSize)
        .call(this.setDefaultStyle);

      // Hidden circles
      circles
        .filter((d) => this.hiddenIds.includes(d.geoid))
        .call(this.setHiddenStyle);

      // Focus the rest
      circles
        .filter((d) => this.focusedIds.includes(d.geoid))
        .raise()
        .call(this.setFocusedStyle);

      // Add the regression
      const regression = regressionLoess()
        .x((d) => d.x)
        .y((d) => d.y)
        .bandwidth(this.regressionBandWidth);

      // Add the regression
      svg
        .append("path")
        .datum(regression(this.data))
        .style("fill", "none")
        .style("stroke", "#404040")
        .style("stroke-width", "2px")
        .style("pointer-events", "none")
        .attr(
          "d",
          line()
            .x((d) => this.xScale(d[0]))
            .y((d) => this.yScale(d[1]))
        );

      // Add crosshairs if this is first time
      //  Otherwise add in watcher for selectedGeoid
      if (this.selectedGeoid) {
        // Add the crosshair
        this.addCrosshairs(
          this.data.find((d) => d.geoid === this.selectedGeoid),
          "select"
        );

        // Raise the circle
        circles.filter((d) => d.geoid === this.selectedGeoid).raise();
      }

      // Add interactions
      const t = this;
      circles
        .on("click", function (event, d) {
          // Prevent default behavor
          event.preventDefault();
          event.stopPropagation();

          // Emit the clicked tract name
          let name = event.metaKey ? "right-click" : "click";
          t.$emit(name, { name: d.name, type: "tract" });

          // Style shift click
          if (name == "right-click") {
            // Track the geoid
            if (!t.rightClickIds.includes(d.geoid)) {
              if (t.rightClickIds.length < 2) t.addRightClickSelection(d.geoid);
            } else t.removeRightClickSelection(d.geoid);

            // Style
            select(this).raise().call(t.setRightClickStyle);
          }
        })
        .on("mouseover", function (event, d) {
          // Hide selected
          t.hideSelectedCrosshairs();

          // Add lines
          t.addCrosshairs(d, "hover");

          // Style
          select(this).raise().call(t.setHoverStyle);

          // Emit
          t.$emit("mouseover", { name: d.name, type: "tract" });
        })
        .on("mouseleave", function (event, d) {
          // Emit
          t.$emit("mouseleave");

          // Remove crosshairs
          t.removeCrosshairs("hover");

          // Showw selected
          t.showSelectedCrosshairs();

          // Style
          let circle = select(this);
          if (t.focusedIds.includes(d.geoid)) {
            circle.call(t.setFocusedStyle);
          } else if (t.rightClickIds.includes(d.geoid)) {
            circle.call(t.setRightClickStyle);
          } else circle.call(t.setDefaultStyle);
        });

      // Update tick label sizes
      svg.selectAll(".tick text").style("font-size", "0.85rem");
    },
  },
};
</script>

<style>
.race-ethnicity-chart .label {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
