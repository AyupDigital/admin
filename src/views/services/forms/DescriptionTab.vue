<template>
  <div>
    <gov-heading size="l">What does your {{ type }} offer</gov-heading>
    <gov-grid-row>
      <gov-grid-column width="one-half">
        <gov-body>
          These sections should describe what your {{ type }} offers and is the
          main body of content on your page on {{ appName }}.
        </gov-body>

        <gov-section-break size="l" />

        <ck-textarea-input
          :value="intro"
          @input="
            $emit('update:intro', $event);
            $emit('clear', 'intro');
          "
          id="intro"
          :label="`Your ${type}, an overview?`"
          :hint="`Write a brief description of what your ${type} does.`"
          :maxlength="300"
          :error="errors.get('intro')"
        />

        <template v-if="appServiceOfferingsActive">
          <gov-heading size="m">What you offer</gov-heading>

          <gov-body>
            Include a bullet list of some of the things you do as a {{ type }}.
          </gov-body>

          <gov-body>
            For example: (Weekly Meetups, Peer Support, Group Therapy)
          </gov-body>

          <ck-offerings-input
            :offerings="offerings"
            @input="$emit('update:offerings', $event)"
            @clear="$emit('clear', $event)"
            :errors="errors"
          />
        </template>

        <ck-wysiwyg-input
          :value="description"
          @input="
            $emit('update:description', $event);
            $emit('clear', 'description');
          "
          id="description"
          label="Long description"
          :hint="descriptionHint"
          :error="errors.get('description')"
          large
          :maxlength="10000"
        />

        <slot />
      </gov-grid-column>
    </gov-grid-row>
  </div>
</template>

<script>
import CkOfferingsInput from "@/views/services/inputs/OfferingsInput.vue";

export default {
  name: "DescriptionTab",
  components: {
    CkOfferingsInput,
  },
  props: {
    errors: {
      required: true,
    },
    type: {
      required: true,
      type: String,
    },
    intro: {
      required: true,
    },
    offerings: {
      required: true,
    },
    description: {
      required: true,
    },
  },
  computed: {
    descriptionHint() {
      let hint = `This is the largest body of text on your page. Fill it with everything else someone should know about your ${this.type}. Use headers, bullets and formatting for the maximum effect.`;
      if (this.appServiceShowBestPracticeGuidance) {
        hint += ` Follow <a href='${this.appServiceBestPracticeGuidanceUrl}' target='_blank'>best practice guidance</a> when writing about your service.`;
      }
      return hint;
    },
  },
};
</script>
