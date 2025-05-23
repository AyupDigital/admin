<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="`${appName} - Add Service Location for: ${service.name}`"
      />

      <gov-back-link
        :to="{
          name: 'services-show-locations',
          params: { service: service.id }
        }"
        >Back to service</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">Service locations</gov-heading>
            <gov-heading size="m">Add service location</gov-heading>

            <service-location-form
              :errors="form.$errors"
              :location-errors="locationForm.$errors"
              :location_type.sync="location_type"
              :location_id.sync="form.location_id"
              :name.sync="form.name"
              :address_line_1.sync="locationForm.address_line_1"
              :address_line_2.sync="locationForm.address_line_2"
              :address_line_3.sync="locationForm.address_line_3"
              :city.sync="locationForm.city"
              :county.sync="locationForm.county"
              :postcode.sync="locationForm.postcode"
              :country.sync="locationForm.country"
              :has_induction_loop.sync="locationForm.has_induction_loop"
              :has_wheelchair_access.sync="locationForm.has_wheelchair_access"
              :has_accessible_toilet.sync="locationForm.has_accessible_toilet"
              :regular_opening_hours.sync="form.regular_opening_hours"
              :holiday_opening_hours.sync="form.holiday_opening_hours"
              @update:image_file_id="form.image_file_id = $event"
              @clear="form.$errors.clear($event)"
              @clear-location="locationForm.$errors.clear($event)"
              @alt-text-changed="altTextChanged = true"
              @image-changed="imageChanged = true"
            />

            <gov-section-break size="l" />

            <gov-button v-if="submitting" disabled type="submit"
              >Creating...</gov-button
            >
            <gov-button v-else @click="onSubmit" type="submit"
              >Create</gov-button
            >
            <ck-submit-error
              v-if="form.$errors.any() || locationForm.$errors.any()"
            />
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import Form from "@/classes/Form";
import ServiceLocationForm from "@/views/service-locations/forms/ServiceLocationForm";
import http from "@/http";

export default {
  name: "CreateServiceLocation",
  components: { ServiceLocationForm },
  data() {
    return {
      location_type: null,
      form: new Form({
        service_id: null,
        location_id: null,
        name: "",
        regular_opening_hours: [],
        holiday_opening_hours: [],
        image_file_id: null
      }),
      locationForm: new Form({
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
        has_accessible_toilet: false
      }),
      service: null,
      loading: false,
      submitting: false,
      altTextChanged: false,
      imageChanged: false
    };
  },
  methods: {
    async fetchService() {
      this.loading = true;
      const response = await http.get(
        `/services/${this.$route.params.service}`
      );
      this.service = response.data.data;
      this.form.service_id = this.service.id;
      this.loading = false;
    },
    async onSubmit() {
      if (this.imageChanged && !this.altTextChanged) {
        this.form.$errors.record({"alt_text": ["Please enter alt text for the image."]});
      }
      if (this.imageChanged) {
        this.form.$errors.record({"file": ["Please click 'Upload file' to upload your image."]});
      }
      if (this.form.$errors.any()) {
        return;
      }
      try {
        this.submitting = true;

        // Post the location if new.
        if (this.location_type === "new") {
          const { data: location } = await this.locationForm.post("/locations");
          this.location_type = "existing";
          this.form.location_id = location.id;
        }

        // Post the service location.
        const { data: service } = await this.form.post("/service-locations");
        this.$router.push({
          name: "service-locations-show",
          params: { serviceLocation: service.id }
        });
      } catch (error) {
        this.submitting = false;
      }
    }
  },
  created() {
    this.fetchService();
  }
};
</script>
