import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Obs_DeathDate, Obs_MannerOfDeath} from "../../../../../model/mdi/profile.list";
import {TrackingNumberType} from "../../../../../model/tracking.number.type";
import {FhirHelperService} from "../../../../../service/fhir/fhir-helper.service";

@Component({
  selector: 'app-edrs-search-results',
  templateUrl: './edrs-search-results.component.html',
  styleUrls: ['./edrs-search-results.component.css']
})
export class EdrsSearchResultsComponent implements OnInit, OnChanges {

  @Input() successResponse: any;
  @Input() errorResponse: any;

  resultTableColumns = ['officialName', 'dateOfDeath', 'mannerOfDeath', 'mdiCaseNumber', 'edrsFileNumber'];
  resultTableDataSource = new MatTableDataSource<any>();

  constructor(private fhirHelperService: FhirHelperService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes['successResponse']?.currentValue){
      this.parseResponseToTable(changes['successResponse']?.currentValue);
    }
    if(!!changes['errorResponse']?.currentValue){
      this.resultTableDataSource.data = [];
    }
  }

  private parseResponseToTable(response: any) {
    const outerEntryList = response.entry;
    let formattedData = [];
    outerEntryList.forEach((bundle, i) => {
      let decedent: any = {};
      decedent.bundleResource = bundle;

      const patientResource = this.getPatientResource(bundle.resource);
      const officialName = this.fhirHelperService.getPatientOfficialName(patientResource);
      decedent.officialName = officialName;

      const mannerOfDeathObservation = this.getObservationByProfile(bundle.resource, Obs_MannerOfDeath);
      const mannerOfDeathStr = this.getMannerOfDeathObservationStr(mannerOfDeathObservation);
      decedent.mannerOfDeath = mannerOfDeathStr;

      const deathDateObservation = this.getObservationByProfile(bundle.resource, Obs_DeathDate);
      decedent.deathDate= deathDateObservation.effectiveDateTime;

      const mdiCaseNumber = this.getTrackingNumber(bundle.resource, TrackingNumberType.Mdi);
      decedent.mdiCaseNumber = mdiCaseNumber;

      const edrsFileNumber = this.getTrackingNumber(bundle.resource, TrackingNumberType.Edrs);
      decedent.edrsFileNumber = edrsFileNumber;

      formattedData.push(decedent);
    })
    console.log(formattedData);
    this.resultTableDataSource.data = formattedData;
  }

  // TODO extract this to mdi service
  private getMannerOfDeathObservationStr(observationResource){
    if(!observationResource.resourceType
      || observationResource.resourceType != 'Observation'){
      console.error("Empty or incorrect function parameter.");
      return null;
    }
    const result = observationResource.valueCodeableConcept?.coding?.[0]?.display;
    return result;
  };

  private getPatientResource(documentBundle) {
    if(!documentBundle
      || !documentBundle.resourceType || documentBundle.resourceType != "Bundle"
      || !documentBundle.type || documentBundle.type != "document"
      || !documentBundle.entry?.length){
      console.error("Empty or incorrect function parameter.");
      return null;
    }
    const result = documentBundle.entry
      .find(entry => entry?.resource?.resourceType === "Patient")
      .resource;
    return result;
  }

  private getObservationByProfile(documentBundle, profileStr) {
    if(!documentBundle
      || !documentBundle.resourceType || documentBundle.resourceType != "Bundle"
      || !documentBundle.type || documentBundle.type != "document"
      || !documentBundle.entry?.length){
      console.error("Empty or incorrect function parameter.");
      return null;
    }
    const result = documentBundle.entry
      .filter(entry => entry?.resource?.resourceType === "Observation")
      .find(entry => entry?.resource?.meta?.profile?.[0] === profileStr)
      .resource;

    return result;
  }

  //TODO this code simply does not work and needs to be refactored or extended properly
  getTrackingNumber(resource: any, type: TrackingNumberType = TrackingNumberType.Mdi): string {
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions?.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.value || undefined;
  }

}
