<template>
  <textarea
    @keyup.enter="onEnter"
    :value="value"
    @input="$emit('input', $event.target.value)"
    class="govuk-textarea"
    :id="id"
    :name="name"
    :rows="rows"
    :aria-describedby="getAriaDescribedBy"
    :aria-invalid="error ? 'true' : 'false'"
    :required="required ? true : false"
  ></textarea>
</template>

<script>
export default {
  name: "GovTextarea",
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
    rows: {
      type: Number,
      required: false,
      default: 5
    },
    error: {
      required: false,
      default: null
    },
    hint: {
      type: String,
      required: false
    },
    required: {
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
  },
  methods: {
    onEnter() {
      this.$emit("enter");
    }
  }
};
</script>

<style lang="scss">
.govuk-textarea {
  resize: vertical;
}
</style>
