import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {
  Address,
  BundleHelperService,
  FhirClientService,
  FhirHelperService,
} from "../../fhir-util";
import {map} from "rxjs/operators";
import {FHIRProfileConstants} from "../../../providers/fhir-profile-constants";
import {TrackingNumberType} from "../../fhir-mdi-library";
import {
  DcrHeader,
  DeathInvestigation,
  PlaceOfDeath,
  CremationClearanceInfo,
  FuneralHome, CaseAdminInfo
} from "../models/dcr-record";
import {ToxToMdiMessageHandlerService} from "./tox-to-mdi-message-handler.service";
import {MdiToEdrsDocumentHandlerService} from "./mdi-to-edrs-document-handler.service";


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

  getRecord(recordId: string): Observable<any> {
    //TODO we need to refactor all this code once we can access the records from the dcr grid. Presently we are fetching the data directly (via hardcoded url)
    return this.fhirClient.search("Composition/$dcr-message").pipe(
      map((record: any)=> {
        const documentBundleList = record.entry?.[0]?.resource?.entry[1]?.resource;
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
        return {dcrRecord: record, dcrSummary: dcrSummary};
      })
    )
  }

  private constructHeader(documentBundleList: any): DcrHeader {
    const patientResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePatient);

    const fullName: string = this.fhirHelper.getOfficialName(patientResource);

    const composition = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.DCR.Drc_composition);
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
    const result = {dateTimeOfDeath: deathDateResource?.valueDateTime || this.defaultString, resource: deathDateResource};
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
    const practitionerResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePractitioner);
    if(!practitionerResource){
      return null;
    }
    const name  = this.fhirHelper.getOfficialName(practitionerResource);
    return {name: name, resource: practitionerResource};
  }
}
