import { Injectable } from '@angular/core';
import {EnvironmentHandlerService} from "./environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {
  concatMap,
  delay,
  EMPTY,
  expand,
  forkJoin,
  from,
  mergeMap,
  Observable, of,
  reduce, skipWhile, switchMap,
  take,
  takeWhile,
  toArray
} from "rxjs";
import {filter, map} from "rxjs/operators";

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

  search(parameters: string, flat: boolean = false, baseUrl=true): Observable<any> {
    // When baseUrl = true (default) prepend the URL. Otherwise, assume a full URL is passed and take it as is.
    let searchString = "";
    if (baseUrl) searchString = this.serverBaseUrl;
    searchString += parameters;

    const pagination$ = this.http.get(searchString).pipe(
        expand( (searchBundle: any, i) => {
            return searchBundle?.link?.find(link => link?.relation === "next") ?
              this.search(searchBundle?.link?.find(link => link?.relation === "next")?.url, false, false) : EMPTY;
          }
        ),
        takeWhile((searchBundle:any) => searchBundle?.link?.find(link => link?.relation === "next"), true),
        reduce((acc, current) => acc.concat(current), []),
      ).pipe(
        mergeMap((searchSetList: any[]) => {
          let completeBundle = {
            resourceType: "Bundle",
            type: "searchset",
            total: 0,
            entry: []
          };
          searchSetList.map(searchSetBundle => {
            searchSetBundle.entry.map(entry => completeBundle.entry.push(entry));
          });
          completeBundle.total = completeBundle.entry.length;
          return of(completeBundle)
        })
      );

    if (flat) {
      return pagination$.pipe(
        map((completeBundle: any) => {
          let resourceList = [];
          completeBundle.entry.map((bundleEntry: any) => {
            resourceList.push(bundleEntry.resource)
          });
          return resourceList;
        }
      ))
    }
    else return pagination$;
  }
}
