<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">Cookie Policy</gov-heading>

      <gov-body>
        Review the content for the cookie policy page on the frontend.
      </gov-body>

      <ck-text-input
        :value="frontend.cookie_policy.title"
        @input="onInput({ field: 'title', value: $event })"
        label="Title"
        :error="errors.get('cms.frontend.cookie_policy.title')"
        id="cms.frontend.cookie_policy.title"
      />

      <ck-wysiwyg-input
        :value="frontend.cookie_policy.content"
        @input="onInput({ field: 'content', value: $event })"
        label="Content"
        :error="errors.get('cms.frontend.cookie_policy.content')"
        id="cms.frontend.cookie_policy.content"
      />
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
export default {
  name: "CmsFrontendCookiePolicy",

  model: {
    prop: "frontend",
    event: "input"
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

      frontend.cookie_policy[field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.cookie_policy.${field}`);
    }
  }
};
</script>
