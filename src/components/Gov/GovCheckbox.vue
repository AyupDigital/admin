<template>
  <div class="govuk-checkboxes__item">
    <input
      :checked="value"
      :value="true"
      @input="$emit('input', $event.target.checked)"
      class="govuk-checkboxes__input"
      :id="id"
      :name="name"
      type="checkbox"
      :aria-describedby="getAriaDescribedBy"
      :aria-invalid="error ? 'true' : 'false'"
      :disabled="disabled"
    />
    <gov-label class="govuk-checkboxes__label" :for="id">{{ label }}</gov-label>
    <slot />
  </div>
</template>

<script>
export default {
  name: "GovCheckboxInput",
  props: {
    value: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      required: false
    },
    error: {
      required: false,
      default: null
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    getAriaDescribedBy() {
      const ids = [];
      if (this.hint) ids.push(`${this.name}-hint`);
      if (this.error) ids.push(`${this.name}-error`);
      return ids.length > 0 ? ids.join(' ') : null;
    }
  }
};
</script>

<style lang="scss">
.govuk-checkboxes__item--nested {
  margin-top: 10px;
}
</style>
