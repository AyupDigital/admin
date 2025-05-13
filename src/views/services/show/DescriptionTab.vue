<template>
  <div>
    <gov-heading size="l">Descriptions</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header top scope="row"
            >Summary of {{ service.type }}</gov-table-header
          >
          <gov-table-cell>{{ service.intro }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header top scope="row"
            >{{ service.type | ucfirst }} description</gov-table-header
          >
          <gov-table-cell v-html="toHtml(service.description)" />
        </gov-table-row>
        <gov-table-row v-if="appServiceOfferingsActive">
          <gov-table-header top scope="row">Offerings</gov-table-header>
          <gov-table-cell>
            <gov-list v-if="service.offerings.length > 0" bullet>
              <li
                v-for="{ offering, order } in service.offerings"
                :key="`ServiceOffering::${order}`"
              >
                {{ offering }}
              </li>
            </gov-list>
            <template v-else>None</template>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
export default {
  name: "DescriptionTab",
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  methods: {
    humanReadableSocialMedia(type) {
      switch (type) {
        case "twitter":
          return "Twitter / X";
        case "facebook":
          return "Facebook";
        case "instagram":
          return "Instagram";
        case "snapchat":
          return "Snapchat";
        case "tiktok":
          return "TikTok";
        case "youtube":
          return "YouTube";
        case "other":
          return "Other";
      }
    }
  }
};
</script>
