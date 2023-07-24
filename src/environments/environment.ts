import packageInfo from '../../package.json';

export const environment = {
  VERSION: packageInfo.version + "-dev",
  production: false,
  ravenFhirServer: "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir",
  ravenFhirServerBasicAuth: "client:secret",
  ravenImportApi: "https://raven.dev.heat.icl.gtri.org/raven-import-api/upload-xlsx-file",
  fhirValidator: "https://heat.icl.gtri.org/fhir-validator-service/ ",
  blueJayServerBase: "https://bluejay.heat.icl.gtri.org/mdi-fhir-server",
  adminRedirectUrl: "https://localhost:4200/admin-panel",
  adminLogoutUrl: "https://localhost:4200/"
};
