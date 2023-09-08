export class Config {
  // Constructor used to create a blank config for observable output only.
  constructor() {}

  version: string = "";
  title: string = "";
  dashboardApiUrl: string = "";
  ravenFhirServerBaseUrl: string = "";
  ravenFhirServerBasicAuth: string = "";
  ravenImportApiUrl: string = "";
  fhirValidatorUrl: string = "";
  blueJayServerBaseUrl: string = "";
  adminRedirectUrl: string = "";
  adminLogoutUrl: string = "";

  logFhirRequests?: boolean = true;
}
