export interface FhirServerConfig {
  baseUrl: string;
  basicAuth: string;
}

export interface Auth0Config {
  audience: string;
}

export interface AuthConfig {
  redirectUrl: string;
  logoutUrl: string;
  clientId: string;
  domain: string;
  auth0: Auth0Config;
}

export class Config {
  constructor() {}

  version?: string;
  dashboardApiUrl: string = "";
  ravenImportApiUrl: string = "";
  fhirValidatorUrl: string = "";
  ravenFhirServer: FhirServerConfig = {
    baseUrl: "",
    basicAuth: ""
  };
  blueJayServer: FhirServerConfig = {
    baseUrl: "",
    basicAuth: ""
  };
  auth: AuthConfig = {
    redirectUrl: "",
    logoutUrl: "",
    clientId: "",
    domain: "",
    auth0: {
      audience: ""
    }
  };

  // Optional properties
  logFhirRequests?: boolean;
}
