<template>
  <div>
    <gov-grid-row>
      <gov-grid-column width="two-thirds">
        <gov-heading size="l"
          >{{ service.type | ucfirst }} locations</gov-heading
        >
      </gov-grid-column>
      <gov-grid-column
        v-if="auth.isServiceAdmin(service.id)"
        width="one-third text-right"
      >
        <gov-button @click="checkForUnsavedChanges" success expand>
          Add location
        </gov-button>
      </gov-grid-column>
    </gov-grid-row>

    <ck-service-locations-table
      :service-locations="service.service_locations"
    />
    <slot />
  </div>
</template>

<script>
import Form from "@/classes/Form";

export default {
  name: "LocationsTab",
  props: {
    service: {
      type: Object,
      required: true
    },
    form: {
      type: Form,
      required: true
    }
  },
  methods: {
    checkForUnsavedChanges() {
      console.log(this.form.hasChanged());
      if (this.form.hasChanged()) {
        alert(
          "You have unsaved changes. Please save or discard them before adding a new location."
        );
      } else {
        window.location.href = `/services/${this.service.id}/service-locations/create`;
      }
    }
  }
};
</script>
