<template>
  <div></div>
</template>

<script>
import { sum, max } from "d3-array";
import { axisRight } from "d3-axis";
import { scaleLinear, scaleBand } from "d3-scale";
import ResponsiveChart from "@/components/ResponsiveChart";

const translation = function (x, y) {
  return `translate(${x},${y})`;
};

export default {
  name: "AgeSexChart",
  mixins: [ResponsiveChart],
  props: ["data", "height", "barLabel", "xmax", "maxWidth"],
  data() {
    return {
      chartClass: "age-chart",
      margin: {
        top: 40,
        right: 40,
        bottom: 10,
        left: 40,
        middle: 28,
      },
    };
  },

  watch: {
    data() {
      this.updateChart();
    },
  },
  computed: {
    numTicks() {
      return this.$mq === "mobile" ? 2 : 4;
    },
  },
  methods: {
    /**
     * Create the chart structure we will use
     */
    setupChart() {
      const g = this.svg.select(".padding-group");
      g.append("g").attr("class", "male");
      g.append("g").attr("class", "female");
      g.append("g").attr("class", "axis x-axis-left");
      g.append("g").attr("class", "axis x-axis-right");
      g.append("g").attr("class", "axis y-axis-left");
      g.append("text").attr("class", "label-male");
      g.append("text").attr("class", "label-female");
    },

    /**
     * Update the chart
     */
    updateChart() {
      // If width not defined, don't do anything
      if (!this.width) return;

      // Create the svg if we need to
      if (!this.svg) {
        // Make sure padded group is there
        this.createPaddedSVG();

        // Set up the chart structure
        this.setupChart();
      }

      // Get the svg and data
      const svg = this.svg;
      const data = this.data;

      // Total percent male and female
      const percentMale = sum(data, (d) => d.male);
      const percentFemale = 1.0 - percentMale;

      // Set up dimensions
      const margin = this.margin;
      const height = this.height - margin.top - margin.bottom;
      const width = this.width - margin.left - margin.right;

      // Calculate region widths
      const regionWidth = width / 2 - margin.middle;
      const pointA = regionWidth;
      const pointB = width - regionWidth;

      // Format middle y-axis labels
      const yTickFormat = (d) =>
        `${d
          .replace("_to_", "–")
          .replace("under_", "Under ")
          .replace("_and_over", " & over")}`;

      // Update the SVG dimension
      svg
        .attr("width", margin.left + width + margin.right)
        .attr("height", margin.top + height + margin.bottom);

      // Get max value for the data
      const maxMaleValue = max(data, (d) => d.male);
      const maxFemaleValue = max(data, (d) => d.female);
      const maxValue = Math.max(maxFemaleValue, maxMaleValue);

      // Set up the x-scale to scale from 0 to region width
      const xScale = scaleLinear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();

      // Scale from 0 to height
      const yScale = scaleBand()
        .domain(data.map((d) => d.group))
        .range([height, 0]);

      const yAxisLeft = axisRight()
        .scale(yScale)
        .tickSize(4, 0)
        .tickPadding(margin.middle - 4)
        .tickFormat(yTickFormat);

      // const xAxisRight = axisBottom()
      //   .scale(xScale)
      //   .ticks(this.numTicks)
      //   .tickFormat((d) => `${(100 * d).toFixed(0)}%`);

      // const xAxisLeft = axisBottom()
      //   .scale(xScale.copy().range([pointA, 0]))
      //   .ticks(this.numTicks)
      //   .tickFormat((d) => `${(100 * d).toFixed(0)}%`);

      const leftBarGroup = svg
        .select(".male")
        .attr("transform", `${translation(pointA, 0)}scale(-1,1)`);

      const rightBarGroup = svg
        .select(".female")
        .attr("transform", translation(pointB, 0));

      // Draw y-axis
      svg
        .select(".y-axis-left")
        .attr("transform", translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll("text")
        .style("text-anchor", "middle");

      //svg.select(".x-axis-left").attr("transform", translation(0, height));
      //.call(xAxisLeft);

      // svg
      //   .select(".x-axis-right")
      //   .attr("transform", translation(pointB, height));
      // .call(xAxisRight);

      // Update top labels positioning
      svg
        .select(".label-male")
        .text(`Male (${(percentMale * 100).toFixed(1)}%)`)
        .attr("text-anchor", "end")
        .attr("x", width / 2 - margin.middle)
        .attr("y", -8);
      svg
        .select(".label-female")
        .text(`Female (${(percentFemale * 100).toFixed(1)}%)`)
        .attr("text-anchor", "start")
        .attr("x", width / 2 + margin.middle)
        .attr("y", -8);

      // Update middle positioning
      svg.selectAll(".tick text").attr("dy", 0);

      // Left bars
      leftBarGroup
        .selectAll("rect.bar.left")
        .data(data, (d) => d.group)
        .join("rect")
        .attr("class", "bar left")
        .attr("x", 0)
        .attr("y", (d) => yScale(d.group))
        .attr("height", yScale.step() - 10)
        .attr("width", (d) => xScale(d.male))
        .attr("rx", 2)
        .attr("ry", 2);

      // Left rect labels
      leftBarGroup
        .selectAll("text.bar.left.label")
        .data(data, (d) => d.group)
        .join("text")
        .attr("class", "bar left label")
        .attr("transform", "scale(-1,1)")
        .attr("x", (d) => -xScale(d.male))
        .attr("y", (d) => yScale(d.group))
        .attr("dx", -2)
        .attr("dy", yScale.step() - 12)
        .style("font-size", "0.6em")
        .style("fill", "#525252")
        .style("text-anchor", "end")
        .text((d) => `${(d.male * 100).toFixed(1)}%`);

      // Right bars
      rightBarGroup
        .selectAll("rect.bar.right")
        .data(data, (d) => d.group)
        .join("rect")
        .attr("class", "bar right")
        .attr("x", 0)
        .attr("y", (d) => yScale(d.group))
        .attr("width", (d) => xScale(d.female))
        .attr("height", yScale.step() - 10)
        .attr("rx", 2)
        .attr("ry", 2);

      // Right rect labels
      rightBarGroup
        .selectAll("text.bar.right.label")
        .data(data, (d) => d.group)
        .join("text")
        .attr("class", "bar right label")
        .attr("x", (d) => xScale(d.female))
        .attr("y", (d) => yScale(d.group))
        .attr("dx", 2)
        .attr("dy", yScale.step() - 12)
        .style("font-size", "0.6em")
        .style("fill", "#525252")
        .text((d) => `${(d.female * 100).toFixed(1)}%`);
    },
  },
};
</script>

<style>
.age-chart {
  width: 100%;
}
.age-chart .axis line,
.age-chart .axis path {
  shape-rendering: crispEdges;
  fill: transparent;
  stroke: #555;
  stroke-width: 0;
}
.age-chart .axis text {
  font-size: 0.7rem;
}
.age-chart .bar.left,
.age-chart .bar.right {
  fill: #a8a8a8;
}

.age-chart .label-male {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.age-chart .label-female {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
