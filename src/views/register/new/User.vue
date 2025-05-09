<template>
  <div>
    <gov-heading size="l"> Registration - step 4 of 5 </gov-heading>

    <gov-back-link :to="{ name: 'register-new-step3' }"> Back </gov-back-link>

    <user-account :form="form" :errors="errors" />
    <gov-button
      start
      :to="{ name: 'register-new-step5' }"
      :disabled="fieldsEmpty"
    >
      Next
    </gov-button>
  </div>
</template>

<script>
import UserAccount from "../forms/UserAccount";

export default {
  components: {
    UserAccount
  },
  model: {
    prop: "form",
    event: "update"
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    }
  },
  computed: {
    fieldsEmpty() {
      const requiredFields = ["email", "password", "first_name", "last_name"];
      if (this.form.user.otp_method === "sms") {
        requiredFields.push("phone");
      }
      return requiredFields.some(field => !this.form.user[field]);
    }
  }
};
</script>
