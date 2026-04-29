import { Injectable } from '@angular/core';
import {ConfigService} from './config.service';
import {Config} from "./config";



@Injectable({
  providedIn: 'root'
})
export class EnvironmentHandlerService {
  config: Config;

  constructor(private configService: ConfigService) {
     this.config = this.configService.config;
  }

  getApiUrl(configKey: 'dashboardApiUrl' | 'ravenImportApiUrl' | 'fhirValidatorUrl' | 'ravenFhirServer' | 'blueJayServer'): string {
    const config = this.configService.config;

    let apiUrl: string;

    // Handle direct string properties
    if (configKey === 'dashboardApiUrl' || configKey === 'ravenImportApiUrl' || configKey === 'fhirValidatorUrl') {
      apiUrl = config[configKey];
    }
    // Handle nested server objects
    else {
      apiUrl = config[configKey].baseUrl;
    }

    // Ensure URL ends with /
    if (!apiUrl.endsWith("/")) {
      apiUrl = apiUrl.concat("/");
    }

    return apiUrl;
  }

}
