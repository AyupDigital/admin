<template>
  <select
    :value="value"
    @change="$emit('input', $event.target.value)"
    :id="id"
    class="govuk-select"
    :class="computedClasses"
    :name="name"
    :aria-describedby="getAriaDescribedBy"
    :aria-invalid="error ? 'true' : 'false'"
  >
    <slot />
    <template v-if="options">
      <option
        v-for="(option, key) in options"
        :key="key"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.text }}
      </option>
    </template>
  </select>
</template>

<script>
export default {
  name: "GovSelect",
  props: {
    value: {
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
    options: {
      type: Array,
      required: false
    },
    width: {
      type: Number,
      required: false
    },
    hint: {
      type: String,
      required: false
    },
    error: {
      required: false,
      default: null
    }
  },
  computed: {
    getAriaDescribedBy() {
      const ids = [];
      if (this.hint) ids.push(`${this.name}-hint`);
      if (this.error) ids.push(`${this.name}-error`);
      return ids.length > 0 ? ids.join(' ') : null;
    },
    computedClasses() {
      return this.width ? `govuk-input--width-${this.width}` : null;
    }
  }
};
</script>
