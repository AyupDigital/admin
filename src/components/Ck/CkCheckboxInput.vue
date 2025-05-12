<template>
  <gov-form-group :invalid="error !== null">
    <gov-fieldset class="govuk-checkboxes">
      <gov-legend>
        <gov-label :for="id" class="govuk-!-font-weight-bold">
          <slot name="label">{{ label }}</slot>
        </gov-label>

        <slot name="hint">
          <gov-hint v-if="hint" :for="id" v-text="hint" />
        </slot>
      </gov-legend>
      <gov-checkbox
        v-for="(option, index) in options"
        :key="index"
        :bind-to="value"
        @input="onUpdate({ enabled: $event, value: option.value })"
        :id="`${id}_${index}`"
        :name="id"
        :label="option.label"
        :value="value.includes(option.value)"
        :disabled="disabled"
      />

      <slot name="after-input" />

      <gov-error-message v-if="error !== null" v-text="error" :for="id" />
    </gov-fieldset>
  </gov-form-group>
</template>

<script>
import GovFieldset from "../Gov/GovFieldset.vue";
import GovLegend from "../Gov/GovLegend.vue";

export default {
  name: "CkCheckboxInput",
  components: {
    GovFieldset,
    GovLegend
  },
  props: {
    value: {
      required: true
    },
    label: {
      required: false,
      type: String
    },
    hint: {
      required: false,
      type: String
    },
    error: {
      required: true
    },
    id: {
      required: true,
      type: String
    },
    options: {
      required: true,
      type: Array
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    onUpdate({ enabled, value }) {
      const newValue = [...this.value];
      if (enabled) {
        newValue.push(value);
      } else {
        const index = newValue.indexOf(value);
        if (index > -1) {
          newValue.splice(index, 1);
        }
      }
      this.$emit("input", newValue);
    }
  },

};
</script>
