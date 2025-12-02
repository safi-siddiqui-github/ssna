export const Routes = {
  admin: {},
  web: {
    auth: {},
    general: {
      home: "/",
      contact: "/contact",
      about: "/about",
      features: "/features",
      howItWorks: "/how-it-works",
      help: "/help",
      events: "/events",
      organizers: "/organizers",
    },
    guest: {
      signin: "/signin",
      signup: "/signup",
      socialLogin: "/social-login",
      forgotPasswordCheckEmail: "/forgot-password/check-email",
      forgotPasswordUpdatePassword: "/forgot-password/update-password",
      emailVerificationCheckEmail: "/email-verification",
    },
  },
};
