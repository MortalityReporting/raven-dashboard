// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import packageInfo from '../../package.json';

export const environment = {
  VERSION: packageInfo.version + "-dev",
  production: false,
  ravenFhirServer: "https://apps.hdap.gatech.edu/raven-fhir-server-dev/fhir/",
  ravenFhirServerBasicAuth: "client:secret",
  ravenImportApi: "https://apps.hdap.gatech.edu/raven-import-api-dev/upload-xlsx-file"
};

export const blueJay = {
  serverBase: "https://apps.hdap.gatech.edu/bluejay-fhir-server/fhir",
  serverBasicAuth: "client:secret",
  displayName: "BlueJay",
}

export const caseComparison = {
  testCases: [
    {"compositionId": "9038be4e-6fcd-494a-824d-99bfd1362495", "display": "Alice Freeman"}
  ]


}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
