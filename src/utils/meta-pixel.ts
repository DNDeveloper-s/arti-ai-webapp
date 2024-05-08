import ReactPixel from "react-facebook-pixel";

const advancedMatching = { em: "some@email.com" }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};

export const initMetaPixel = () => {
  ReactPixel.init("7960223604008434", undefined, options);
  ReactPixel.revokeConsent();
};

export const grantConsent = () => {
  ReactPixel.grantConsent();
};

export const logPageView = () => {
  ReactPixel.pageView();
};
