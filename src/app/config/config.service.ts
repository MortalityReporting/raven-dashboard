import {Injectable, isDevMode} from '@angular/core';
import {Config} from './config';
import packageInfo from '../../../package.json';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {catchError} from "rxjs/operators";

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
}
