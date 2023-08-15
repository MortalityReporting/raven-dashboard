import packageInfo from '../../package.json';

export const environment = {
  // API and Configuration Happens at build time as core dependency.
  dashboardApi: "https://raven.dev.heat.icl.gtri.org/raven-dashboard-api/",
  domain: "dev-dk7cyfpkwowbtdbt.us.auth0.com",
  clientId: "M7knIi1ioWMc6Lufbt5lbyTrnxpKmL4q",
  useLocalConfig: false,
  overrideConfigLocation: "",

  // TODO: Move to runtime config service.
  ravenFhirServer: "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir",
  ravenFhirServerBasicAuth: "client:secret",
  ravenImportApi: "https://raven.dev.heat.icl.gtri.org/raven-import-api/upload-xlsx-file",
  fhirValidator: "https://dev.heat.icl.gtri.org/fhir-validator-service/fhir",
  blueJayServerBase: "https://bluejay.heat.icl.gtri.org/mdi-fhir-server",
  adminRedirectUrl: "https://localhost:4200/admin-panel",
  adminLogoutUrl: "https://localhost:4200/"
};
