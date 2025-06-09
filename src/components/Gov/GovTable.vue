<template>
  <div class="govuk-table-wrapper">
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <slot name="header" />
      </thead>
      <tbody class="govuk-table__body">
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "GovTable"
};
</script>

<style lang="scss">
.govuk-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;

  // Hide scrollbar in IE/Edge while still allowing scrolling
  -ms-overflow-style: -ms-autohiding-scrollbar;

  // Ensure the table fills the wrapper
  .govuk-table {
    margin-bottom: 0;
    min-width: 100%;
  }
}
</style>
