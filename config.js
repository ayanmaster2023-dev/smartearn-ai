/* ===== SMARTEARN AI — EDIT SETTINGS HERE ONLY ===== */
const BUSINESS_CONFIG = {
  name: "SmartEarn AI",
  tagline: "Your Career, Our Design.",

  // WhatsApp: used by ALL contact / order / support buttons and the order form.
  // If you change the number, change the url too.
  whatsapp: {
    number: "923189877223",
    url: "https://wa.me/923189877223"
  },

  // Easypaisa: used ONLY by the payment page (never the WhatsApp number).
  // Leave number or accountHolder empty ("") to show:
  // "Easypaisa payment details will be provided after order confirmation."
  easypaisa: {
    number: "03459205915",
    accountHolder: "Waqar Ali",
    method: "Easypaisa"
  },

  email: "",     // e.g. "name@example.com"  (shows "Coming soon" when empty)
  facebook: "",  // e.g. "https://facebook.com/yourpage"
  currency: "PKR",

  // Prices in PKR. Change them here and every page updates.
  prices: { intro: 150, student: 150, graduate: 150, professional: 250, editing: 150 },

  // CV Type dropdown on order.html (keys must match the prices above)
  types: {
    student: "Student CV",
    graduate: "Fresh Graduate CV",
    professional: "Professional CV",
    editing: "CV Editing"
  }
};
