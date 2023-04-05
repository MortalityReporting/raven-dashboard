import { Injectable } from '@angular/core';
import {EnvironmentHandlerService} from "./environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {expand, Observable, take} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FhirClientService {

  private readonly serverBaseUrl: string;

  constructor(
    private http: HttpClient,
    private environmentHandler: EnvironmentHandlerService) {
    this.serverBaseUrl = this.environmentHandler.getFhirServerBaseURL();
  }

  read() {
  }

  search(parameters: string, flat: boolean = false): Observable<any> {
    return this.http.get(this.serverBaseUrl + parameters).pipe(
      map((searchBundle: any) => {
        console.log(searchBundle);
        return searchBundle
      }),
      // TODO: Bundle Paging
      expand( (searchBundle: any, i) => this.search(`${i}`)),
      take(5)
    );
  }

}
