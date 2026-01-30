import {Injectable, signal} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable, skipWhile, tap} from "rxjs";
import {Bundle, FhirClientService, FhirResource} from "../../fhir-util";
import {ConfigService} from "../../../service/config.service";
// import {SortDirection} from "@angular/material/sort-direction.d";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  private readonly serverBaseUrl: string;
  constructor(private fhirClient: FhirClientService, private configService: ConfigService,) {
    this.serverBaseUrl = this.configService?.config?.ravenFhirServerBaseUrl;
  }


  // TODO delete if search result bundle is not used
  private _searchResultsBundleId = signal<string | null>(null);
  public readonly searchResultsId = this._searchResultsBundleId.asReadonly();
  public setSearchResultsBundleId(id: string | null) {
    this. _searchResultsBundleId.set(id);
  }


  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.id)
      .set('code', codeList.toString())

    return this.fhirClient.search("Observation", "", false, true, "", params)
  }

  getDecedentRecords(pageNumber: number, pageSize: number):  Observable<any> {
    let httpRequest = null;
    if(this.searchResultsId()){
      const url = `${this.serverBaseUrl}?_getpages=${this.searchResultsId()}&_getpagesoffset=${pageNumber}&_count=${pageSize}&_pretty=${true}&_bundletype=searchset`;
      httpRequest = this.fhirClient.search('', null, false, false, url);
    }
    else{
      httpRequest = this.fhirClient.search("Patient", `?_count=${pageSize}`, false, true);
    }
    return httpRequest.pipe(
      tap(data => {
        if(!this.searchResultsId()){
          this.getSearchResultsBundleId(data);
        }
      }),
      skipWhile((result: any) => {
        return !result
      })
    );
  }

  getComposition(subjectId: string): Observable<any> {
    return this.fhirClient.search(`Composition`,`?subject=${subjectId}`)
  }

  getDocumentBundle(compositionId: string): Observable<any> {
    return this.fhirClient.read("Composition", compositionId, "/$document")
  }

  // TODO delete if search result bundle returns the correct id and there is no need to extract the Bundle id next link
  private getSearchResultsBundleId(data: Bundle) {
    const url = data.link.find(el=> el.relation == 'next').url
    const match = url.match(/_getpages=([a-f0-9\-]+)/);
    let searchBundleId = '';
    if (match) {
      // Extract the captured value
      searchBundleId = match[1];
      this.setSearchResultsBundleId(searchBundleId);
    } else {
      console.warn("ID not found in the URL.");
    }
  }
}
