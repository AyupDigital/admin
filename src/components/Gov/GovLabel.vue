<template>
  <label class="govuk-label" :id="id">
    <slot />
  </label>
</template>

<script>
export default {
  name: "GovLabel",
  props: {
    id: {
      required: false,
      default: null
    }
  }
};
</script>
