<template>
  <gov-width-container>
    <vue-headful :title="`${appName} - List Organisations`" />

    <gov-back-link :to="{ name: 'dashboard' }">Back to dashboard</gov-back-link>
    <gov-main-wrapper>
      <gov-grid-row>
        <gov-grid-column width="full">
          <gov-heading size="xl">Organisations</gov-heading>

          <gov-grid-row>
            <gov-grid-column width="two-thirds">
              <ck-table-filters @search="onSearch" hide-extra>
                <gov-form-group>
                  <gov-label for="filter[name]">Organisation name</gov-label>
                  <gov-input
                    v-model="filters.name"
                    id="filter[name]"
                    name="filter[name]"
                    type="search"
                  />
                </gov-form-group>
              </ck-table-filters>
            </gov-grid-column>
            <gov-grid-column
              v-if="auth.canAdd('organisation')"
              width="one-third"
            >
              <gov-button
                @click="onAddOrganisation"
                type="submit"
                success
                expand
                >Add organisation</gov-button
              >
              <gov-button
                v-if="auth.canImport('organisations')"
                :to="{ name: 'organisations-import' }"
                type="submit"
                success
                expand
                >Bulk import</gov-button
              >
            </gov-grid-column>
          </gov-grid-row>

          <ck-resource-listing-table
            ref="organisationsTable"
            uri="/organisations"
            :params="params"
            default-sort="name"
            :columns="[
              {
                heading: 'Organisation name',
                sort: 'name',
                render: (organisation, updateRequests) => organisation.name + ' ' + this.hasUpdateRequest(organisation, updateRequests)
              },
              {
                heading: 'Web address URL',
                render: organisation => organisation.url
              },
              {
                heading: 'Phone number',
                render: organisation => organisation.phone || '-'
              },
              {
                heading: 'Email',
                render: organisation => organisation.email || '-'
              }
            ]"
            :view-route="
              organisation => {
                return {
                  name: 'organisations-show',
                  params: { organisation: organisation.id }
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
  name: "ListOrganisations",
  components: { CkResourceListingTable, CkTableFilters },
  data() {
    return {
      filters: {
        name: ""
      },
    };
  },
  computed: {
    params() {
      const params = {
        "filter[has_permission]": true
      };

      if (this.filters.name !== "") {
        params["filter[name]"] = this.filters.name;
      }

      return params;
    }
  },
  methods: {
    onSearch() {
      this.$refs.organisationsTable.currentPage = 1;
      this.$refs.organisationsTable.fetchResources();
    },
    onAddOrganisation() {
      this.$router.push({ name: "organisations-create" });
    },
    hasUpdateRequest(organisation, updateRequests) {
      const request = updateRequests.filter(r => 
        r.updateable_id === organisation.id
      );
      if (request.length) {
        if (request.length > 1) {
          return `<a href="/update-requests/${request[0].id}"><span class="govuk-tag govuk-tag--yellow">Update Pending (${request.length})</span></a>`;
        }
        return `<a href="/update-requests/${request[0].id}"><span class="govuk-tag govuk-tag--yellow">Update Pending</span></a>`;
      }
      return '';
    }
  }
};
</script>
