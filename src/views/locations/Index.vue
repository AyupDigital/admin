<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Locations`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>

    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Locations</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch">
                <gov-form-group>
                  <gov-label for="filter[address_line_1]"
                    >Address line 1</gov-label
                  >
                  <gov-input
                    v-model="filters.address_line_1"
                    id="filter[address_line_1]"
                    name="filter[address_line_1]"
                    type="search"
                  />
                </gov-form-group>

                <template slot="extra-filters">
                  <gov-form-group>
                    <gov-label for="filter[city]">City</gov-label>
                    <gov-input
                      v-model="filters.city"
                      id="filter[city]"
                      name="filter[city]"
                      type="search"
                    />
                  </gov-form-group>

                  <gov-form-group>
                    <gov-label for="filter[postcode]">Postcode</gov-label>
                    <gov-input
                      v-model="filters.postcode"
                      id="filter[postcode]"
                      name="filter[postcode]"
                      type="search"
                    />
                  </gov-form-group>
                </template>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column v-if="auth.canAdd('location')" width="one-third">
              <gov-button @click="onAddLocation" type="submit" success expand
                >Add location</gov-button
              >
            </gov-grid-column>
          </gov-grid-row>

          <ck-resource-listing-table
            ref="locationsTable"
            uri="/locations"
            :params="params"
            default-sort="address_line_1"
            :columns="[
              {
                heading: 'Address line 1',
                sort: 'address_line_1',
                render: location => location.address_line_1 + ' ' + this.hasUpdateRequest(location)
              },
              {
                heading: 'City',
                sort: 'city',
                render: location => location.city
              },
              {
                heading: 'Postcode',
                sort: 'postcode',
                render: location => location.postcode
              }
            ]"
            :view-route="
              location => {
                return {
                  name: 'locations-show',
                  params: { location: location.id }
                };
              }
            "
          />
        </gov-grid-column>
      </gov-grid-row>
    </gov-main-wrapper>
  </gov-width-container>
</template>

<script>
import CkResourceListingTable from "@/components/Ck/CkResourceListingTable.vue";
import CkTableFilters from "@/components/Ck/CkTableFilters.vue";

export default {
  name: "ListLocations",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        address_line_1: "",
        city: "",
        postcode: ""
      }
    };
  },
  computed: {
    params() {
      let params = {};

      if (this.filters.address_line_1 !== "") {
        params["filter[address_line_1]"] = this.filters.address_line_1;
      }

      if (this.filters.city !== "") {
        params["filter[city]"] = this.filters.city;
      }

      if (this.filters.postcode !== "") {
        params["filter[postcode]"] = this.filters.postcode;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.locationsTable.currentPage = 1;
      this.$refs.locationsTable.fetchResources();
    },
    onAddLocation() {
      this.$router.push({ name: "locations-create" });
    },
    hasUpdateRequest(location) {
      if (location.pending_update_requests.length) {
        if (location.pending_update_requests.length > 1) {
          return `<a href="/update-requests/${location.pending_update_requests[0].id}"><span class="govuk-tag govuk-tag--yellow">Update Pending (${location.pending_update_requests.length})</span></a>`;
        }
        return `<a href="/update-requests/${location.pending_update_requests[0].id}"><span class="govuk-tag govuk-tag--yellow">Update Pending</span></a>`;
      }
      return '';
    }
  }
};
</script>
