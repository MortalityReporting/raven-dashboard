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
  DcrHeader, DcrSummary,
  DeathInvestigation,
  FuneralHome,
  PlaceOfDeath, SignatureBlock, SignedBy
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
        const signatureBlock = this.generateSignatureBlock(documentBundleList);

        const dcrSummary: DcrSummary = {
          caseAdminInfo: caseAdminInfo,
          dcrHeader: dcrHeader,
          demographics: demographics,
          deathInvestigation: deathInvestigation,
          cremationClearanceInfo: cremationClearanceInfo,
          placeOfDeath: placeOfDeath,
          signatureBlock: signatureBlock,
        };
        const dcrGridDTO: DcrGridDTO = this.constructDcrGridDto(documentBundleList);
        const result = {resource: record, dcrSummary: dcrSummary, dcrGridDTO: dcrGridDTO};
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
    const email = practitionerResource.telecom.find(el=> el.system == 'email').value;
    return {name: name, resource: practitionerResource, email: email};
  }

  private constructDcrGridDto(documentBundleList: any): DcrGridDTO  {

    const patientResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.USCore.USCorePatient);
    const firstName = this.fhirHelper.getOfficialName(patientResource, PatientNameReturn.firstonly);
    const lastName = this.fhirHelper.getOfficialName(patientResource, PatientNameReturn.lastonly);

    const gender = patientResource.gender;

    const deathDateObsResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Obs_DeathDate);
    const deathDate = deathDateObsResource?.valueDateTime;
    const compositionResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.DCR.Dcr_composition);
    const recordId = compositionResource.id;

    let organizationResource = this.bundleHelper.findResourceByProfileName(documentBundleList, this.fhirProfiles.VRDR.Org_Funeral_Home);
    const funeralHomeName = organizationResource.name

    return {firstName: firstName, lastName: lastName, deathDate: deathDate, gender: gender, recordId: recordId, funeralHomeName: funeralHomeName};
  }

  private generateSignatureBlock(documentBundleList: any): SignatureBlock | null {
    if (!documentBundleList?.signature) {
      return null;
    }
    const signatureData = documentBundleList.signature
    const fileFormat = signatureData.targetFormat;
    const dateTime = signatureData.when;
    const signatureStr = signatureData.data;
    const signedByPractitionerResource = this.bundleHelper.findResourceByFullUrl(documentBundleList, signatureData?.who?.reference);
    const signedByName = this.fhirHelper.getOfficialName(signedByPractitionerResource, PatientNameReturn.fullname);
    const signedBy: SignedBy = {resource: signedByPractitionerResource, name: signedByName};
    return {resource: documentBundleList, signatureStr: signatureStr, dateTime: dateTime, fileFormat: fileFormat, signedBy: signedBy};
  }
}
