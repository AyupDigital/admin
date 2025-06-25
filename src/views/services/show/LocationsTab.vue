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
        <gov-button
          @click="
            checkForUnsavedChanges(
              `/services/${service.id}/service-locations/create`
            )
          "
          success
          expand
        >
          Add location
        </gov-button>
      </gov-grid-column>
    </gov-grid-row>

    <ck-service-locations-table
      :service-locations="service.service_locations"
      :unsaved-changes="unsavedChanges"
    />
    <slot />
  </div>
</template>

<script>
export default {
  name: "LocationsTab",
  props: {
    service: {
      type: Object,
      required: true
    },
    unsavedChanges: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checkForUnsavedChanges(redirect) {
      if (this.unsavedChanges) {
        alert(
          "You have unsaved changes. Please save or discard them before adding a new location."
        );
      } else {
        window.location.href = redirect;
      }
    }
  }
};
</script>
