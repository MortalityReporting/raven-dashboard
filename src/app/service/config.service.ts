import { Injectable } from '@angular/core';
import {Config} from "../model/config";
import packageInfo from '../../../package.json';
import {HttpBackend, HttpClient} from "@angular/common/http";
import {map, of} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Config = new Config();
  packageInfo = packageInfo;
  private http: HttpClient

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  loadConfig() {
    return this.http.get<Config>('../../assets/config/config.json').pipe(
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
