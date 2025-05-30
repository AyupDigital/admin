// Import polyfills.
import "@babel/polyfill";

// Import styling.
import "@/scss/app.scss";

// Moment (date/time library).
import moment from "moment";

// Axios.
import http from "@/http";

// Auth.
import Auth from "@/classes/Auth";

// Markdown conversion.
import MarkdownConverter from "@/classes/MarkdownConverter";

// Google maps.
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY
  }
});

// Import Duet Date Picker
import { defineCustomElements } from "@duetds/date-picker/dist/loader";

// Vue
import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";

// Sentry
import * as Sentry from "@sentry/vue";

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration(),]
  });
}

// Vue headful.
import VueHeadful from "vue-headful";
Vue.component("vue-headful", VueHeadful);

// Custom Vue Components
Vue.component("CkFileInput", () => import("@/components/Ck/CkFileInput"));
Vue.component("CkRadioInput", () => import("@/components/Ck/CkRadioInput"));
Vue.component("CkSelectInput", () => import("@/components/Ck/CkSelectInput"));
Vue.component("CkTextareaInput", () =>
  import("@/components/Ck/CkTextareaInput")
);
Vue.component("CkTextInput", () => import("@/components/Ck/CkTextInput"));
Vue.component("CkWysiwygInput", () => import("@/components/Ck/CkWysiwygInput"));

Vue.component("CkDeleteButton", () => import("@/components/CkDeleteButton"));
Vue.component("CkLoader", () => import("@/components/CkLoader"));
Vue.component("CkOrganisationDetails", () =>
  import("@/components/CkOrganisationDetails")
);
Vue.component("CkReferralDetails", () =>
  import("@/components/CkReferralDetails")
);
Vue.component("CkServiceLocationsTable", () =>
  import("@/components/CkServiceLocationsTable")
);
Vue.component("CkSubmitError", () => import("@/components/CkSubmitError"));
Vue.component("CkUserDetails", () => import("@/components/CkUserDetails"));
Vue.component("CkWysiwyg", () => import("@/components/CkWysiwyg"));

// Gov.UK Vue Components
Vue.component("GovBackLink", () => import("@/components/Gov/GovBackLink"));
Vue.component("GovBody", () => import("@/components/Gov/GovBody"));
Vue.component("GovButton", () => import("@/components/Gov/GovButton"));
Vue.component("GovCaption", () => import("@/components/Gov/GovCaption"));
Vue.component("GovCheckbox", () => import("@/components/Gov/GovCheckbox"));
Vue.component("GovCheckboxes", () => import("@/components/Gov/GovCheckboxes"));
Vue.component("GovDetails", () => import("@/components/Gov/GovDetails"));
Vue.component("GovErrorMessage", () =>
  import("@/components/Gov/GovErrorMessage")
);
Vue.component("GovErrorSummary", () =>
  import("@/components/Gov/GovErrorSummary")
);
Vue.component("GovFieldsetLegend", () =>
  import("@/components/Gov/GovFieldsetLegend")
);
Vue.component("GovFileUpload", () => import("@/components/Gov/GovFileUpload"));
Vue.component("GovFooter", () => import("@/components/Gov/GovFooter"));
Vue.component("GovFormGroup", () => import("@/components/Gov/GovFormGroup"));
Vue.component("GovGridColumn", () => import("@/components/Gov/GovGridColumn"));
Vue.component("GovGridRow", () => import("@/components/Gov/GovGridRow"));
Vue.component("GovHeader", () => import("@/components/Gov/GovHeader"));
Vue.component("GovHeading", () => import("@/components/Gov/GovHeading"));
Vue.component("GovHint", () => import("@/components/Gov/GovHint"));
Vue.component("GovInput", () => import("@/components/Gov/GovInput"));
Vue.component("GovInsetText", () => import("@/components/Gov/GovInsetText"));
Vue.component("GovLabel", () => import("@/components/Gov/GovLabel"));
Vue.component("GovLink", () => import("@/components/Gov/GovLink"));
Vue.component("GovList", () => import("@/components/Gov/GovList"));
Vue.component("GovMainWrapper", () =>
  import("@/components/Gov/GovMainWrapper")
);
Vue.component("GovRadio", () => import("@/components/Gov/GovRadio"));
Vue.component("GovRadios", () => import("@/components/Gov/GovRadios"));
Vue.component("GovSectionBreak", () =>
  import("@/components/Gov/GovSectionBreak")
);
Vue.component("GovSelect", () => import("@/components/Gov/GovSelect"));
Vue.component("GovSkipLink", () => import("@/components/Gov/GovSkipLink"));
Vue.component("GovTable", () => import("@/components/Gov/GovTable"));
Vue.component("GovTableCell", () => import("@/components/Gov/GovTableCell"));
Vue.component("GovTableHeader", () =>
  import("@/components/Gov/GovTableHeader")
);
Vue.component("GovTableRow", () => import("@/components/Gov/GovTableRow"));
Vue.component("GovTabs", () => import("@/components/Gov/GovTabs"));
Vue.component("GovTabPanel", () => import("@/components/Gov/GovTabPanel"));
Vue.component("GovTag", () => import("@/components/Gov/GovTag"));
Vue.component("GovTextarea", () => import("@/components/Gov/GovTextarea"));
Vue.component("GovWarningText", () =>
  import("@/components/Gov/GovWarningText")
);
Vue.component("GovWidthContainer", () =>
  import("@/components/Gov/GovWidthContainer")
);

// Vue Helpers
Vue.mixin({
  data() {
    return {
      auth: Auth,
      moment
    };
  },
  computed: {
    now() {
      return moment().format(moment.HTML5_FMT.DATE_TIME_SECONDS);
    },
    contactEmail() {
      return process.env.VUE_APP_CONTACT_EMAIL;
    },
    sessionMinutes() {
      return process.env.VUE_APP_SESSION_TIMEOUT;
    },
    appName() {
      return process.env.VUE_APP_NAME;
    },
    appApiClientId() {
      return process.env.VUE_APP_API_CLIENT_ID;
    },
    appUri() {
      return process.env.VUE_APP_URI;
    },
    appApiUri() {
      return process.env.VUE_APP_API_URI;
    },
    appFrontendUri() {
      return process.env.VUE_APP_FRONTEND_URI;
    },
    appSessionTimeout() {
      return process.env.VUE_APP_SESSION_TIMEOUT;
    },
    appCqcLocationActive() {
      return process.env.hasOwnProperty("VUE_APP_CQC_LOCATION_ACTIVE")
        ? process.env.VUE_APP_CQC_LOCATION_ACTIVE === "true"
        : false;
    },
    appServiceTagsActive() {
      return process.env.hasOwnProperty("VUE_APP_SERVICE_TAGS")
        ? process.env.VUE_APP_SERVICE_TAGS === "true"
        : false;
    },
    appServiceOfferingsActive() {
      return process.env.hasOwnProperty("VUE_APP_SERVICE_OFFERINGS")
        ? process.env.VUE_APP_SERVICE_OFFERINGS === "true"
        : true;
    },
    appHelpSectionActive() {
      return process.env.hasOwnProperty("VUE_APP_HELP_SECTION")
        ? process.env.VUE_APP_HELP_SECTION === "true"
        : false;
    },
    appServiceShowBestPracticeGuidance() {
      return process.env.hasOwnProperty(
        "VUE_APP_SERVICE_SHOW_BEST_PRACTICE_GUIDANCE"
      )
        ? process.env.VUE_APP_SERVICE_SHOW_BEST_PRACTICE_GUIDANCE === "true"
        : false;
    },
    appServiceBestPracticeGuidanceUrl() {
      return process.env.VUE_APP_SERVICE_BEST_PRACTICE_GUIDANCE_URL;
    },
    appHideEventOnHomepage() {
      return process.env.hasOwnProperty(
        "VUE_APP_HIDE_EVENT_ON_HOMEPAGE"
      )
        ? process.env.VUE_APP_HIDE_EVENT_ON_HOMEPAGE === "true"
        : false;
    },
    appShowParentIdOnCollections() {
      return process.env.hasOwnProperty(
        "VUE_APP_SHOW_PARENT_ID_ON_COLLECTIONS"
      )
        ? process.env.VUE_APP_SHOW_PARENT_ID_ON_COLLECTIONS === "true"
        : false;
    }
  },
  methods: {
    apiUrl(path) {
      const trimmedPath = path.replace(/^\//, "");

      return `${this.appApiUri}/core/v1/${trimmedPath}`;
    },
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    },
    formatDate(date) {
      return moment(date, moment.ISO_8601).format("D/M/YYYY");
    },
    formatTime(time) {
      return moment(time, moment.HTML5_FMT.TIME_SECONDS).format(
        moment.HTML5_FMT.TIME
      );
    },
    formatDateTime(dateTime) {
      return moment(dateTime, moment.ISO_8601).format("D/M/YYYY HH:mm");
    },
    toMarkdown(html) {
      return MarkdownConverter.toMarkdown(html);
    },
    toHtml(markdown) {
      return MarkdownConverter.toHtml(markdown);
    },
    async fetchAll(uri, params = {}, method = "get") {
      let page = 1;
      let perPage = 100;
      let mergedParams = { ...params, page, per_page: perPage };
      let allFetched = false;
      let resources = [];

      method = method.toLowerCase();
      const payload =
        method === "get" ? { params: mergedParams } : mergedParams;

      do {
        const { data } = await http[method](uri, payload);
        resources = [...resources, ...data.data];
        allFetched = data.meta.current_page === data.meta.last_page;
        mergedParams.page++;
      } while (!allFetched);

      return resources;
    }
  },
  filters: {
    ucfirst(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    },
    plural(string) {
      const plurals = {
        service: "services",
        activity: "activities",
        club: "clubs",
        group: "groups"
      };

      return plurals[string];
    }
  }
});

Vue.config.productionTip = false;

// configure Vue.js to ignore Duet Date Picker
Vue.config.ignoredElements = [/duet-\w*/];

// Register Duet Date Picker
defineCustomElements(window);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
