<template>
  <gov-width-container>
    <vue-headful :title="`Add ${type} page - ${appName}`" />

    <gov-back-link :to="{ name: 'pages-index' }">Back to pages</gov-back-link>

    <gov-main-wrapper>
      <page-form
        :errors="form.$errors"
        :page_type.sync="form.page_type"
        :parent_id.sync="form.parent_id"
        @update:title="onUpdateTitle"
        :title="form.title"
        :slug.sync="form.slug"
        :excerpt.sync="form.excerpt"
        :content.sync="form.content"
        :image_file_id.sync="form.image_file_id"
        :collections.sync="form.collections"
        :enabled.sync="form.enabled"
        @clear="form.$errors.clear($event)"
        @image-changed="imageChanged = $event"
        @alt-text-changed="altTextChanged = true"
      />
    </gov-main-wrapper>

    <gov-section-break size="l" />

    <gov-button v-if="form.$submitting" disabled type="submit"
      >Creating...</gov-button
    >
    <gov-button v-else @click="onSubmit" type="submit">Create</gov-button>

    <ck-submit-error v-if="form.$errors.any()" />
  </gov-width-container>
</template>

<script>
import PageForm from "./forms/PageForm";
import Form from "@/classes/Form";

export default {
  name: "CreatePage",

  components: {
    PageForm
  },

  props: {
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      form: new Form({
        parent_id: null,
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        page_type: this.type,
        image_file_id: null,
        collections: [],
        enabled: false
      }),

      contentTypes: {
        topic: {
          info_pages: {
            order: 1,
            label: "Landing Pages",
            title: "",
            hint:
              "Title and subtext for the landing pages section of the topic.",
            required: true,
            content: [
              {
                type: "copy",
                value: "",
               
              }
            ]
          }
        },
        landing: {
          introduction: {
            order: 1,
            label: "Introduction",
            hint: "",
            required: true,
            content: [
              {
                type: "copy",
                value: ""
              }
            ]
          },
          about: {
            order: 2,
            label: "About",
            hint: "",
            content: [
              {
                type: "copy",
                value: ""
              }
            ]
          },
          info_pages: {
            order: 3,
            label: "Information Pages",
            hint: "",
            title: "",
            content: [
              {
                type: "copy",
                value: ""
              }
            ]
          },
          collections: {
            order: 4,
            label: "Collections",
            hint: "",
            title: "",
            content: [
              {
                type: "copy",
                value: ""
              }
            ]
          }
        },
        information: {
          introduction: {
            order: 1,
            label: "Page content",
            hint:
              "This is the largest content of the page. Use formatting to improve readability and impact.",
            content: [
              {
                type: "copy",
                value: ""
              }
            ]
          }
        }
      },
      imageChanged: false,
      altTextChanged: false
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
      const response = await this.form.post("/pages");

      const pageId = response.data.id;
      if (this.auth.isSuperAdmin && pageId) {
        this.$router.push({
          name: "pages-show",
          params: { page: pageId }
        });
      } else if (!this.form.$errors.any()) {
        this.$router.push({
          name: "pages-updated"
        });
      }
    },
    onUpdateTitle(title) {
      this.form.title = title;
      this.form.slug = this.slugify(title);
    }
  },

  created() {
    this.form.content = this.contentTypes[this.form.page_type];
  }
};
</script>

<style lang="scss" scoped></style>
