import {Injectable, signal} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable, skipWhile, tap} from "rxjs";
import {FhirClientService} from "../../fhir-util";
import {ConfigService} from "../../../service/config.service";
import {SearchParams} from "../components/search-records/decedent-records-grid/decedent-records-grid.component";

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  private readonly serverBaseUrl: string;

  private readonly MDI_EDRS_RECORDS_TYPE = "http://loinc.org|86807-5";

  constructor(private fhirClient: FhirClientService, private configService: ConfigService,) {
    this.serverBaseUrl = this.configService?.config?.ravenFhirServerBaseUrl;
  }

  // TODO delete if search result bundle is not used
  private _searchResultsBundleId = signal<string | null>(null);
  public readonly searchResultsId = this._searchResultsBundleId.asReadonly();
  public setSearchResultsBundleId(id: string | null) {
    this. _searchResultsBundleId.set(id);
  }

  getComposition(subjectId: string): Observable<any> {
    return this.fhirClient.search(`Composition`,`?subject=${subjectId}`)
  }

  getDocumentBundle(compositionId: string): Observable<any> {
    return this.fhirClient.read("Composition", compositionId, "/$document")
  }

  getDecedentObservationsByCode(decedent: any, codeList: string[]):  Observable<any> {
    // Headers are added in the FHIR Auth Interceptor
    let params = new HttpParams()
      .set('patient', decedent.id)
      .set('code', codeList.toString())

    return this.fhirClient.search("Observation", "", false, true, "", params)
  }

  getDecedentRecords(pageNumber: number, pageSize: number, searchParams?: SearchParams): Observable<any> {
    const httpRequest = this.searchResultsId()
      ? this.createPaginationRequest(pageNumber, pageSize, searchParams)
      : this.createInitialSearchRequest(pageSize, searchParams);

    return httpRequest.pipe(
      tap(data => {
        if (!this.searchResultsId()) {
          this.setSearchResultsBundleId(data.id);
        }
      }),
      skipWhile(result => !result)
    );
  }

  private createPaginationRequest(pageNumber: number, pageSize: number, searchParams?: SearchParams): Observable<any> {
    const pageOffset = pageNumber * pageSize;

    let params = new HttpParams()
      .set('_getpages', this.searchResultsId())
      .set('_getpagesoffset', pageOffset.toString())
      .set('_count', pageSize.toString())
      .set('type', this.MDI_EDRS_RECORDS_TYPE)
      .set('_pretty', 'true')
      .set('_bundletype', 'searchset');

    params = this.addSearchFilters(params, searchParams);

    const url = `${this.serverBaseUrl}?${params.toString()}`;
    return this.fhirClient.search('', null, false, false, url);
  }

  private createInitialSearchRequest(pageSize: number, searchParams?: SearchParams): Observable<any> {
    let params = new HttpParams()
      .set('_include', 'Composition:subject')
      .set('_count', pageSize.toString())
      .set('type', this.MDI_EDRS_RECORDS_TYPE);

    params = this.addSearchFilters(params, searchParams);

    return this.fhirClient.search("Composition", `?${params.toString()}`, false, true);
  }

  private addSearchFilters(params: HttpParams, searchParams?: SearchParams): HttpParams {
    if (!searchParams) return params;

    if (searchParams.deathDate?.start) {
      params = params.append('death-date', `ge${searchParams.deathDate.start}`);
    }

    if (searchParams.deathDate?.end) {
      params = params.append('death-date', `le${searchParams.deathDate.end}`);
    }

    if (searchParams.gender) {
      params = params.append('patient.gender', searchParams.gender);
    }

    return params;
  }



}
