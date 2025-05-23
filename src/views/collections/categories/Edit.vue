<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful
        :title="`${appName} - Edit Collection Category: ${collection.name}`"
      />

      <gov-back-link :to="{ name: 'admin-index-collections' }"
        >Back to collection categories</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="one-half">
            <gov-heading size="xl">
              <gov-caption size="xl">Collections</gov-caption>
              Categories
            </gov-heading>
            <gov-heading size="m">Edit category</gov-heading>
            <gov-body>
              From this page, you can edit the categories that appear on the
              homepage. You can change which taxonomies they refer to, the icon
              used, and the information provided in the description and sidebox.
            </gov-body>

            <collection-form
              :errors="form.$errors"
              :id="collection.id"
              :show-edit-slug="true"
              :slug.sync="form.slug"
              :name.sync="form.name"
              :intro.sync="form.intro"
              :order.sync="form.order"
              :enabled.sync="form.enabled"
              :homepage.sync="form.homepage"
              :sideboxes.sync="form.sideboxes"
              :category_taxonomies.sync="form.category_taxonomies"
              :image_file_id.sync="form.image_file_id"
              :parent_uuid.sync="form.parent_uuid"
              @clear="form.$errors.clear($event)"
              @image-changed="imageChanged = $event"
              @alt-text-changed="altTextChanged = true"
            />

            <gov-button v-if="form.$submitting" disabled type="submit"
              >Updating...</gov-button
            >
            <gov-button
              v-else
              @click="onSubmit"
              type="submit"
              >Update</gov-button
            >
            <ck-submit-error v-if="form.$errors.any()" />

            <gov-section-break size="l" />

            <ck-delete-button
              resource="category"
              :endpoint="`/collections/categories/${this.collection.id}`"
              @deleted="onDelete"
            />
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import CollectionForm from "@/views/collections/categories/forms/CollectionForm";

export default {
  name: "EditCollectionCategory",
  components: { CollectionForm },
  data() {
    return {
      loading: false,
      collection: null,
      form: null,
      imageChanged: false,
      altTextChanged: false,
    };
  },
  methods: {
    async fetchCollection() {
      this.loading = true;

      const response = await http.get(
        `/collections/categories/${this.$route.params.collection}`
      );
      this.collection = response.data.data;
      this.form = new Form({
        name: this.collection.name,
        slug: this.collection.slug,
        intro: this.collection.intro,
        image_file_id: this.collection.image ? this.collection.image.id : null,
        order: this.collection.order,
        enabled: this.collection.enabled,
        homepage: this.collection.homepage,
        parent_uuid: this.collection.parent_uuid,
        sideboxes: this.collection.sideboxes,
        category_taxonomies: this.collection.category_taxonomies.map(
          taxonomy => taxonomy.id
        )
      });

      this.loading = false;
    },
    async onSubmit() {
      if (this.imageChanged && (!this.altTextChanged && (!this.collection.image || !this.collection.image.alt_text))) {
        this.form.$errors.record({"alt_text": ["Please enter alt text for the image."]});
        return;
      }
      if (this.imageChanged) {
        this.form.$errors.record({"file": ["Please click 'Upload file' to upload your image."]});
        return;
      }
      await this.form.put(`/collections/categories/${this.collection.id}`);
      this.$router.push({ name: "admin-index-collections" });
    },
    onDelete() {
      this.$router.push({ name: "admin-index-collections" });
    }
  },
  created() {
    this.fetchCollection();
  }
};
</script>
