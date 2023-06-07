// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import packageInfo from '../../package.json';

export const environment = {
  VERSION: packageInfo.version + "-dev",
  production: false,
  ravenFhirServer: "https://raven.heat.icl.gtri.org/mdi-fhir-server/fhir",
 // ravenFhirServer: "https://apps.hdap.gatech.edu/raven-fhir-server-dev/fhir/",
  ravenFhirServerBasicAuth: "client:secret",
  // ravenImportApi: "https://apps.hdap.gatech.edu/raven-import-api-dev/upload-xlsx-file",
  ravenImportApi: "https://raven.heat.icl.gtri.org/raven-import-api/upload-xlsx-file",
  fhirValidator: "https://apps.hdap.gatech.edu/HL7ValidatorService/fhir",
  blueJayServerBase: "https://apps.hdap.gatech.edu/bluejay-fhir-server/fhir"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
