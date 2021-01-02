export default {
  isEmailValid: true,

  isEmail (email) {
    this.email = email;
    return this.isEmailValid;
  },
};
