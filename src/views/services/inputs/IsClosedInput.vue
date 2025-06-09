<template>
  <gov-form-group :invalid="error !== null">
    <gov-fieldset class="govuk-fieldset">
      <gov-legend>
        <gov-label :forId="id">
          Is this {{ type }} open or closed during these holiday hours?
        </gov-label>
      </gov-legend>

      <div class="govuk-radios">
        <gov-radio
          :bind-to="value"
          @input="$emit('input', $event)"
          :id="`${id}_open`"
          :name="id"
          label="Open"
          :value="false"
        />

        <gov-radio
          :bind-to="value"
          @input="$emit('input', $event)"
          :id="`${id}_closed`"
          :name="id"
          label="Closed"
          :value="true"
        />
      </div>
    </gov-fieldset>

    <gov-error-message v-if="error" v-text="error" :for="id" />
  </gov-form-group>
</template>

<script>
export default {
  name: "IsClosedInput",
  props: {
    value: {
      required: true
    },
    error: {
      required: true
    },
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>
