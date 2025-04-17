<template>
  <div>
    <div
      class="govuk-hint govuk-character-count__message"
      v-if="remainingCharacters === maxLength"
    >
      You can enter up to {{ remainingCharacters }} characters
    </div>
    <template v-else>
      <div
        class="govuk-hint govuk-character-count__message govuk-character-count__status"
        aria-hidden="true"
      >
        You have {{ remainingCharacters }} characters remaining
      </div>
    </template>
    <div
      class="govuk-character-count__sr-status govuk-visually-hidden"
      aria-live="polite"
    >
      You have {{ remainingCharacters }} characters remaining
    </div>
  </div>
</template>

<script>
export default {
  name: "CkCharacterCount",

  props: {
    count: {
      type: Number,
      required: true
    },

    maxLength: {
      type: Number,
      required: true
    }
  },
  computed: {
    remainingCharacters() {
      return this.maxLength - this.count;
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/app.scss";

.ck-character-count {
  @extend .govuk-body;

  position: absolute;
  bottom: -1.6rem;
  right: 0;
  color: $govuk-secondary-text-colour;
  margin: 0;
}
</style>
