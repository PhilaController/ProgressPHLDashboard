<template>
  <div></div>
</template>

<script>
import { select } from "d3-selection";
import { max } from "d3-array";
import { scaleLinear, scaleBand } from "d3-scale";
import ResponsiveChart from "@/components/ResponsiveChart";

const translation = function (x, y) {
  return `translate(${x},${y})`;
};

export default {
  name: "RaceEthnicityChart",
  mixins: [ResponsiveChart],
  props: ["data", "height", "xmax", "maxWidth"],
  data() {
    return {
      chartClass: "race-ethnicity-chart",
      margin: {
        top: 5,
        right: 5,
        bottom: 10,
        left: 5,
      },
    };
  },

  watch: {
    data() {
      this.updateChart();
    },
  },
  methods: {
    /**
     * Update the chart
     */
    updateChart() {
      if (!this.width) return;
      if (!this.svg) this.createPaddedSVG();

      // Size the svg
      const margin = this.margin;
      const height = this.height - margin.top - margin.bottom;
      const width = this.width - margin.left - margin.right;

      // Set the size attributes
      const svg = this.svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .select(".padding-group");

      // Set up the y-axis
      const y = scaleBand()
        .domain(this.data.map((d) => d.group))
        .range([0, height])
        .paddingOuter(0)
        .paddingInner(0.1);

      const x = scaleLinear()
        .domain([0, this.xmax ? this.xmax : max(this.data, (d) => d.value)])
        .range([0, width]);

      const groupLabels = svg
        .selectAll(".typelabel")
        .data(this.data, (d) => d.group);

      groupLabels
        .enter()
        .append("text")
        .attr("class", "label typelabel")
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "top")
        .attr("x", 0)
        .attr("y", (d) => y(d.group) + y.bandwidth() + -1)
        .text((d) => `${d.group}`);
      groupLabels.exit().remove();

      const bars = svg.selectAll(".chartbar").data(this.data, (d) => d.group);

      bars
        .enter()
        .append("rect")
        .attr("class", "chartbar")
        .attr("fill", (d) => {
          if (d.color) return d.color;
          return "#A8A8A8";
        })
        .attr("x", 0)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("height", y.bandwidth() - 20)
        .attr("y", (d) => y(d.group) + 5)
        .attr("width", (d) => x(d.value));

      bars.exit().remove();
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
