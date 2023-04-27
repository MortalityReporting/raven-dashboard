import {Injectable} from '@angular/core';
import {EnvironmentHandlerService} from "./environment-handler.service";
import {HttpClient} from "@angular/common/http";
import {EMPTY, expand, map, mergeMap, Observable, of, reduce, takeWhile} from "rxjs";
import {FhirResource} from "../models/base/fhir.resource";
import {Bundle, BundleEntryComponent, BundleType} from "../models/resources/bundle";

@Injectable({
  providedIn: 'root'
})
export class FhirClientService {

  private readonly serverBaseUrl: string;

  constructor(private http: HttpClient,
              private environmentHandler: EnvironmentHandlerService) {
    this.serverBaseUrl = this.environmentHandler.getFhirServerBaseURL();
  }

  read(resourceType: string, id: string, parameters?: string): Observable<FhirResource> {
    // TODO: Add parameter parsing. For now, parameters required in complete http string form.
    let requestString = this.serverBaseUrl + resourceType + "/" + id;
    if (parameters) requestString += parameters;
    console.log("Making Read Request: " + requestString);
    return this.http.get(requestString).pipe(
      map((response: any) =>
        {
          //console.log(response)
          return response;
        }
      )
    );
  }

  search(resourceType: string = "", parameters: string | FhirResource = "", flat: boolean = false, baseUrl: boolean = true, fullUrl?: string): Observable<Bundle | FhirResource[]> {
    let searchString: string = "";
    let pagination$: Observable<Bundle>;

    if (typeof parameters === 'string' || parameters instanceof String) {
      searchString = fullUrl ? fullUrl : this.createSearchRequestUrl(resourceType, parameters as string, baseUrl)
      pagination$ = this.http.get<Bundle>(searchString);
    }
    else {
      searchString = fullUrl ? fullUrl : this.createSearchRequestUrl(resourceType, "", baseUrl)
      pagination$ = this.http.post<Bundle>(searchString, parameters);
    }
    console.log("Making Search Request: " + searchString);

    pagination$.pipe(
      // TODO: Is there a way to type the following operator projections?
      expand( (searchBundle: any, i) => {
          return searchBundle?.link?.find(link => link?.relation === "next") ?
            this.search(
              undefined, undefined,flat = false, false,
              searchBundle?.link?.find(link => link?.relation === "next")?.url
            ) : EMPTY;
        }
      ),
      takeWhile((searchBundle:any) => searchBundle?.link?.find(link => link?.relation === "next"), true),
      reduce((acc, current) => acc.concat(current), []),
    ).pipe(
      mergeMap((searchSetList: Bundle[]) => {
        let completeBundle: Bundle = {
          resourceType: "Bundle",
          type: BundleType.searchset,
          total: 0,
          entry: []
        };
        searchSetList.map((searchSetBundle: Bundle) => {
          searchSetBundle?.entry?.map(entry => completeBundle.entry.push(entry));
        });
        completeBundle.total = completeBundle.entry.length;
        return of(completeBundle)
      })
    );

    if (flat) {
      return pagination$.pipe(
        map((completeBundle: Bundle) => {
            let resourceList: FhirResource[] = [];
            completeBundle['entry'].map((bundleEntry: BundleEntryComponent) => {
              resourceList.push(bundleEntry.resource)
            });
            return resourceList;
          }
        ))
    }
    else return pagination$;
  }

  // When baseUrl = true (default) prepend the URL. Otherwise, assume a full URL is passed and take it as is.
  private createSearchRequestUrl(resourceType: string, parameters: string, baseUrl: boolean = true): string {
    if (baseUrl) return this.serverBaseUrl + resourceType + parameters;
    else return resourceType + parameters;
  }

}
