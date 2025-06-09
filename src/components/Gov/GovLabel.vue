<template>
  <label class="govuk-label" :for="forId" :id="id">
    <slot />
  </label>
</template>

<script>
export default {
  name: "GovLabel",
  props: {
    forId: {
      type: String,
      required: false,
      default: null
    },
    id: {
      required: false,
      default: null
    }
  }
};
</script>
