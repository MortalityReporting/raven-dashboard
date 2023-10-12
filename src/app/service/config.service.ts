import {Injectable} from '@angular/core';
import {Config} from "../model/config";
import packageInfo from '../../../package.json';
import {HttpBackend, HttpClient, HttpRequest} from "@angular/common/http";
import {map, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  defaultConfigPath: string;
  defaultLocalConfigPath = '../../assets/config/config.json'
  config: Config = new Config();

  packageInfo = packageInfo;

  private http: HttpClient

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
    this.defaultConfigPath = this.getDashboardApiUrl() + "config"
  }

  // TODO: Deprecate.
  getDashboardApiUrl(): string {
    let dashboardApi = environment.dashboardApi;
    if (!dashboardApi.endsWith("/")) {
      dashboardApi = dashboardApi.concat("/");
    }
    return dashboardApi;
  }

  getConfig(): Config {
    return this.config;
  }

  loadConfig() {
    let configPath = this.defaultConfigPath;
    if (environment) {
      if (environment?.overrideConfigLocation?.trim()) {
        configPath = environment?.overrideConfigLocation?.trim() // If override path is given, always use it.
      } else if (environment?.useLocalConfig) {
        configPath = this.defaultLocalConfigPath; // If no override is given but use local is true, use default local.
      }
    }
    return this.http.get<Config>(configPath).pipe(
      map((config: Config) => {
        console.log(config)
        config.version = "v" + this.packageInfo.version;
        config.dashboardApiUrl = this.getDashboardApiUrl();
        config.ravenFhirServerBaseUrl = this.standardizeUrl(config.ravenFhirServerBaseUrl);
        config.ravenImportApiUrl = this.standardizeUrl(config.ravenImportApiUrl);
        config.blueJayServerBaseUrl = this.standardizeUrl(config.blueJayServerBaseUrl);
        config.fhirValidatorUrl = this.standardizeUrl(config.fhirValidatorUrl);
        this.config = config;
        return true;
      }),
      catchError(error => {
        console.error(error);
        this.config = new Config();
        return of(false);
      })
    )
  }
  standardizeUrl(url: string): string {
    if (!url.endsWith("/")) {
      url = url.concat("/");
    }
    return url;
  }
}
