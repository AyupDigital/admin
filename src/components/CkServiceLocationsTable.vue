<template>
  <gov-table>
    <template slot="header">
      <gov-table-row>
        <gov-table-header scope="col">Location Name</gov-table-header>
        <gov-table-header scope="col">Address Line 1</gov-table-header>
        <gov-table-header scope="col">City</gov-table-header>
        <gov-table-header scope="col">Postcode</gov-table-header>
        <gov-table-header scope="col" right>Action</gov-table-header>
      </gov-table-row>
    </template>
    <template slot="body">
      <gov-table-row
        v-for="serviceLocation in serviceLocations"
        :key="serviceLocation.id"
      >
        <gov-table-cell>{{ serviceLocation.name || "-" }}</gov-table-cell>
        <gov-table-cell>{{
          serviceLocation.location.address_line_1
        }}</gov-table-cell>
        <gov-table-cell>{{ serviceLocation.location.city }}</gov-table-cell>
        <gov-table-cell>{{ serviceLocation.location.postcode }}</gov-table-cell>
        <gov-table-cell right>
          <gov-link
            @click="checkForUnsavedChanges(serviceLocation.id)"
            label="View location"
            >View</gov-link
          >
        </gov-table-cell>
      </gov-table-row>
      <gov-table-row v-if="serviceLocations.length === 0">
        <gov-table-cell center colspan="5"
          >No locations for this service</gov-table-cell
        >
      </gov-table-row>
    </template>
  </gov-table>
</template>

<script>
export default {
  name: "CkServiceLocationsTable",
  props: {
    serviceLocations: {
      type: Array,
      required: true
    },
    unsavedChanges: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    checkForUnsavedChanges(serviceLocationId) {
      if (this.unsavedChanges) {
        alert(
          "You have unsaved changes. Please save or discard them before proceeding."
        );
      } else {
        this.$router.push({
          name: "service-locations-show",
          params: { serviceLocation: serviceLocationId }
        });
      }
    }
  }
};
</script>
