import { Injectable } from '@angular/core';
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

  defaultConfigPath: string = "https://raven.heat.icl.gtri.org/raven-dashboard-api/config"
  defaultLocalConfigPath = '../../assets/config/config.json'
  config: Config = new Config();
  packageInfo = packageInfo;
  private http: HttpClient

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  loadConfig() {
    let useLocalConfig = false;
    let configPath = this.defaultConfigPath;
    if (environment) {
      if (environment?.useLocalConfig) {
        useLocalConfig = true;
      }
      if (environment?.overrideConfigLocation?.trim()) {
        configPath = environment?.overrideConfigLocation?.trim()
      }
      else if (useLocalConfig) {
        configPath = this.defaultLocalConfigPath;
      }
    }
    return this.http.get<Config>(configPath).pipe(
      map(config => {
        config.version = "v" + this.packageInfo.version;
        this.config = config;
        return true;
      }),
      catchError(error => {
        console.error(error);
        this.config = new Config();
        return of(false);
      })
    )
  }}
