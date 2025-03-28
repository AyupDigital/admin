<template>
  <div>
    <ck-text-input
      :value="slug"
      @input="onInput('slug', $event)"
      id="slug"
      label="Unique slug"
      type="text"
      :error="errors.get('slug')"
      v-if="auth.isSuperAdmin && showEditSlug"
    >
      <gov-hint slot="hint" for="slug">
        This will be used to access the category collection.<br />
        e.g. /collections/{{ slug }}
      </gov-hint>
    </ck-text-input>

    <ck-text-input
      :value="name"
      @input="onInput('name', $event)"
      id="name"
      label="Name"
      type="text"
      :error="errors.get('name')"
    />

    <ck-loader v-if="loading" />
    <ck-select-input
      v-else-if="!loading && appShowParentIdOnCollections"
      :value="parent_uuid"
      @input="onInput('parent_uuid', $event)"
      id="parent_uuid"
      label="Parent"
      :options="categoryOptions"
      :error="errors.get('parent_uuid')"
    />

    <ck-textarea-input
      :value="intro"
      @input="
        $emit('update:intro', $event);
        $emit('clear', 'intro');
      "
      id="intro"
      label="Description of category"
      hint="A short summary detailing what type of services the category contains."
      :maxlength="300"
      :error="errors.get('intro')"
    />

    <ck-image-input
      @input="onInput('image_file_id', $event.file_id)"
      @image-changed="$emit('image-changed', $event)"
      id="image"
      label="Category image"
      :file-id="image_file_id"
    >
      <template slot="after-error-message">
        <gov-error-message
          v-if="errors.get('image_file_id')"
          v-text="errors.get('image_file_id')"
          for="image"
        />
      </template>
    </ck-image-input>

    <collection-homepage-input
      :value="homepage"
      @input="onInput('homepage', $event)"
      id="homepage"
      label="Show the Category on the homepage"
      :error="errors.get('homepage')"
    />

    <collection-enabled-input
      :value="enabled"
      @input="onInput('enabled', $event)"
      id="status"
      type="category"
      label="Status of Category"
      :error="errors.get('enabled')"
    />

    <gov-heading size="m">Sideboxes</gov-heading>

    <gov-body>
      Create up to three sideboxes that will can be used to display information
      on the category results page.
    </gov-body>

    <ck-sideboxes-input
      :sideboxes="sideboxes"
      @input="onInput('sideboxes', $event)"
      :errors="errors"
    />

    <gov-label class="govuk-!-font-weight-bold">Taxonomies</gov-label>
    <ck-taxonomy-input
      root="categories"
      :invalid="errors.has('category_taxonomies')"
      :value="category_taxonomies"
      @input="$emit('update:category_taxonomies', $event)"
      :error="errors.get('category_taxonomies')"
      @clear="$emit('clear', 'category_taxonomies')"
      :showCollections="false"
    />
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkTaxonomyInput from "@/components/Ck/CkTaxonomyInput";
import CkSideboxesInput from "@/views/collections/inputs/SideboxesInput";
import CollectionEnabledInput from "@/views/collections/inputs/CollectionEnabledInput";
import CollectionHomepageInput from "@/views/collections/inputs/CollectionHomepageInput";
import http from "@/http"

export default {
  name: "CollectionForm",
  components: {
    CollectionEnabledInput,
    CollectionHomepageInput,
    CkTaxonomyInput,
    CkSideboxesInput,
    CkImageInput
  },
  props: {
    errors: {
      required: true,
      type: Object
    },
    id: {
      required: false,
      type: String
    },
    slug: {
      required: true
    },
    showEditSlug: {
      default: false
    },
    name: {
      required: true
    },
    intro: {
      required: true
    },
    order: {
      required: true
    },
    enabled: {
      required: true
    },
    homepage: {
      required: true
    },
    sideboxes: {
      required: true
    },
    category_taxonomies: {
      required: true
    },
    image_file_id: {
      required: true
    },
    parent_uuid: {
      required: false,
    },
    showParent: {
      default: false,
    }
  },
  data () {
    return {
      loading: false,
      categories: [],
      categoryOptions: []
    }
  },
  methods: {
    onInput(field, value) {
      this.$emit(`update:${field}`, value);
      this.$emit("clear", field);
    },
    async fetchCategories() {
      this.loading = true;

      const { data } = await http.get("/collections/categories/all");
      this.categories = data.data;
      this.categoryOptions = [
        { text: "No parent (top level)", value: null },
        ...this.parseCategories(this.categories)
      ];
      this.loading = false;
    },
    parseCategories(categories, parsed = [], depth = 0) {
      categories.forEach(category => {
        const text = "-".repeat(depth) + " " + category.name;
        parsed.push({ text, value: category.id });

        if ((category.children && category.children.length > 0) && depth < 4) {
          parsed = this.parseCategories(category.children, parsed, depth + 1);
        }
      })
      return parsed;
    },
  },
  created() {
    this.fetchCategories();
  }
};
</script>
