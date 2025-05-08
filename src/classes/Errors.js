import Vue from "vue";

export default class Errors {
  /**
   * Create a new Errors instance.
   */
  constructor() {
    this.errors = Vue.observable({});
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   * @returns {boolean}
   */
  has(field) {
    field = field.replace(/\./g, "_");
    return this.errors.hasOwnProperty(field);
  }

  /**
   * @param {string|null} field
   */
  state(field) {
    return this.has(field) ? "invalid" : null;
  }

  /**
   * Determine if we have any errors.
   *
   * @returns {boolean}
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Returns the errors object.
   *
   * @returns {Object}
   */
  all() {
    return this.errors;
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string|Array} fields
   * @returns {string|null}
   */
  get(fields) {
    fields = Array.isArray(fields) ? fields : [fields];

    for (let field of fields) {
      field = field.replace(/\./g, "_");
      if (this.errors[field]) {
        return this.errors[field][0];
      }
    }

    return null;
  }

  /**
   * Returns a new errors object with the errors that are nested in the given field.
   * This is useful for displaying errors in a nested structure.
   * For example, if you have a field called "user.name" and you want to get the errors
   * for the "name" field, you can use this method to get the errors for that field.
   * @param {string} field 
   * @returns {Errors}
   */
  getNestedAsErrors(field) {
    let keys = Object.keys(this.errors);
    const errors = new Errors();
    for (let key of keys) {
      if (key.includes(field)) {
        errors.record({ [key.replace(field, "")]: this.errors[key] });
      }
    }

    return errors;
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors
   */
  record(errors) {
    let keys = Object.keys(errors);

    keys.forEach(key => {
      if (key.includes(".")) {
        let new_key = key.replace(/\./g, "_");
        Vue.set(this.errors, new_key, errors[key]);
        delete errors[key];
      } else {
        Vue.set(this.errors, key, errors[key]);
      }
    });
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear(field) {
    if (field) {
      field = field.replace(/\./g, "_");
      Vue.delete(this.errors, field);

      return;
    }

    Object.keys(this.errors).forEach(key => {
      Vue.delete(this.errors, key);
    });
  }
}
