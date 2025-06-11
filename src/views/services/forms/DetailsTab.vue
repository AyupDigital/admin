<template>
  <div>
    <gov-heading tag="h2" size="l">{{ type | ucfirst }} details</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="one-half">
        <gov-body>
          General details about the {{ type }}. (We use {{ type }} in the
          broadcast sense, This could be counciling or weekly yoga classes).
        </gov-body>

        <gov-section-break size="l" />

        <ck-select-input
          :value="type"
          @input="
            $emit('update:type', $event);
            $emit('clear', 'type');
          "
          id="type"
          label="What is it?"
          :hint="`This option changes how your page is described on ${appName}`"
          :options="typeOptions"
          :error="errors.get('type')"
          :required="true"
        />

        <ck-text-input
          :value="name"
          @input="onNameInput($event)"
          id="name"
          :label="`What is the name of your ${type}?`"
          type="text"
          :error="errors.get('name')"
          :required="true"
        />

        <ck-text-input
          :value="slug"
          @input="
            $emit('update:slug', $event);
            $emit('clear', 'slug');
          "
          id="slug"
          label="Unique slug"
          type="text"
          :error="errors.get('slug')"
          v-if="auth.isGlobalAdmin"
          :required="true"
        >
          <gov-hint slot="hint" for="slug">
            This will be used to access the {{ type }} page.<br />
            e.g. example.com/services/{{ slug }}
          </gov-hint>
        </ck-text-input>

        <template v-if="isNew || auth.isGlobalAdmin">
          <ck-loader v-if="loading" />
          <ck-select-input
            v-else
            :value="organisation_id"
            @input="
              $emit('update:organisation_id', $event);
              $emit('clear', 'organisation_id');
            "
            id="organisation_id"
            label="Organisation"
            :hint="`Which organisation hosts this ${type}?`"
            :options="organisations"
            :error="errors.get('organisation_id')"
            :required="true"
          />
        </template>

        <ck-text-input
          :value="url"
          @input="
            $emit('update:url', $event);
            $emit('clear', 'url');
          "
          id="url"
          :label="`What is the web address of your ${type}?`"
          :hint="
            `This must start with ‘http://’ or ‘https://’. You can use your organisation’s website address if the ${type} doesn’t have its own.`
          "
          type="url"
          :error="errors.get('url')"
        />

        <ck-select-input
          :value="score"
          @input="
            $emit('update:score', $event);
            $emit('clear', 'score');
          "
          id="score"
          label="Quality Score"
          :hint="
            `Rate the overall effectiveness and quality of the ${type} between 1 (poor) and 5 (excellent). This is not displayed but affects positioning within search results.`
          "
          :options="scoreOptions"
          :error="errors.get('score')"
          v-if="auth.isSuperAdmin"
        />

        <ck-radio-input
          :value="national"
          @input="$emit('update:national', $event)"
          id="national"
          :label="`Is the ${type} a national ${type}?`"
          :options="nationalOptions"
          :error="errors.get('national')"
        />

        <ck-checkbox-input
          :value="attending_type"
          @input="
            $emit('update:attending_type', $event);
            $emit('clear', 'attending_type');
          "
          id="attending_type"
          :label="`How do people access the ${type}?`"
          :hint="
            `Indicates how people can access the ${type} (e.g. phone, venue, home, online).`
          "
          :options="attendingTypeOptions"
          :error="errors.get('attending_type')"
          :required="true"
        />

        <ck-checkbox-input
          :value="attending_access"
          @input="
            $emit('update:attending_access', $event);
            $emit('clear', 'attending_access');
          "
          id="attending_access"
          :label="`Is the ${type} open to the public?`"
          :hint="
            `Indicates if the ${type} is open to the public or requires a referral.`
          "
          :options="attendingAccessOptions"
          :error="errors.get('attending_access')"
          :required="true"
        />

        <ck-radio-input
          :value="status"
          @input="
            $emit('update:status', $event);
            $emit('clear', 'status');
          "
          id="status"
          :label="`Is the ${type} enabled`"
          :hint="
            `Indicates if the ${type} is enabled or disabled (disabled ${$options.filters.plural(
              type
            )} will not be shown in search results)`
          "
          :options="statusOptions"
          :error="errors.get('status')"
          v-if="auth.isGlobalAdmin"
        />

        <gov-fieldset>
          <gov-legend>
            <gov-label for="ends_at" class="govuk-!-font-weight-bold">
              <slot name="label"
                >Auto disable this service at a specific date?</slot
              >
            </gov-label>
            <slot name="hint">
              <gov-hint for="ends_at">
                If this service has a limited time of operation, enter an end
                date below, after which the service will automatically become
                disabled and not be discoverable on the platform to public
                users.
              </gov-hint>
            </slot>
          </gov-legend>
        </gov-fieldset>
        <ck-date-picker
          id="ends_at"
          :value="ends_at"
          :error="errors.get('end_date')"
          @input="
            $emit('update:ends_at', $event);
            $emit('clear', 'ends_at');
          "
          label="End date"
          :hint="`The date which this ${type} should be made inactive`"
        />

        <gov-heading tag="h2" size="m">Service Logo</gov-heading>
        <ck-image-input
          @input="
            $emit('update:logo_file_id', $event.file_id);
            $emit('update:logo', $event.image);
          "
          @image-changed="
            $emit('image-changed', $event);
            $emit('clear', 'file');
          "
          @alt-text-changed="
            $emit('alt-text-changed', $event);
            $emit('clear', 'alt_text');
          "
          id="logo"
          :label="`Upload your ${type} logo`"
          :file-id="logo_file_id"
          :errors="errors"
        >
          <template slot="hint">
            <gov-hint for="logo">
              This can be different to the logo of your organisation.
              <gov-link :href="logoHelpHref"
                >Need help with your logo?</gov-link
              >
            </gov-hint>
            <gov-hint for="logo">
              If your {{ type }} doesn't have a logo, the site will use the
              organisation logo if there is one uploaded.
            </gov-hint>
          </template>
        </ck-image-input>

        <gov-heading tag="h2" size="m">Gallery items</gov-heading>

        <gov-body>
          Upload images of the {{ type }} to the {{ type }}'s gallery.
        </gov-body>

        <ck-gallery-items-input
          :gallery-items="gallery_items"
          @input="$emit('update:gallery_items', $event)"
          @clear="$emit('clear', $event)"
          :errors="errors"
        />

        <template v-if="appServiceTagsActive">
          <gov-heading tag="h2" size="m">Tags</gov-heading>

          <gov-body v-if="auth.isGlobalAdmin">
            Select tags to help users find the {{ type }}.
          </gov-body>

          <tag-input
            :service-tags="tags"
            @input="$emit('update:tags', $event)"
            @clear="$emit('clear', $event)"
            :errors="errors"
          />
        </template>

        <slot />
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import CkDatePicker from "@/components/Ck/CkDatePicker";
import CkGalleryItemsInput from "@/views/services/inputs/GalleryItemsInput";
import TagInput from "@/views/services/inputs/TagInput";
import CkCheckboxInput from "@/components/Ck/CkCheckboxInput.vue";

export default {
  name: "DetailsTab",
  components: {
    CkImageInput,
    CkGalleryItemsInput,
    CkDatePicker,
    TagInput,
    CkCheckboxInput
  },
  props: {
    errors: {
      required: true
    },
    isNew: {
      required: false,
      type: Boolean,
      default: false
    },
    name: {
      required: true
    },
    slug: {
      required: true
    },
    type: {
      required: true
    },
    national: {
      default: false
    },
    attending_type: {
      required: false
    },
    attending_access: {
      required: false
    },
    organisation_id: {
      required: false
    },
    url: {
      required: true
    },
    status: {
      required: true
    },
    score: {
      required: true
    },
    ends_at: {
      required: true
    },
    logo_file_id: {
      required: true
    },
    gallery_items: {
      required: true
    },
    tags: {
      required: true
    },
    id: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      organisations: [{ text: "Please select", value: null, disabled: true }],
      loading: false,
      typeOptions: [
        { text: "It is a Service", value: "service" },
        { text: "It is an Activity", value: "activity" },
        { text: "It is a Club", value: "club" },
        { text: "It is a Group", value: "group" }
      ],
      statusOptions: [
        { label: "Enabled", value: "active" },
        { label: "Disabled", value: "inactive" }
      ],
      scoreOptions: [
        { text: "Unrated", value: "" },
        { text: "Poor", value: 1 },
        { text: "Below Average", value: 2 },
        { text: "Average", value: 3 },
        { text: "Above Average", value: 4 },
        { text: "Excellent", value: 5 }
      ],
      attendingAccessOptions: [
        { label: "Referral", value: "referral" },
        { label: "Appointment", value: "appointment" },
        { label: "Drop-in", value: "drop_in" },
        { label: "Membership", value: "membership" }
      ],
      attendingTypeOptions: [
        { label: "Phone", value: "phone" },
        { label: "Venue", value: "venue" },
        { label: "Home", value: "home" },
        { label: "Online", value: "online" }
      ]
    };
  },
  computed: {
    logoHelpHref() {
      const to = this.contactEmail;
      const subject = "Help uploading service logo";

      return `mailto:${to}?subject=${encodeURIComponent(subject)}`;
    },
    nationalOptions() {
      return [
        {
          value: true,
          label: `Yes - The ${this.type} is a national ${this.type}`
        },
        {
          value: false,
          label: `No - The ${this.type} is a local ${this.type}`
        }
      ];
    }
  },
  methods: {
    async fetchOrganisations() {
      this.loading = true;
      let fetchedOrganisations = await this.fetchAll("/organisations", {
        "filter[has_permission]": true
      });
      fetchedOrganisations = fetchedOrganisations.map(organisation => {
        return { text: organisation.name, value: organisation.id };
      });
      this.organisations = [...this.organisations, ...fetchedOrganisations];
      this.loading = false;
    },
    onNameInput(name) {
      this.$emit("update:name", name);
      this.$emit("clear", "name");

      if (this.auth.isGlobalAdmin || this.isNew) {
        this.$emit("update:slug", this.slugify(name));
        this.$emit("clear", "slug");
      }
    }
  },
  created() {
    this.fetchOrganisations();
  }
};
</script>
