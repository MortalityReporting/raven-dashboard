export class Config {
  // Constructor used to create a blank config for observable output only.
  constructor() {}

  version: string = "";
  title: string = "";
  ravenFhirServer: string = "";
  ravenFhirServerBasicAuth: string = "";
  ravenImportApi: string = "";
  fhirValidator: string = "";
  blueJayServerBase: string = "";
  adminRedirectUrl: string = "";
  adminLogoutUrl: string = "";

  logFhirRequests?: boolean = true;
}
