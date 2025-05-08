<template>
  <div>
    <gov-heading size="l">Service location</gov-heading>
    <gov-body>
      Add locations where your service operates. You can add your first location
      here, and any more locations can be added afterwards.
    </gov-body>
    <ck-radio-input
      :value="hasLocation"
      @input="
        $emit('update:hasLocation', $event);
        $emit('clear', 'hasLocation');
      "
      id="has_location"
      :label="`Does your ${type} operate at a physical location?`"
      :options="[
        {
          value: true,
          label: `Yes - This ${type} operates at a physical location`
        },
        {
          value: false,
          label: `No - This ${type} does not operate at a physical location`
        }
      ]"
      :error="errors.get('has_location')"
    />
    <div v-if="hasLocation" class="mb-4">
      <gov-section-break size="l" />
      <gov-heading size="s">Location</gov-heading>
      <service-location-form
        :errors="errors.getNestedAsErrors('service_locations_0_')"
        :location-errors="locationErrors"
        :location_type.sync="location.location_type"
        :location_id.sync="location.location_id"
        :name.sync="location.name"
        :address_line_1.sync="location.address_line_1"
        :address_line_2.sync="location.address_line_2"
        :address_line_3.sync="location.address_line_3"
        :city.sync="location.city"
        :county.sync="location.county"
        :postcode.sync="location.postcode"
        :country.sync="location.country"
        :has_induction_loop.sync="location.has_induction_loop"
        :has_wheelchair_access.sync="location.has_wheelchair_access"
        :has_accessible_toilet.sync="location.has_accessible_toilet"
        :accessibility_info.sync="location.accessibility_info"
        :regular_opening_hours.sync="location.regular_opening_hours"
        :holiday_opening_hours.sync="location.holiday_opening_hours"
        @update:image_file_id="location.image_file_id = $event"
        @clear="$emit('clear', $event)"
        @clear-location="$emit('clear-location', $event)"
        @alt-text-changed="location.alt_text_changed = true"
        @image-changed="location.image_changed = true"
        @location-selected="onLocationSelected($event, index)"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import ServiceLocationForm from "@/views/service-locations/forms/ServiceLocationForm";
import Errors from "@/classes/Errors";
import http from "@/http";

export default {
  name: "ServiceLocationsTab",
  components: { ServiceLocationForm },
  props: {
    errors: {
      required: true,
      type: Object,
      validator: function(value) {
        return value instanceof Errors;
      }
    },
    locationErrors: {
      required: true,
      type: Object,
      validator: function(value) {
        return value instanceof Errors;
      }
    },
    location: {
      required: true,
      type: Object
    },
    type: {
      required: true
    },
    hasLocation: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async onLocationSelected(location) {
      this.location.location_type = "existing";
      this.location.location_id = location.value;
      this.location.address_line_1 = location.address_line_1;
      this.location.address_line_2 = location.address_line_2;
      this.location.address_line_3 = location.address_line_3;
      this.location.city = location.city;
      this.location.county = location.county;
      this.location.postcode = location.postcode;
      this.location.country = location.country;
      this.location.has_wheelchair_access = location.has_wheelchair_access;
      this.location.has_induction_loop = location.has_induction_loop;
      this.location.has_accessible_toilet = location.has_accessible_toilet;
      this.location.accessibility_info = location.accessibility_info;
    },
    async fetchLocationDetails(locationId) {
      if (!locationId) return;

      try {
        const response = await http.get(`/locations/${locationId}`);
        if (response && response.data) {
          const location = response.data;

          this.location.address_line_1 = location.address_line_1;
          this.location.address_line_2 = location.address_line_2;
          this.location.address_line_3 = location.address_line_3;
          this.location.city = location.city;
          this.location.county = location.county;
          this.location.postcode = location.postcode;
          this.location.country = location.country;
          this.location.has_wheelchair_access = location.has_wheelchair_access;
          this.location.has_induction_loop = location.has_induction_loop;
          this.location.has_accessible_toilet = location.has_accessible_toilet;
          this.location.accessibility_info = location.accessibility_info;
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    }
  },
  created() {
    if (
      this.location.location_id &&
      this.location.location_type === "existing"
    ) {
      this.fetchLocationDetails(this.location.location_id);
    }
  }
};
</script>
