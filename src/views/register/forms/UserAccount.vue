<template>
  <div>
    <gov-heading size="l"> Create an account </gov-heading>

    <gov-body> Please enter your details below to create an account. </gov-body>

    <gov-hint>
      By signing up you agree to our
      <gov-link target="_blank" :href="termsAndConditionsUrl"
        >T&amp;Cs</gov-link
      >
      and
      <gov-link target="_blank" :href="privacyPolicyUrl"
        >Privacy Policy</gov-link
      >
    </gov-hint>

    <ck-text-input
      v-model="form.user.first_name"
      id="first_name"
      label="First name"
      type="text"
      :error="errors.get('user.first_name')"
      :required="true"
    />

    <ck-text-input
      v-model="form.user.last_name"
      id="last_name"
      label="Last name"
      type="text"
      :error="errors.get('user.last_name')"
      :required="true"
    />

    <ck-text-input
      v-model="form.user.email"
      id="email"
      label="Email"
      type="email"
      :error="errors.get('user.email')"
      :required="true"
    />

    <ck-text-input
      v-model="form.user.phone"
      id="phone"
      label="Mobile Phone"
      type="tel"
      :error="errors.get('user.phone')"
      :required="form.user.otp_method === 'sms'"
    />

    <ck-select-input
      :value="form.user.otp_method"
      @input="form.user.otp_method = $event"
      id="otp_method"
      label="One Time Passcode Method"
      :hint="
        `Select the method you would like to receive your one time passcode when logging in.`
      "
      :options="[
        { text: 'SMS', value: 'sms' },
        { text: 'Email', value: 'email' }
      ]"
      :error="errors.get('user.otp_method')"
      :required="true"
    />

    <ck-password
      v-model="form.user.password"
      id="password"
      label="Password"
      :error="errors.get('user.password')"
      :required="true"
    />
  </div>
</template>

<script>
import CkPassword from "@/components/Ck/CkPassword.vue";
export default {
  components: {
    CkPassword
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
    termsAndConditionsUrl() {
      return `${this.appFrontendUri}/terms-and-conditions`;
    },
    privacyPolicyUrl() {
      return `${this.appFrontendUri}/privacy-policy`;
    }
  }
};
</script>

<style lang="scss" scoped></style>
