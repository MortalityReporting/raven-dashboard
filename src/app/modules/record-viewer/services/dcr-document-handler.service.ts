import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Address, BundleHelperService, FhirClientService, FhirHelperService,} from "../../fhir-util";
import {map} from "rxjs/operators";
import {FHIRProfileConstants} from "../../../providers/fhir-profile-constants";
import {TrackingNumberType} from "../../fhir-mdi-library";
import {
  CaseAdminInfo,
  CremationClearanceInfo,
  DcrGridDTO,
  DcrHeader,
  DeathInvestigation,
  FuneralHome,
  PlaceOfDeath
} from "../models/dcr-record";
import {ToxToMdiMessageHandlerService} from "./tox-to-mdi-message-handler.service";
import {MdiToEdrsDocumentHandlerService} from "./mdi-to-edrs-document-handler.service";
import {PatientNameReturn} from "../../fhir-util/services/fhir-helper.service";


@Injectable({
  providedIn: 'root'
})
export class DcrDocumentHandlerService {

  constructor(
    private fhirClient: FhirClientService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService,
    private toxToMdiMessageHandlerService: ToxToMdiMessageHandlerService,
    private mdiToEdrsDocumentHandlerService: MdiToEdrsDocumentHandlerService,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) { }
  public defaultString: string = "VALUE NOT FOUND";

  getRecords(): Observable<DcrGridDTO[]> {
    //TODO we need to refactor all this code once we can access the records from the dcr grid. Presently we are fetching the data directly (via hardcoded url)
    return this.fhirClient.read('Composition', '$dcr-message').pipe(
      map((record: any) => {
        const result = record.entry.map(documentBundle => {
          const documentBundleList = documentBundle.resource.entry?.[1]?.resource;
          const dcrGridDTO: DcrGridDTO = this.constructDcrGridDto(documentBundleList);
          return dcrGridDTO;
        });
        return result;
      })
    )
  }

  getById(id: string): Observable<any> {
    return this.fhirClient.read(`Composition/${id}`, '$dcr-message').pipe(
      map((record: any) => {
        const documentBundleList = record.entry[1].resource;
        const dcrHeader = this.constructHeader(documentBundleList);

        const patientResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePatient);
        const demographics = this.mdiToEdrsDocumentHandlerService.generateDemographics(patientResource);
        const deathInvestigation = this.generateDeathInvestigation(documentBundleList);
        const placeOfDeath = this.generatePlaceOfDeath(documentBundleList);
        const cremationClearanceInfo = this.generateCremationClearanceInfo(documentBundleList);
        const caseAdminInfo = this.generateCaseAdminInfo(documentBundleList);
        const dcrSummary = {
          caseAdminInfo: caseAdminInfo,
          dcrHeader: dcrHeader,
          demographics: demographics,
          deathInvestigation: deathInvestigation,
          cremationClearanceInfo: cremationClearanceInfo,
          placeOfDeath: placeOfDeath
        };
        const dcrGridDTO: DcrGridDTO = this.constructDcrGridDto(documentBundleList);
        const result = {dcrRecord: record, dcrSummary: dcrSummary, dcrGridDTO: dcrGridDTO};
        return result;
      })
    )
  }

  private constructHeader(documentBundleList: any): DcrHeader {
    const patientResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePatient);

    const fullName: string = this.fhirHelper.getOfficialName(patientResource);

    const composition = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.DCR.Dcr_composition);
    const trackingNumber = this.toxToMdiMessageHandlerService.getTrackingNumber(composition, TrackingNumberType.Dcr);
    const dcrCaseNumber = trackingNumber?.value
    const dcrCaseSystem: string = trackingNumber?.system;

    const deathDateResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Obs_DeathDate);
    const deathDate = deathDateResource?.valueDateTime || this.defaultString;

    const header: DcrHeader = {
      fullName: fullName,
      reportDate: deathDate,
      dcrCaseNumber: dcrCaseNumber,
      dcrCaseSystem: dcrCaseSystem
    }
    return header;
  }

  private generateDeathInvestigation(documentBundleList: any) : DeathInvestigation{
    const deathDateResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Obs_DeathDate);
    if(!deathDateResource){
      return null;
    }
    const component = deathDateResource.component.find(component => component.code.coding.find(coding => coding.code === "58332-8"));
    const type =  component.valueCodeableConcept.text || component?.valueCodeableConcept?.coding?.[0]?.display;
    const placeOfDeath = this.generatePlaceOfDeath(documentBundleList);
    const result = {dateTimeOfDeath: deathDateResource?.valueDateTime || this.defaultString, resource: deathDateResource , placeOfDeath:placeOfDeath, type: type };
    return result;
  }

  private generatePlaceOfDeath(documentBundleList: any): PlaceOfDeath{
    const deathLocationResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Loc_DeathLocation);

    const type = "Not Implemented";
    const address: Address = new Address(deathLocationResource);
    const facility = "Not Implemented";
    const facilityName = deathLocationResource?.name;
    return {type: type, address: address, facility: facility, facilityName: facilityName, resource: deathLocationResource};
  }

  private generateCremationClearanceInfo(documentBundleList: any): CremationClearanceInfo {
    let organizationResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Org_Funeral_Home);
    if(!organizationResource) {
      return null;
    }
    const address = new Address(organizationResource);
    const funeralHome: FuneralHome = {address: address, name: organizationResource.name};
    return {resource: organizationResource, funeralHome: funeralHome};
  }

  private generateCaseAdminInfo(documentBundleList: any): CaseAdminInfo | null{
    let practitionerResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.DCR.Dcr_core_practitioner)
      || this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePractitioner);

    if(!practitionerResource){
      return null;
    }
    const name  = this.fhirHelper.getOfficialName(practitionerResource);
    return {name: name, signature: this.imageData, resource: practitionerResource};
  }

  private imageData = "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"

  private constructDcrGridDto(documentBundleList: any): DcrGridDTO  {

    const patientResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePatient);
    const firstName = this.fhirHelper.getOfficialName(patientResource, PatientNameReturn.firstonly);
    const lastName = this.fhirHelper.getOfficialName(patientResource, PatientNameReturn.lastonly);

    const trackingNumber = this.fhirHelper.getTrackingNumber(documentBundleList.resource);

    const gender = patientResource.gender;

    const deathDateObsResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Obs_DeathDate);
    const deathDate = deathDateObsResource?.valueDateTime;
    const compositionResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.DCR.Dcr_composition);
    const recordId = compositionResource.id;


    return {firstName: firstName, lastName: lastName, mdiCaseNumber: trackingNumber, deathDate: deathDate, gender: gender, recordId: recordId};
  }

}
