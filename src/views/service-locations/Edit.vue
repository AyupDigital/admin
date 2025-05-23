<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="
          `${appName} - Edit Service Location: ${serviceLocation.name || '-'}`
        "
      />

      <gov-back-link
        :to="{
          name: 'service-locations-show',
          params: { serviceLocation: serviceLocation.id }
        }"
        >Back to service location</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">Service locations</gov-heading>
            <gov-heading size="m">Edit service location</gov-heading>

            <service-location-form
              :errors="form.$errors"
              :id="serviceLocation.id"
              :name.sync="form.name"
              :regular_opening_hours.sync="form.regular_opening_hours"
              :holiday_opening_hours.sync="form.holiday_opening_hours"
              @update:image_file_id="form.image_file_id = $event"
              @clear="form.$errors.clear($event)"
              @alt-text-changed="altTextChanged = true"
              @image-changed="imageChanged = true"
            />

            <gov-warning-text>
              Please be aware, by submitting these changes, any pending updates
              may be overwritten.
            </gov-warning-text>

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Requesting...</gov-button
            >
            <gov-button v-else @click="onSubmit" type="submit">{{
              updateButtonText
            }}</gov-button>
            <ck-submit-error v-if="form.$errors.any()" />
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
  name: "EditServiceLocation",
  components: { ServiceLocationForm },
  data() {
    return {
      form: null,
      serviceLocation: null,
      loading: false,
      altTextChanged: false,
      imageChanged: false
    };
  },
  computed: {
    updateButtonText() {
      return this.auth.isGlobalAdmin ? "Update" : "Request update";
    }
  },
  methods: {
    async fetchServiceLocation() {
      this.loading = true;
      const response = await http.get(
        `/service-locations/${this.$route.params.serviceLocation}`
      );
      this.serviceLocation = response.data.data;
      this.form = new Form({
        name: this.serviceLocation.name || "",
        regular_opening_hours: this.serviceLocation.regular_opening_hours,
        holiday_opening_hours: this.serviceLocation.holiday_opening_hours,
        image_file_id: this.serviceLocation.image
          ? this.serviceLocation.image.id
          : null
      });
      this.loading = false;
    },
    async onSubmit() {
      if (this.imageChanged && !this.altTextChanged && (!this.serviceLocation.image || !this.serviceLocation.image.alt_text)) {
        this.form.$errors.record({"alt_text": ["Please enter alt text for the image."]});
        return;
      }
      if (this.imageChanged) {
        this.form.$errors.record({"file": ["Please click 'Upload file' to upload your image."]});
        return;
      }
      const response = await this.form.put(
        `/service-locations/${this.serviceLocation.id}`,
        (config, data) => {
          // Remove any unchanged values.
          if (data.name === (this.serviceLocation.name || "")) {
            delete data.name;
          }
          if (
            JSON.stringify(data.regular_opening_hours) ===
            JSON.stringify(this.serviceLocation.regular_opening_hours)
          ) {
            delete data.regular_opening_hours;
          }
          if (
            JSON.stringify(data.holiday_opening_hours) ===
            JSON.stringify(this.serviceLocation.holiday_opening_hours)
          ) {
            delete data.holiday_opening_hours;
          }
          // Remove the logo from the request if null, or delete if false.
          if (this.serviceLocation.image && this.serviceLocation.image.id === data.image_file_id) {
            delete data.image_file_id;
          } else if (data.image_file_id === false || data.image_file_id === null) {
            data.image_file_id = null;
          }
        }
      );

      const updateRequestId = response.id;
      let next = {
        name: "service-locations-updated",
        params: { serviceLocation: this.serviceLocation.id }
      };

      if (this.auth.isGlobalAdmin) {
        try {
          const { data } = await http.get(
            `/update-requests/${updateRequestId}`
          );
          if (data.approved_at) {
            next.name = "service-locations-show";
            next.query = { updated: true };
          }
        } catch (err) {
          console.log(err);
        }
      }
      this.$router.push(next);
    }
  },
  created() {
    this.fetchServiceLocation();
  }
};
</script>
