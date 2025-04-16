<template>
  <div>
    <vue-headful :title="`Admin: Taxonomies - ${appName}`" />

    <gov-tabs :tabs="tabs">
      <router-view />
    </gov-tabs>
  </div>
</template>

<script>
export default {
  name: "ListTaxonomies",
  data() {
    return {
      tabs: [
        { heading: "Categories", to: { name: "admin-index-taxonomies" } },
        {
          heading: "Service Eligibilities",
          to: { name: "admin-index-taxonomies-service-eligibilities" }
        }
      ]
    };
  }
};
</script>
