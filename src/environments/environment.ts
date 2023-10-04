export const environment = {
  // API and Configuration Happens at build time as core dependency.
  //dashboardApi: "https://raven.dev.heat.icl.gtri.org/raven-dashboard-api/",
  dashboardApi: "http://127.0.0.1:8000/",
  audience: "https://raven.dev.heat.icl.gtri.org/raven-dashboard-api/",
  domain: "dev-dk7cyfpkwowbtdbt.us.auth0.com",
  clientId: "M7knIi1ioWMc6Lufbt5lbyTrnxpKmL4q",
  useLocalConfig: true,
  overrideConfigLocation: "",

  // TODO: Move to runtime config services.
  // ravenFhirServer: "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir",
  // ravenFhirServerBasicAuth: "client:secret",
  // ravenImportApi: "https://raven.dev.heat.icl.gtri.org/raven-import-api",
  fhirValidator: "https://dev.heat.icl.gtri.org/fhir-validator-service/fhir", // TODO: Refactor modules to not rely on this.
  // blueJayServerBase: "https://bluejay.heat.icl.gtri.org/mdi-fhir-server",
  adminRedirectUrl: "https://localhost:4200/admin-panel",
  adminLogoutUrl: "https://localhost:4200/"
};
