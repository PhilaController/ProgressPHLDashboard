<template>
  <div class="tw-mt-8">
    <div
      class="tw-flex tw-flex-col tw-border-b-4 tw-border-stone-400/50 tw-pb-10 lg:tw-flex-row"
    >
      <!-- Left column -->
      <div class="tw-mr-2 tw-w-full tw-px-4 sm:tw-px-8 lg:tw-w-8/12">
        <div class="tw-text-3xl tw-font-bold">
          Welcome to the ProgressPHL Data Explorer!
        </div>

        <p class="tw-mt-10 tw-text-xl">
          Using data for the Philadelphia Social Progress Index (SPI), explore
          the city's social and environmental wellbeing and compare SPI data for
          small geographic areas known as neighborhood tracts.
        </p>

        <p class="tw-mt-6 tw-text-xl">
          Get started by selecting a neighborhood tract in the map, or by
          searching for a region, neighborhood, or address.
        </p>

        <geography-search-bar
          class="tw-mt-6 tw-text-xl"
          placeholder="Search for a Region, Neighborhood, or Address..."
          :tract-features="tractFeatures"
          :neighborhood-names="neighborhoodNames"
          :region-names="regionNames"
          :value="selectedGeographyName"
          @input="$emit('geography:select', $event)"
        />

        <div class="tw-mt-10 tw-text-base tw-italic">
          <p>
            Neighborhood tracts are small geographic areas defined by the U.S.
            Census Bureau. They range in population from about 1,000 people to a
            little less than 9,000 people, with an average of about 4,000
            people.
          </p>
          <p class="tw-mt-4 tw-text-base tw-italic">
            For more information about how the Philadelphia SPI is calculated,
            see the
            <router-link
              class="tw-font-semibold tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
              to="/about"
              >About page</router-link
            >.
          </p>
        </div>
      </div>

      <!-- Right column -->
      <div class="tw-mt-8 tw-w-full tw-px-2 sm:tw-px-4 lg:tw-mt-0 lg:tw-w-4/12">
        <div
          class="tw-flex tw-flex-col tw-gap-8 tw-text-base md:tw-flex-row lg:tw-flex-col"
        >
          <div>
            <div class="tw-text-2xl tw-font-bold">
              <i class="fas fa-search"></i> Explore
            </div>
            <div class="tw-mt-1">
              Explore the Philadelphia SPI across the city using the interactive
              map. Additional indicators complement SPI data by describing key
              demographic and socioeconomic characteristics.
            </div>
          </div>
          <div>
            <div class="tw-text-2xl tw-font-bold">
              <i class="fas fa-balance-scale-left"></i> Compare
            </div>
            <div class="tw-mt-1">
              Compare how scores for the SPI as well as its underlying
              dimensions and components vary across the 372 populated
              neighborhood tracts in the city.
            </div>
          </div>
          <div>
            <div class="tw-text-2xl tw-font-bold">
              <i class="fas fa-download"></i> Download
            </div>
            <div class="tw-mt-1">
              Each neighborhood tract's overall SPI score, as well as the data
              used to calculate it, are available for download for your use and
              analysis.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="tw-mt-8 tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-4 tw-text-lg sm:tw-px-8"
    >
      <div class="tw-text-center">
        Have questions about this app? Suggestions?
      </div>
      <div class="tw-mt-0.5 tw-leading-none">
        <a
          class="tw-font-semibold tw-text-[#0F7582]/80 visited:tw-text-[#0F7582]/80 hover:tw-cursor-pointer hover:tw-text-[#0F7582]"
          href="mailto:controller@phila.gov"
          ><i class="fas fa-envelope tw-mr-2"></i>Send us an email</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import GeographySearchBar from "../components/GeographySearchBar";

export default {
  name: "WelcomePage",
  props: {
    /**
     * Census tract features
     */
    tractFeatures: { type: Array, required: true },

    /**
     * Unique neighborhood names
     */
    neighborhoodNames: { type: Array, required: true },

    /**
     * Unique region names
     */
    regionNames: { type: Array, required: true },

    /**
     * The name of the selected geography
     */
    selectedGeographyName: { type: String },
  },
  components: { GeographySearchBar },
};
</script>
