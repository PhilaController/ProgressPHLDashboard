<template>
  <div
    class="btn-default-colors-bw tw-flex tw-w-fit tw-items-center tw-rounded tw-border tw-border-solid tw-px-3 tw-py-1.5 tw-text-center tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wider"
    :class="{
      'tw-text-stone-500 tw-opacity-25 hover:tw-cursor-not-allowed  hover:tw-bg-stone-100 focus:tw-bg-stone-100 focus:tw-outline-0':
        disabled,
    }"
    role="button"
    :tabindex="!disabled ? 0 : -1"
    :title="title"
    @click.prevent="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ["text", "title", "disabled"],
};
</script>
