<template>
  <div 
    class="govuk-error-summary" 
    role="alert" 
    aria-labelledby="error-summary-title"
    aria-atomic="true"
  >
    <slot name="title">
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        {{ title }}
      </h2>
    </slot>
    <div class="govuk-error-summary__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "GovErrorSummary",
  props: {
    title: {
      required: false,
      type: String,
      default: ""
    }
  },
  mounted() {
    // Focus the error summary when it mounts
    this.$el.focus();
  }
};
</script>

<style lang="scss">
.govuk-error-summary:focus {
  outline: 3px solid #ffdd00;
}
</style>
