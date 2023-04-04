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

  search(parameters: string, flat: boolean = false, baseUrl=true): Observable<any> {
    // When baseUrl = true (default) prepend the URL. Otherwise, assume a full URL is passed and take it as is.
    let searchString = "";
    let searchResult = undefined;
    if (baseUrl) searchString = this.serverBaseUrl;
    searchString += parameters;

    return this.http.get(searchString).pipe(
      expand( (searchBundle: any, i) =>{
          if (searchResult === undefined) searchResult = searchBundle;
          else {
            searchBundle.entry.map(entry => searchResult.entry.push(entry));
          }
          console.log(searchResult);
          return searchBundle?.link?.find(link => link?.relation === "next") ?
          this.search(searchBundle?.link?.find(link => link?.relation === "next")?.url, false, false).pipe(delay(1000)) :
          searchResult
      }
      ),
      takeWhile((searchBundle:any) => searchBundle?.link?.find(link => link?.relation === "next"), true),
      //reduce((acc, current) => acc.concat(current), []),
    );


    // return this.http.get(searchString).pipe(
    //   expand( (searchBundle: any, i) => {
    //     console.log("START OF RECURSIVE LOOP");
    //     console.log(returnedData);
    //       if (searchBundle?.entry) {
    //         console.log("first if");
    //         searchBundle?.entry.map(entry => returnedData.push(entry))
    //         returnedData = returnedData.concat(searchBundle?.entry);
    //         console.log(returnedData);
    //       }
    //       if (searchBundle?.link?.find(link => link?.relation === "next")) {
    //         console.log("second if");
    //         return this.search(searchBundle?.link?.find(link => link?.relation === "next")?.url, false, false)
    //       }
    //       else return of(returnedData)
    //     }
    //     // searchBundle?.link?.find(link => link?.relation === "next") ?
    //     // this.search(searchBundle?.link?.find(link => link?.relation === "next")?.url, false, false) :
    //     //   EMPTY
    //   ),
    //   takeWhile((searchBundle:any) => searchBundle?.link?.find(link => link?.relation === "next"), true),
    //   map(data => console.log(data))
    //   //reduce((acc, current) => acc.concat(current), []),
    // );
  }
}
// First Page = bundle
// bundle.entry // first page of results
// fetch page 2 (bundle 2)
// bundle.entry.concat(bundle2.entry)
