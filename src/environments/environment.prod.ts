
// To create a build for a local http server, replace the contents of this file with the contents of environments.ts.
// The prod file uses sensitive info stored in a different github repo
export const environment = {
  production: true,
  // API and Configuration Happens at build time as core dependency.
  dashboardApi: "",
  audience: "",
  domain: "",
  clientId: "",
  useLocalConfig: false,
  overrideConfigLocation: "",
  fhirValidator: "",
  adminRedirectUrl: "",
  adminLogoutUrl: ""
};
