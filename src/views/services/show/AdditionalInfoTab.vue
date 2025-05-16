<template>
  <div>
    <gov-heading size="l">Additional info</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="row" top>Average wait time</gov-table-header>
          <gov-table-cell>{{ waitTime }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Is this {{ service.type }} free?</gov-table-header
          >
          <gov-table-cell>{{ isFree }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row v-if="appCqcLocationActive">
          <gov-table-header scope="row" top>CQC Location ID</gov-table-header>
          <gov-table-cell>{{ service.cqc_location_id || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Testimonial</gov-table-header>
          <gov-table-cell>{{ service.testimonial || "-" }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Video URL</gov-table-header>
          <gov-table-cell break>{{
            service.video_embed || "-"
          }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Contact name</gov-table-header>
          <gov-table-cell>{{ service.contact_name }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Public phone number</gov-table-header
          >
          <gov-table-cell>{{ service.contact_phone }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top
            >Public email address</gov-table-header
          >
          <gov-table-cell>{{ service.contact_email }}</gov-table-cell>
        </gov-table-row>
        <gov-table-row>
          <gov-table-header scope="row" top>Social links</gov-table-header>
          <gov-table-cell break>
            <gov-list>
              <li
                v-for="(socialMedia, index) in service.social_medias"
                :key="index"
              >
                ({{ humanReadableSocialMedia(socialMedia.type) }})
                {{ socialMedia.url }}
              </li>
              <li v-if="service.social_medias.length === 0">-</li>
            </gov-list>
          </gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
export default {
  name: "AdditionalInfoTab",
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
  },
  computed: {
    waitTime() {
      switch (this.service.wait_time) {
        case null:
          return `Not applicable for this ${this.service.type}`;
        case "one_week":
        case "two_weeks":
        case "three_weeks":
          return (
            this.service.wait_time.charAt(0).toUpperCase() +
            this.service.wait_time.replace("_", " ").substr(1)
          );
        case "month":
          return "One month";
        case "longer":
          return "Longer than one month";
      }
    },
    isFree() {
      return this.service.is_free ? "Yes" : "No";
    }
  }
};
</script>
