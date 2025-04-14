<template>
  <div>
    <gov-heading tag="h4" size="s">Image</gov-heading>
    <gov-error-message v-if="error !== null" v-text="error" :for="id" />
    <ck-image-input
      :file-id="image.id"
      @input="onInput($event)"
      id="image_input"
      label="Upload your image"
      :errors="errors"
    />
  </div>
</template>

<script>
import CkImageInput from "@/components/Ck/CkImageInput";
import Errors from "@/classes/Errors";
export default {
  name: "CkPageImage",

  components: {
    CkImageInput
  },

  props: {
    error: {
      required: true
    },
    image: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      errors: new Errors()
    };
  },

  methods: {
    onInput(value) {
      const image = Object.assign({}, this.image);
      image.id = value.file_id;
      image.alt_text = value.alt_text;
      image.url = value.url;
      this.$emit("input", image);
      this.$emit("clear", "image");
    }
  }
};
</script>

<style lang="scss" scoped></style>
