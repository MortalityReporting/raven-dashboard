import {Injectable, isDevMode} from '@angular/core';
import packageInfo from '../../../package.json';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {Config} from "./config";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  defaultConfigPath = 'assets/config/config.json';
  localConfigPath = 'assets/config/local-config.json';
  config: Config | undefined;

  private http: HttpClient
  packageInfo = packageInfo;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  loadConfig() {
    // If config was already loaded, return it immediately
    if (this.config && this.config.version) {
      return of(true);
    }

    let configPath = this.defaultConfigPath;
    if(isDevMode()){
      configPath = this.localConfigPath;
    }

    return this.http.get<Config>(configPath).pipe(
      map(config => {
        config.version = "v" + this.packageInfo.version;
        this.config = config;
        console.log(this.config);
        return true;
      }),
      catchError(error => {
        console.error("No configuration file found. If in dev mode please verify the existence of local-config.json file")
        this.config = new Config();
        return of(false);
      })
    )
  }

  /**
   * Get a normalized API URL from the configuration.
   * Ensures the URL ends with a trailing slash for proper endpoint concatenation.
   *
   * @param configKey - The configuration key to retrieve the URL from
   * @returns The normalized URL with a trailing slash
   */
  getApiUrl(configKey: 'dashboardApiUrl' | 'ravenImportApiUrl' | 'fhirValidatorUrl' | 'ravenFhirServer' | 'blueJayServer'): string {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }

    let apiUrl: string;

    // Handle direct string properties
    if (configKey === 'dashboardApiUrl' || configKey === 'ravenImportApiUrl' || configKey === 'fhirValidatorUrl') {
      apiUrl = this.config[configKey];
    }
    // Handle nested server objects
    else {
      apiUrl = this.config[configKey].baseUrl;
    }

    // Ensure URL ends with /
    if (!apiUrl.endsWith("/")) {
      apiUrl = apiUrl.concat("/");
    }

    return apiUrl;
  }
}
