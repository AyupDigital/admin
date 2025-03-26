<template>
  <div>
    <gov-heading size="l">Referral</gov-heading>
    <gov-table>
      <template slot="body">
        <gov-table-row>
          <gov-table-header scope="row" top>Referral method</gov-table-header>
          <gov-table-cell>{{ referralMethod }}</gov-table-cell>
        </gov-table-row>
      </template>
    </gov-table>
  </div>
</template>

<script>
export default {
  name: "ContactInfoTab",
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  computed: {
    referralMethod() {
      return (
        this.service.referral_method.charAt(0).toUpperCase() +
        this.service.referral_method.substr(1)
      );
    }
  }
};
</script>
