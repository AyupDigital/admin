<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">Global</gov-heading>

      <gov-body>Review the global content for the frontend.</gov-body>

      <ck-text-input
        :value="frontend.global.footer_title"
        @input="onInput({ field: 'footer_title', value: $event })"
        label="Footer Title"
        :error="errors.get('cms.frontend.global.footer_title')"
        id="cms.frontend.global.footer_title"
      />

      <ck-wysiwyg-input
        :value="frontend.global.footer_content"
        @input="onInput({ field: 'footer_content', value: $event })"
        label="Footer Content"
        :error="errors.get('cms.frontend.global.footer_content')"
        id="cms.frontend.global.footer_content"
      />

      <ck-text-input
        :value="frontend.global.contact_phone"
        @input="onInput({ field: 'contact_phone', value: $event })"
        label="Contact Phone Number"
        :error="errors.get('cms.frontend.global.contact_phone')"
        id="cms.frontend.global.contact_phone"
        type="tel"
      />

      <ck-text-input
        :value="frontend.global.contact_email"
        @input="onInput({ field: 'contact_email', value: $event })"
        label="Contact Email"
        :error="errors.get('cms.frontend.global.contact_email')"
        id="cms.frontend.global.contact_email"
        type="email"
      />

      <ck-social-medias-input
        :social-medias="frontend.global.social_medias"
        @input="onInput({ field: 'social_medias', value: $event })"
        :errors="errors"
        id="cms.frontend.global.social_medias"
      />
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
import CkSocialMediasInput from "@/components/Ck/CkSocialMediasInput.vue";

export default {
  name: "CmsFrontendGlobal",

  model: {
    prop: "frontend",
    event: "input"
  },

  components: {
    CkSocialMediasInput
  },

  props: {
    frontend: {
      type: Object,
      required: true
    },

    errors: {
      type: Object,
      required: true
    }
  },

  methods: {
    onInput({ field, value }) {
      const frontend = { ...this.frontend };

      frontend.global[field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.global.${field}`);
    }
  }
};
</script>
