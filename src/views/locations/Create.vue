<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - Add Location`" />

    <gov-back-link :to="{ name: 'locations-index' }"
      >Back to locations</gov-back-link
    >
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="one-half">
          <gov-heading size="xl">Locations</gov-heading>
          <gov-heading size="m">Add location</gov-heading>
          <gov-body
            >The locations will appear on the service pages which will inform
            people of where to find your service/organisation</gov-body
          >

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
            :image_file_id.sync="form.image_file_id"
            @clear="form.$errors.clear($event)"
            @image-changed="imageChanged = $event"
            @alt-text-changed="altTextChanged = true"
          />

          <gov-button v-if="form.$submitting" disabled type="submit"
            >Creating...</gov-button
          >
          <gov-button
            v-else
            @click="onSubmit"
            type="submit"
            >Create</gov-button
          >
          <ck-submit-error v-if="form.$errors.any()" />
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import Form from "@/classes/Form";
import LocationForm from "@/views/locations/forms/LocationForm";

export default {
  name: "CreateLocation",
  components: { LocationForm },
  data() {
    return {
      imageChanged: false,
      altTextChanged: false,
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
      })
    };
  },
  methods: {
    onSubmit() {
      if (this.imageChanged && !this.altTextChanged) {
        this.form.$errors.record({"alt_text": ["Please enter alt text for the image."]});
        return;
      }
      if (this.imageChanged) {
        this.form.$errors.record({"file": ["Please click 'Upload file' to upload your image."]});
        return;
      }
      this.form.post("/locations").then(({ data }) =>
        this.$router.push({
          name: "locations-show",
          params: { location: data.id }
        })
      );
    }
  }
};
</script>
