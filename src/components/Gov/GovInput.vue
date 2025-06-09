<template>
  <input
    @keyup.enter="onEnter"
    :value="value"
    @input="$emit('input', $event.target.value)"
    class="govuk-input"
    :class="computedClass"
    :id="id"
    :name="name"
    :type="type"
    :max="max"
    :min="min"
    :aria-describedby="getAriaDescribedBy"
    :aria-invalid="error ? 'true' : 'false'"
    :autocomplete="autocomplete"
    :required="required ? true : null"
  />
</template>

<script>
export default {
  name: "GovInput",
  props: {
    value: {
      type: String,
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
    type: {
      type: String,
      required: false,
      default: "text"
    },
    width: {
      type: Number,
      required: false
    },
    min: {
      type: [String, Number]
    },
    max: {
      type: [String, Number]
    },
    hint: {
      type: String,
      required: false
    },
    error: {
      required: false,
      default: null
    },
    autocomplete: {
      type: String,
      required: false
    },
    describedBy: {
      type: String,
      required: false,
      default: null
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    computedClass() {
      return this.width ? `govuk-input--width-${this.width}` : null;
    },
    getAriaDescribedBy() {
      const ids = [];
      if (this.describedBy) ids.push(this.describedBy);
      if (this.hint) ids.push(`${this.name}-hint`);
      if (this.error) ids.push(`${this.name}-error`);
      return ids.length > 0 ? ids.join(' ') : null;
    }
  },
  methods: {
    onEnter() {
      this.$emit("enter");
    }
  }
};
</script>
