<template>
  <gov-width-container>
    <vue-headful :title="`Add Event Collection - ${appName}`" />

    <gov-back-link :to="{ name: 'admin-index-collections-events' }"
      >Back to event collections</gov-back-link
    >
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="one-half">
          <gov-heading size="xl">
            <gov-caption size="xl">Collections</gov-caption>
            Events
          </gov-heading>
          <gov-heading tag="h2" size="m">Add event collection</gov-heading>
          <gov-body>
            From this page, you can add the event collections that appear on the
            homepage. You can specify which taxonomies they refer to, the icon
            used, and the information provided in the description and sidebox.
          </gov-body>

          <collection-form
            :errors="form.$errors"
            :name.sync="form.name"
            :slug.sync="form.slug"
            :intro.sync="form.intro"
            :order.sync="form.order"
            :enabled.sync="form.enabled"
            :sideboxes.sync="form.sideboxes"
            :category_taxonomies.sync="form.category_taxonomies"
            :image_file_id.sync="form.image_file_id"
            @clear="form.$errors.clear($event)"
            @image-changed="imageChanged = $event"
            @alt-text-changed="altTextChanged = true"
          />

          <gov-button v-if="form.$submitting" disabled type="submit"
            >Creating...</gov-button
          >
          <gov-button v-else @click="onSubmit" type="submit">
            Create
          </gov-button>
          <ck-submit-error v-if="form.$errors.any()" />
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import CollectionForm from "@/views/collections/events/forms/CollectionForm";
import Form from "@/classes/Form";

export default {
  name: "CreateCollectionEvent",
  components: { CollectionForm },
  data() {
    return {
      imageChanged: false,
      altTextChanged: false,
      form: new Form({
        name: "",
        intro: "",
        slug: null,
        image_file_id: null,
        order: 1,
        enabled: true,
        sideboxes: [],
        category_taxonomies: []
      })
    };
  },
  methods: {
    async onSubmit() {
      if (this.imageChanged && !this.altTextChanged) {
        this.form.$errors.record({
          alt_text: ["Please enter alt text for the image."]
        });
        return;
      }
      if (this.imageChanged) {
        this.form.$errors.record({
          file: ["Please click 'Upload file' to upload your image."]
        });
        return;
      }
      await this.form.post("/collections/organisation-events");
      this.$router.push({ name: "admin-index-collections-events" });
    }
  }
};
</script>
