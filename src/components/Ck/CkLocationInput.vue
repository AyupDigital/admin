<template>
  <div>
    <ck-radio-input
      :value="locationType"
      @input="locationTypeUpdated($event)"
      id="location_type"
      label="Select location"
      hint="You can select an existing location or create a new one."
      :options="locationTypes"
      :error="null"
    />

    <!-- Existing location: select from list -->
    <template v-if="locationType === 'existing'">
      <ck-text-input
        id="location_search"
        :value="locationSearchTerm"
        label="Search for location"
        type="text"
        @input="locationSearchTerm = $event"
        :error="errors.get('location_search_term')"
      />
      <ck-radio-input
        v-if="locations.length > 0 && !loading"
        :value="location_id"
        @input="onInput({ field: 'location_id', value: $event })"
        id="location_id"
        label="Location"
        :options="selectLocations"
        :error="errors.get('location_id')"
      />
      <ck-radio-input
        v-if="locations.length === 0 && location"
        :value="location_id"
        id="location_id"
        label="Location"
        :options="[
          {
            label: `${location.address_line_1}, ${location.city}, ${location.postcode}`,
            value: location_id
          }
        ]"
        :error="errors.get('location_id')"
      />
      <ck-loader v-if="loading" />
    </template>
    <!-- /Existing location: select from list -->

    <!-- New location: enter details -->
    <template v-else-if="locationType === 'new'">
      <location-form
        :errors="form.$errors"
        :address_line_1.sync="form.address_line_1"
        :address_line_2.sync="form.address_line_2"
        :address_line_3.sync="form.address_line_3"
        :city.sync="form.city"
        :county.sync="form.county"
        :postcode.sync="form.postcode"
        :country.sync="form.country"
        :has_induction_loop.sync="form.has_induction_loop"
        :has_wheelchair_access.sync="form.has_wheelchair_access"
        :has_accessible_toilet.sync="form.has_accessible_toilet"
        @update:address_line_1="
            onLocationInput({ field: 'address_line_1', value: $event })
          "
        @update:address_line_2="
            onLocationInput({ field: 'address_line_2', value: $event })
          "
        @update:address_line_3="
            onLocationInput({ field: 'address_line_3', value: $event })
          "
        @update:city="onLocationInput({ field: 'city', value: $event })"
        @update:county="onLocationInput({ field: 'county', value: $event })"
        @update:postcode="
            onLocationInput({ field: 'postcode', value: $event })
          "
        @update:country="onLocationInput({ field: 'country', value: $event })"
        @update:has_induction_loop="
            onLocationInput({ field: 'has_induction_loop', value: $event })
          "
        @update:has_wheelchair_access="
            onLocationInput({ field: 'has_wheelchair_access', value: $event })
          "
        @update:has_accessible_toilet="
          onLocationInput({ field: 'has_accessible_toilet', value: $event })
        "
        @update:image_file_id="form.image_file_id = $event"
        @clear="form.$errors.clear($event)"
      />

      <gov-section-break size="m" visible />

      <gov-button v-if="form.$submitting" disabled type="submit"
        >Creating...</gov-button
      >
      <gov-button v-else @click="onSubmit" type="submit">Create</gov-button>
      <ck-submit-error v-if="form.$errors.any()" />
    </template>
    <!-- /New location: enter details -->
  </div>
</template>

<script>
import countries from "@/storage/countries";
import Form from "@/classes/Form";
import LocationForm from "@/views/locations/forms/LocationForm";
import http from "@/http";

export default {
  name: "CkLocationInput",

  components: {
    LocationForm
  },
  props: {
    errors: {
      required: true
    },
    location_id: {
      required: false
    },
    address_line_1: {
      required: false,
      type: String
    },
    address_line_2: {
      required: false,
      type: String
    },
    address_line_3: {
      required: false,
      type: String
    },
    city: {
      required: false,
      type: String
    },
    county: {
      required: false,
      type: String
    },
    postcode: {
      required: false,
      type: String
    },
    country: {
      required: false,
      type: String
    },
    has_induction_loop: {
      required: false,
      type: Boolean
    },
    has_wheelchair_access: {
      required: false,
      type: Boolean
    },
    has_accessible_toilet: {
      required: false,
      type: Boolean
    }
  },

  data() {
    return {
      loading: false,
      locations: [],
      location: null,
      locationSearchTerm: "",
      locationType: "existing",
      form: new Form({
        address_line_1: "",
        address_line_2: "",
        address_line_3: "",
        city: "",
        county: "",
        postcode: "",
        country: "United Kingdom",
        accessibility_info: "",
        has_wheelchair_access: false,
        has_induction_loop: false,
        has_accessible_toilet: false,
        image_file_id: null
      }),
      countries: [
        { text: "Please select", value: null, disabled: true },
        ...countries
      ],
      locationTypes: [
        { value: "existing", label: "Existing" },
        { value: "new", label: "New" }
      ]
    };
  },

  computed: {
    selectLocations() {
      const locations = this.locations.map(location => {
        return {
          label: `${location.address_line_1}, ${location.city}, ${location.postcode}`,
          value: location.id
        };
      });

      return locations;
    }
  },

  watch: {
    locationSearchTerm() {
      this.fetchLocations();
    }
  },

  methods: {
    onInput({ field, value }) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    onLocationInput({ field, value }) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear-location", field);
    },
    locationTypeUpdated(event) {
      this.$emit("update:location_type", event);
      this.locationType = event;
    },
    async fetchLocations() {
      if (this.locationSearchTerm === "") {
        this.locations = [];
        return;
      }
      this.loading = true;
      this.locations = await this.fetchAll(
        "/search/locations?query=" + this.locationSearchTerm,
        {},
        "POST"
      );

      this.loading = false;
    },
    async fetchLocation() {
      const { data } = await http.get("/locations/" + this.location_id);
      this.location = data.data;
    },
    onSubmit() {
      this.form.post("/locations").then(({ data }) => {
        this.$emit("update:location_id", data.id);
        this.locations.push(data);
        this.locationType = "existing";
      });
    }
  },

  created() {
    if (this.location_id) {
      this.fetchLocation();
    }
  }
};
</script>

<style lang="scss" scoped></style>
