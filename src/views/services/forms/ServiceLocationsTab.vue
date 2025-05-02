<template>
  <div>
    <gov-heading size="m">Service location</gov-heading>
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
        { value: true, label: `Yes - This ${type} operates at a physical location` },
        { value: false, label: `No - This ${type} does not operate at a physical location` }
      ]"
      :error="errors.get('has_location')"
    />
    <div
      v-if="hasLocation"
      v-for="(location, index) in serviceLocations"
      :key="index"
      class="mb-4"
    >
      <gov-section-break size="l" />
      <gov-heading size="s">Location {{ index + 1 }}</gov-heading>
      <service-location-form
        :errors="getLocationErrors(index)"
        :location-errors="locationErrors[index]"
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
        @clear-location="clearLocationErrors(index, $event)"
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
import Form from "@/classes/Form";
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
    serviceLocations: {
      required: true,
      type: Array
    },
    type: {
      required: true
    },
    hasLocation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locationErrors: [],
    };
  },
  methods: {
    getLocationErrors(index) {
      const locationErrors = new Errors();
      const allErrors = this.errors.all();
      Object.keys(allErrors).forEach(key => {
        if (key.startsWith(`service_locations.${index}.`)) {
          const newKey = key.replace(`service_locations.${index}.`, "");
          locationErrors.record({ [newKey]: allErrors[key] });
        }
      });
      return locationErrors;
    },
    addLocation() {
      const newLocation = new Form({
        location_type: null,
        location_id: null,
        name: "",
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        city: "",
        county: "",
        postcode: "",
        country: "United Kingdom",
        has_wheelchair_access: false,
        has_induction_loop: false,
        has_accessible_toilet: false,
        accessibility_info: "",
        regular_opening_hours: [],
        holiday_opening_hours: [],
        image_file_id: null,
        alt_text_changed: false,
        image_changed: false
      });
      this.serviceLocations.push(newLocation);
      this.locationErrors.push(new Errors());
    },
    removeLocation(index) {
      this.serviceLocations.splice(index, 1);
      this.locationErrors.splice(index, 1);
    },
    clearLocationErrors(index, field) {
      if (!this.locationErrors[index]) {
        this.$set(this.locationErrors, index, new Errors());
      }
      this.locationErrors[index].clear(field);
    },
    initializeLocationErrors() {
      this.serviceLocations.forEach((_, index) => {
        if (!this.locationErrors[index]) {
          this.$set(this.locationErrors, index, new Errors());
        }
      });
    },
    async onLocationSelected(location, index) {
      const serviceLocation = this.serviceLocations[index];
      serviceLocation.location_type = "existing";
      serviceLocation.location_id = location.value;
      serviceLocation.address_line_1 = location.address_line_1;
      serviceLocation.address_line_2 = location.address_line_2;
      serviceLocation.address_line_3 = location.address_line_3;
      serviceLocation.city = location.city;
      serviceLocation.county = location.county;
      serviceLocation.postcode = location.postcode;
      serviceLocation.country = location.country;
      serviceLocation.has_wheelchair_access = location.has_wheelchair_access;
      serviceLocation.has_induction_loop = location.has_induction_loop;
      serviceLocation.has_accessible_toilet = location.has_accessible_toilet;
      serviceLocation.accessibility_info = location.accessibility_info;

      this.$set(this.serviceLocations, index, { ...serviceLocation });
    },
    async fetchLocationDetails(locationId, index) {
      if (!locationId) return;

      try {
        const response = await http.get(`/locations/${locationId}`);
        if (response && response.data) {
          const location = response.data;

          const serviceLocation = this.serviceLocations[index];
          serviceLocation.address_line_1 = location.address_line_1;
          serviceLocation.address_line_2 = location.address_line_2;
          serviceLocation.address_line_3 = location.address_line_3;
          serviceLocation.city = location.city;
          serviceLocation.county = location.county;
          serviceLocation.postcode = location.postcode;
          serviceLocation.country = location.country;
          serviceLocation.has_wheelchair_access =
            location.has_wheelchair_access;
          serviceLocation.has_induction_loop = location.has_induction_loop;
          serviceLocation.has_accessible_toilet =
            location.has_accessible_toilet;
          serviceLocation.accessibility_info = location.accessibility_info;

          this.$set(this.serviceLocations, index, { ...serviceLocation });
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    }
  },
  created() {
    if (this.serviceLocations.length === 0) {
      this.addLocation();
    }
    this.initializeLocationErrors();

    this.serviceLocations.forEach((location, index) => {
      if (location.location_id && location.location_type === "existing") {
        this.fetchLocationDetails(location.location_id, index);
      }
    });
  },
  watch: {
    serviceLocations: {
      handler() {
        this.initializeLocationErrors();
      },
      deep: true
    }
  }
};
</script>
