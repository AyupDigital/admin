<template>
  <!-- For links to internal pages -->
  <router-link
    v-if="to"
    :to="to"
    class="govuk-link govuk-link--no-visited-state"
    :aria-label="label"
  >
    <slot />
  </router-link>

  <!-- For dummy links that are handled by JavaScript -->
  <a
    v-else
    :href="href || 'javascript:;'"
    class="govuk-link govuk-link--no-visited-state"
    @click="onClick"
    :aria-label="label"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: "GovLink",
  props: {
    to: {
      required: false
    },
    href: {
      required: false
    },
    label: {
      required: false,
      type: String,
      default: null
    }
  },
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>
