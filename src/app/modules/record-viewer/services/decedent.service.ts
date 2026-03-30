import {Injectable, signal} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {catchError, forkJoin, map, mergeMap, Observable, of, skipWhile, tap} from "rxjs";
import {BundleHelperService, FhirClientService, FhirHelperService, FhirResource} from "../../fhir-util";
import {ConfigService} from "../../../service/config.service";
import {GridSearchParams} from "../models/grid-search-params";
import {DecedentGridDTO} from "../../../model/decedent.grid.dto";
import {CombinedPatientObservationsComposition} from "../models/combined-patient-observations-composition";
import {CompositionPatientPair} from "../models/composition-patient-pair";
import {TrackingNumberType} from "../../fhir-mdi-library";
import {PatientNameReturn} from "../../fhir-util/services/fhir-helper.service";

export interface DecedentRecordsResult {
  dtos: DecedentGridDTO[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DecedentService {

  private readonly serverBaseUrl: string;

  private readonly MDI_EDRS_RECORDS_TYPE = "http://loinc.org|86807-5";

  constructor(private fhirClient: FhirClientService, private configService: ConfigService, private bundleHelperService: BundleHelperService, private fhirHelperService: FhirHelperService) {
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

  getDecedentRecords(pageNumber: number, pageSize: number, searchParams?: GridSearchParams): Observable<any> {
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

  private createPaginationRequest(pageNumber: number, pageSize: number, searchParams?: GridSearchParams): Observable<any> {
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

  private createInitialSearchRequest(pageSize: number, searchParams?: GridSearchParams): Observable<any> {
    let params = new HttpParams()
      .set('_include', 'Composition:subject')
      .set('_count', pageSize.toString())
      .set('type', this.MDI_EDRS_RECORDS_TYPE);

    params = this.addSearchFilters(params, searchParams);

    return this.fhirClient.search("Composition", `?${params.toString()}`, false, true);
  }

  private addSearchFilters(params: HttpParams, searchParams?: GridSearchParams): HttpParams {
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

    if (searchParams.name) {
      params = params.append('patient.name', searchParams.name);
    }

    if (searchParams.nameStatus === 'hasName') {
      params = params.append('patient.name:missing', false);
    } else if (searchParams.nameStatus === 'missingName') {
      params = params.append('patient.name:missing', true);
    }

    if (searchParams.mannerOfDeath) {
      params = params.append('manner-of-death', `http://snomed.info/sct|${searchParams.mannerOfDeath}`);
    }

    return params;
  }

  /**
   * Main method to fetch decedent records and return DTOs with total count
   */
  getDecedentRecordsAsGridDTOs(
    pageNumber: number,
    pageSize: number,
    searchParams?: GridSearchParams
  ): Observable<DecedentRecordsResult> {
    const httpRequest = this.searchResultsId()
      ? this.createPaginationRequest(pageNumber, pageSize, searchParams)
      : this.createInitialSearchRequest(pageSize, searchParams);

    return httpRequest.pipe(
      tap(data => {
        if (!this.searchResultsId()) {
          this.setSearchResultsBundleId(data.id);
        }
      }),
      skipWhile(result => !result),
      mergeMap(bundle => this.processDecedentRecordsBundle(bundle))
    );
  }

  private processDecedentRecordsBundle(bundle: any): Observable<DecedentRecordsResult> {
    const totalCount = bundle.total || 0;

    if(!bundle.entry || bundle.entry.length === 0) {
      return of({ dtos: [], totalCount });
    }

    const allResources = this.bundleHelperService.flattenBundle(bundle);

    const compositions = allResources.filter(r => r.resourceType === 'Composition');
    const patients = allResources.filter(r => r.resourceType === 'Patient');
    const patientMap = this.createResourceMap(patients);

    const pairs: CompositionPatientPair[] = compositions.map(composition => ({
      composition,
      patient: this.getPatientFromReference(composition?.['subject']?.reference, patientMap)
    }));

    if (pairs.length === 0) {
      return of({ dtos: [], totalCount });
    }

    const combinedObservationRequests = pairs.map(pair =>
      this.fetchAndCombineObservations(pair)
    );

    return forkJoin(combinedObservationRequests).pipe(
      map((combinedData: CombinedPatientObservationsComposition[]) => {
        const dtos = combinedData
          .map((combined, index) => this.toGridDTO(combined, index + 1))
          .filter(dto => !!dto.caseNumber);

        return { dtos, totalCount };
      })
    );
  }

  private getPatientFromReference(
    reference: string | undefined,
    patientMap: Map<string, FhirResource>
  ): FhirResource | null {
    if (!reference) return null;

    // Extract ID from reference like "Patient/208897Decedent"
    const parts = reference.split('/');
    if (parts.length < 2) return null;

    const id = parts[1];
    const patient = patientMap.get(id);

    return patient as FhirResource || null;
  }
  toGridDTO(
    combined: CombinedPatientObservationsComposition,
    index: number
  ): DecedentGridDTO {
    const dto = new DecedentGridDTO();
    const {composition, patient, todObservation, mannerOfDeathObservation} = combined;

    // Index
    dto.index = index;

    // Patient data
    if (patient) {
      dto.decedentId = patient?.id;
      dto.name = this.fhirHelperService.getOfficialName(patient);
      dto.gender = patient?.['gender'] ?? null;
      dto.patientResource = patient;
    }

    // Composition data
    if (composition) {
      dto.system = this.fhirHelperService.getTrackingNumberSystem(composition, TrackingNumberType.Mdi);
      dto.status = composition?.['status'] ?? null;
      dto.caseNumber = composition?.['extension']?.[0]?.valueIdentifier?.value;
    }

    // Time of Death from observation
    dto.tod = todObservation?.['valueDateTime'];

    // Manner of Death from observation
    dto.mannerOfDeath = mannerOfDeathObservation?.['valueCodeableConcept']?.coding?.[0]?.display;

    return dto;
  }

  private extractFirstName(patient: any): string | null {
    if (!patient?.name || patient.name.length === 0) return null;

    const firstNameStr = this.fhirHelperService.getOfficialName(patient, PatientNameReturn.firstonly);
    if(firstNameStr) return firstNameStr;


    // Check for masked data
    const name = patient.name[0];
    const maskedExtension = name?.extension?.find(
      (ext: any) =>
        ext.url === 'http://hl7.org/fhir/StructureDefinition/data-absent-reason' &&
        ext.valueCode === 'masked'
    );

    if (maskedExtension) return 'MASKED';

    return null;
  }

  private extractLastName(patient: any): string | null {
    if (!patient?.name || patient.name.length === 0) return null;

    const lastNameStr = this.fhirHelperService.getOfficialName(patient, PatientNameReturn.lastonly);
    if(lastNameStr) return lastNameStr;

    const name = patient.name[0];

    // Check for masked data
    const maskedExtension = name?.extension?.find(
      (ext: any) =>
        ext.url === 'http://hl7.org/fhir/StructureDefinition/data-absent-reason' &&
        ext.valueCode === 'masked'
    );

    if (maskedExtension) return 'MASKED';

    return name?.family ?? null;
  }

  private createResourceMap(resources: any[]): Map<string, any> {
    const map = new Map<string, any>();

    resources.forEach(resource => {
      if (resource.id) {
        // Store by ID only
        map.set(resource.id, resource);
        // Store by full reference (ResourceType/ID)
        map.set(`${resource.resourceType}/${resource.id}`, resource);
      }
    });

    return map;
  }

  private fetchAndCombineObservations(
    pair: CompositionPatientPair
  ): Observable<CombinedPatientObservationsComposition> {

    if (!pair.patient) {
      // Return combined object with nulls if no patient
      return of({
        composition: pair.composition,
        patient: null,
        todObservation: null,
        mannerOfDeathObservation: null
      });
    }

    const loincCauseOfDeath = '69449-7'; // Manner of death
    const loincTimeOfDeath = '81956-5';  // Time of death
    const codes = [loincCauseOfDeath, loincTimeOfDeath];

    return this.getDecedentObservationsByCode(pair.patient, codes).pipe(
      map(observationBundle => {
        const observations = this.bundleHelperService.flattenBundle(observationBundle);

        // Extract specific observations
        const todObservation = this.findObservationByCode(observations, loincTimeOfDeath);
        const mannerOfDeathObservation = this.findObservationByCode(observations, loincCauseOfDeath);

        const combined: CombinedPatientObservationsComposition = {
          composition: pair.composition,
          patient: pair.patient,
          todObservation,
          mannerOfDeathObservation
        };

        return combined;
      }),
      catchError(error => {
        console.error(`Error fetching observations for patient ${pair.patient?.id}:`, error);

        // Return combined object with null observations on error
        return of({
          composition: pair.composition,
          patient: pair.patient,
          todObservation: null,
          mannerOfDeathObservation: null
        });
      })
    );
  }

  private findObservationByCode(
    observations: FhirResource[],
    loincCode: string
  ): FhirResource | null {

    const observation = observations.find(obs => {
      const coding = obs?.['code']?.coding;
      if (!coding || !Array.isArray(coding)) return false;

      return coding.some(c => c.code === loincCode);
    });

    return observation || null;
  }

}
