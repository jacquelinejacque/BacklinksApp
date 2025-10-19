export const Const = {
  BASE_URL: process.env.VUE_APP_BASE_URL || '',
  RECAPTCHA_SITE_KEY: process.env.VUE_APP_RECAPTCHA_SITE_KEY || ''
}

console.log('Loaded ENV:', {
  BASE_URL: Const.BASE_URL,
  RECAPTCHA_SITE_KEY: Const.RECAPTCHA_SITE_KEY
});
