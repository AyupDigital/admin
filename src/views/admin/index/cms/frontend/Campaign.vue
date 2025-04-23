<template>
  <gov-grid-row>
    <gov-grid-column width="two-thirds">
      <gov-heading size="l">Campaigns</gov-heading>

      <gov-body>Review the content for the campaigns on the frontend.</gov-body>

      <ck-banner-input
        v-for="(banner, index) in frontend.home.banners"
        :key="`home-banner-${index}`"
        v-model="frontend.home.banners[index]"
        :errors="errors.get('cms.frontend.home.banners')"
      >
        <gov-button @click="onRemoveBanner(index)" type="button" error
          >Remove campaign</gov-button
        >
      </ck-banner-input>
      <gov-button @click="onAddBanner">
        <template v-if="frontend.home.banners.length === 0"
          >Add campaign</template
        >
        <template v-else>Add another</template>
      </gov-button>
    </gov-grid-column>
  </gov-grid-row>
</template>

<script>
import CkBannerInput from "@/components/Ck/CkBannerInput";

export default {
  name: "CmsFrontendCampaigns",

  components: {
    CkBannerInput
  },

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
    onAddBanner() {
      let banners = this.frontend.home.banners.slice();
      banners.push({
        title: "",
        content: "",
        button_text: "",
        button_url: ""
      });
      this.frontend.home.banners = banners;
    },
    onRemoveBanner(index) {
      this.frontend.home.banners.splice(index, 1);
    },
    onInput({ field, value }) {
      const frontend = { ...this.frontend };

      frontend.home[field] = value;

      this.$emit("input", frontend);
      this.$emit("clear", `frontend.home.${field}`);
    }
  }
};
</script>
