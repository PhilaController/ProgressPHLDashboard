<template>
  <div
    class="tw-relative tw-flex tw-flex-col tw-text-base"
    :style="getPaddingTop(controllerNavHeight)"
  >
    <!-- Navbar -->
    <navbar :height="navBarHeight" />

    <div :style="getPaddingTop(navBarHeight)">
      <!-- Intro message -->
      <div
        class="text-content tw-mt-8 tw-text-lg tw-italic sm:tw-text-xl md:tw-text-2xl"
      >
        <p>
          ProgressPHL is a joint effort by the Controller's Office and the
          nonprofit Social Progress Imperative to measure the things that matter
          most to Philadelphians.
        </p>
      </div>

      <!-- Summary -->
      <div class="text-content tw-mt-10 tw-py-2">
        <p>
          ProgressPHL relies on the Social Progress Index (SPI), a
          well-established framework used around the world, to measure how
          Philadelphians are doing. It tries to answer questions like: Are
          Philadelphians healthy and safe? Do they have clean water and a roof
          over their heads? Can they freely access information? Are their rights
          being protected?
        </p>

        <p class="tw-mt-6">
          To address these questions, the Philadelphia SPI tracks progress
          across three categories:
          <span class="tw-font-medium">Basic Human Needs</span>,
          <span class="tw-font-medium">Foundations of Wellbeing</span>, and
          <span class="tw-font-medium">Opportunity</span>.
        </p>

        <!-- Dimension Summary -->
        <dimension-summary
          :data="data"
          class="tw-mt-6 tw-border-y-0 tw-border-zinc-400 tw-py-2"
        />
      </div>

      <!-- Philadelphia SPI -->
      <div class="text-content tw-mt-16">
        <!-- Header -->
        <h2 class="tw-mx-auto tw-mb-0 tw-w-fit">The Philadelphia SPI</h2>

        <p class="tw-mt-8">
          The Philadelphia SPI measures resident wellbeing using a set of
          indicators that cover small geographic regions across the city. These
          indicators provide granular and detailed information about what is
          going on in each of Philadelphia's neighborhoods. The regions, which
          are smaller than the typical neighborhood, cover areas that have
          populations ranging from about 2,500 to 8,000 people, with an average
          population of about 4,000.
        </p>
        <p class="tw-mt-6">
          For each neighborhood across the city, the Philadelphia SPI is
          constructed from three primary dimensions and four components per
          dimension, for a total of 12 components. The overal SPI score for a
          region, as well as the scores for each dimension and component score,
          are scaled from 0 to 100, allowing easy and intuitive comparison of
          neighborhoods to gauge social progress performance.
        </p>
        <p class="tw-mt-6">
          Each of the 12 SPI components is defined by a conceptual question and
          a set of outcome indicators that addresses that question. In total,
          the Philadelphia SPI uses 47 outcome indicators to calculate its 12
          components. The conceptual questions for each SPI dimension are shown
          in the diagram below. For more information,
          <a
            class="tw-font-medium tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
            href="#"
            target="_blank"
            >check out the detailed methodology report</a
          >
          for the Philadelphia SPI or
          <router-link
            class="tw-font-medium tw-text-[#0F7582] visited:tw-text-[#0F7582] hover:tw-text-[#0F7582] hover:tw-underline"
            to="/definitions"
            >explore the definitions</router-link
          >
          for the underlying outcome indicators.
        </p>
      </div>

      <!-- Dimensions -->
      <social-progress-framework
        class="tw-mt-10 tw-mb-20 tw-px-1 md:tw-px-4 lg:tw-px-10"
        :data="data"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import SocialProgressFramework from "./SocialProgressFramework";
import DimensionSummary from "./DimensionSummary";

export default {
  name: "AboutPage",
  components: { Navbar, SocialProgressFramework, DimensionSummary },
  props: ["controllerNavHeight", "navBarHeight", "usePadding"],
  data() {
    return {
      data: [
        {
          title: "Nutrition & Basic Medical Care",
          question:
            "Do people have enough to eat and are they receiving basic medical care?",
          icon: "fa-plus-square",
          iconColor: "tw-text-red-600",
        },
        {
          title: "Access to Basic Knowledge",
          question: "Do people have access to an educational foundation?",
          icon: "fa-calculator",
          iconColor: "tw-text-yellow-900",
        },
        {
          title: "Personal Rights",
          question: "Are people's rights as individuals protected?",
          icon: "fa-balance-scale-left",
          iconColor: "tw-text-amber-500",
        },
        {
          title: "Water & Sanitation",
          question:
            "Can people drink water and keep themselves clean without getting sick?",
          icon: "fa-tint",
          iconColor: "tw-text-sky-600",
        },
        {
          title: "Access to Information & Communications",
          question:
            "Can people freely access ideas and information from anywhere in the world?",
          icon: "fa-wifi",
          iconColor: "tw-text-slate-600",
        },
        {
          title: "Personal Freedom & Choice",
          question: "Are people free to make their own life choices?",
          icon: "fa-hand-fist",
          iconColor: "tw-text-zinc-900",
        },
        {
          title: "Housing",
          question: "Do people have adequate housing with basic utilities?",
          icon: "fa-home",
          iconColor: "tw-text-yellow-900",
        },
        {
          title: "Health & Wellness",
          question: "Do people live long and healthy lives?",
          icon: "fa-heartbeat",
          iconColor: "tw-text-red-600",
        },
        {
          title: "Inclusiveness",
          question:
            "Is no one excluded from the opportunity to be a contributing member of society?",
          icon: "fa-project-diagram",
          iconColor: "tw-text-slate-600",
        },
        {
          title: "Personal Safety",
          question: "Do people feel safe?",
          icon: "fa-shield-alt",
          iconColor: "tw-text-slate-600",
        },
        {
          title: "Environmental Quality",
          question:
            "Is this society using its resources so they will be available for future generations?",
          icon: "fa-leaf",
          iconColor: "tw-text-green-700",
        },
        {
          title: "Access to Advanced Education",
          question:
            "Do people have access to the world's most advanced knowledge?",
          icon: "fa-graduation-cap",
          iconColor: "tw-text-sky-600",
        },
      ],
    };
  },
  methods: {
    getPaddingTop(padding) {
      if (this.usePadding) return `padding-top: ${padding}px`;
      else return "";
    },
  },
};
</script>
