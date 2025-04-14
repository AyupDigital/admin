<template>
  <gov-width-container>
    <ck-loader v-if="loading" />
    <template v-else>
      <vue-headful :title="`${appName} - Duplicate Event`" />

      <gov-back-link :to="{ name: 'events-index' }"
        >Back to events</gov-back-link
      >
      <gov-main-wrapper>
        <gov-grid-row>
          <gov-grid-column width="full">
            <gov-heading size="xl">Events</gov-heading>
            <template v-if="updateRequestCreated">
              <gov-heading size="m" tag="h3"
                >Duplicate event request</gov-heading
              >
              <gov-body>{{ updateRequestMessage }}</gov-body>
              <gov-back-link :to="{ name: 'events-index' }"
                >Back to events</gov-back-link
              >
            </template>

            <template v-else>
              <gov-heading size="m">Duplicate event</gov-heading>
              <gov-body
                >The events will appear on their own page will be discoverable
                and filterable by visitors based on the information you
                provide</gov-body
              >
              <gov-error-summary
                v-if="form.$errors.any()"
                title="Check for errors"
              >
                <gov-list>
                  <li
                    v-for="(error, field) in form.$errors.all()"
                    :key="field"
                    v-text="error[0]"
                  />
                </gov-list>
              </gov-error-summary>
              <gov-tabs
                @tab-changed="onTabChange"
                :tabs="allowedTabs"
                no-router
              >
                <details-tab
                  v-show="isTabActive('details')"
                  :errors="form.$errors"
                  :id="event.id"
                  @update:title="onUpdateTitle"
                  :title.sync="form.title"
                  :slug.sync="form.slug"
                  :start_date.sync="form.start_date"
                  :end_date.sync="form.end_date"
                  :start_time.sync="form.start_time"
                  :end_time.sync="form.end_time"
                  :intro.sync="form.intro"
                  :description.sync="form.description"
                  :is_free.sync="form.is_free"
                  :fees_text.sync="form.fees_text"
                  :fees_url.sync="form.fees_url"
                  :organiser_name.sync="form.organiser_name"
                  :organiser_phone.sync="form.organiser_phone"
                  :organiser_email.sync="form.organiser_email"
                  :organiser_url.sync="form.organiser_url"
                  :booking_title.sync="form.booking_title"
                  :booking_summary.sync="form.booking_summary"
                  :booking_url.sync="form.booking_url"
                  :booking_cta.sync="form.booking_cta"
                  :homepage.sync="form.homepage"
                  :organisations="organisations"
                  :organisation_id.sync="form.organisation_id"
                  :is_virtual.sync="form.is_virtual"
                  :location_id.sync="form.location_id"
                  :image_file_id.sync="form.image_file_id"
                  @clear="form.$errors.clear($event)"
                  @image-changed="imageChanged = $event"
                  @alt-text-changed="altTextChanged = true"
                />
                <taxonomies-tab
                  v-if="isTabActive('taxonomies')"
                  @clear="
                    form.$errors.clear($event);
                    errors = {};
                  "
                  :errors="form.$errors"
                  :is-global-admin="auth.isGlobalAdmin"
                  :type="form.type"
                  :category_taxonomies.sync="form.category_taxonomies"
                >
                </taxonomies-tab>
              </gov-tabs>
              <gov-warning-text>
                Please be aware, by submitting these changes, any pending
                updates may be overwritten.
              </gov-warning-text>

              <gov-button v-if="form.$submitting" disabled type="submit"
                >Requesting...</gov-button
              >
              <gov-button
                v-else
                @click="onSubmit"
                :disabled="loading || !event"
                type="submit"
                >{{ updateButtonText }}</gov-button
              >
              <ck-submit-error v-if="form.$errors.any()" />
            </template>
          </gov-grid-column>
        </gov-grid-row>
      </gov-main-wrapper>
    </template>
  </gov-width-container>
</template>

<script>
import http from "@/http";
import Form from "@/classes/Form";
import DetailsTab from "@/views/events/forms/DetailsTab";
import TaxonomiesTab from "@/views/events/forms/TaxonomiesTab";
import Auth from "@/classes/Auth";

export default {
  name: "OrganisationEventEdit",

  components: { DetailsTab, TaxonomiesTab },

  data() {
    return {
      tabs: [
        { id: "details", heading: "Details", active: true },
        { id: "taxonomies", heading: "Taxonomies", active: false }
      ],
      organisations: [{ text: "Please select", value: null }],
      updateRequestCreated: false,
      updateRequestMessage: null,
      loading: false,
      event: null,
      form: null,
      imageChanged: false,
      altTextChanged: false
    };
  },

  computed: {
    allowedTabs() {
      if (!this.auth.isGlobalAdmin) {
        const taxonomiesTabIndex = this.tabs.findIndex(
          tab => tab.id === "taxonomies"
        );
        const tabs = this.tabs.slice();
        tabs.splice(taxonomiesTabIndex, 1);

        return tabs;
      }

      return this.tabs;
    },
    updateButtonText() {
      return this.auth.isSuperAdmin ? "Duplicate" : "Request duplicate";
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
    async fetchEvent() {
      this.loading = true;

      const response = await http.get(
        `/organisation-events/${this.$route.params.event}`
      );
      this.event = response.data.data;
      this.form = new Form({
        title: this.event.title,
        slug: this.event.slug,
        start_date: this.event.start_date,
        end_date: this.event.end_date,
        start_time: this.event.start_time,
        end_time: this.event.end_time,
        intro: this.event.intro,
        description: this.event.description,
        is_free: this.event.is_free,
        fees_text: this.event.fees_text || "",
        fees_url: this.event.fees_url || "",
        organiser_name: this.event.organiser_name || "",
        organiser_phone: this.event.organiser_phone || "",
        organiser_email: this.event.organiser_email || "",
        organiser_url: this.event.organiser_url || "",
        organisation_id: null,
        booking_title: this.event.booking_title || "",
        booking_summary: this.event.booking_summary || "",
        booking_url: this.event.booking_url || "",
        booking_cta: this.event.booking_cta || "",
        is_virtual: this.event.is_virtual,
        homepage: false,
        location_id: this.event.location_id,
        image_file_id: null,
        category_taxonomies: Auth.isSuperAdmin
          ? this.event.category_taxonomies.map(taxonomy => taxonomy.id)
          : []
      });

      this.loading = false;
    },

    async onSubmit() {
      if (!this.event) {
        return;
      }
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
      const response = await this.form.post(`/organisation-events`);

      const eventId = response.data.id;

      if (this.auth.isSuperAdmin && eventId) {
        this.$router.push({
          name: "events-show",
          params: { event: eventId }
        });
      } else if (!this.form.$errors.any()) {
        this.updateRequestCreated = true;
        this.updateRequestMessage = response.message;
      }
    },
    onTabChange({ index }) {
      this.tabs.forEach(tab => (tab.active = false));
      const tabId = this.allowedTabs[index].id;
      this.tabs.find(tab => tab.id === tabId).active = true;
    },
    isTabActive(id) {
      const tab = this.allowedTabs.find(tab => tab.id === id);

      return tab === undefined ? false : tab.active;
    },
    onUpdateTitle(title) {
      this.form.title = title;
      this.form.slug = this.slugify(title);
    }
  },

  created() {
    this.fetchEvent();
    this.fetchOrganisations();
  }
};
</script>

<style lang="scss" scoped></style>
