import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Obs_DeathDate, Obs_MannerOfDeath} from "../../../../../model/mdi/profile.list";
import {TrackingNumberType} from "../../../../../model/tracking.number.type";
import {FhirHelperService, PatientNameReturn} from "../../../../../service/fhir/fhir-helper.service";
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-edrs-search-results',
  templateUrl: './edrs-search-results.component.html',
  styleUrls: ['./edrs-search-results.component.css']
})
export class EdrsSearchResultsComponent implements OnInit, OnChanges {

  @Input() successResponse: any;
  @Input() errorResponse: any;

  @ViewChild(MatTabGroup) resultsTabGroup: MatTabGroup;

  resultTableColumns = ['officialName', 'dateOfDeath', 'mannerOfDeath', 'mdiCaseNumber', 'edrsFileNumber'];
  resultTableDataSource = new MatTableDataSource<any>();
  selectedCase: any;

  constructor(private fhirHelperService: FhirHelperService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes['successResponse']?.currentValue && !!changes['successResponse']?.currentValue?.total ){
      this.parseResponseToTable(changes['successResponse']?.currentValue);
      this.resultsTabGroup.selectedIndex = 0;
    }
    if(!!changes['errorResponse']?.currentValue){
      this.resultTableDataSource.data = [];
      this.resultsTabGroup.selectedIndex = 0;
    }
  }

  private parseResponseToTable(response: any) {
    const outerEntryList = response.entry;
    let formattedData = [];
    outerEntryList.forEach((bundle, i) => {
      let decedent: any = {};
      decedent.bundleResource = bundle;

      const patientResource = this.findResourceByType(bundle.resource, "Patient");
      const officialName = this.fhirHelperService.getPatientOfficialName(patientResource, PatientNameReturn.lastfirst);
      decedent.officialName = officialName || 'Unknown';

      const mannerOfDeathObservation = this.getObservationByProfile(bundle.resource, Obs_MannerOfDeath);
      const mannerOfDeathStr = this.getMannerOfDeathObservationStr(mannerOfDeathObservation);
      decedent.mannerOfDeath = mannerOfDeathStr || 'Unknown';

      const deathDateObservation = this.getObservationByProfile(bundle.resource, Obs_DeathDate);
      decedent.deathDate= deathDateObservation?.effectiveDateTime;

      const compositionResource = this.findResourceByType(bundle.resource, "Composition");

      const mdiCaseNumber = this.getTrackingNumber(compositionResource, TrackingNumberType.Mdi);
      decedent.mdiCaseNumber = mdiCaseNumber || 'Unknown';

      const edrsFileNumber = this.getTrackingNumber(compositionResource, TrackingNumberType.Edrs);
      decedent.edrsFileNumber = edrsFileNumber || 'Unknown';

      formattedData.push(decedent);
    })
    console.log(formattedData);
    this.resultTableDataSource.data = formattedData;
  }

  // TODO extract this to mdi service
  private getMannerOfDeathObservationStr(observationResource){
    if(!observationResource?.resourceType
      || observationResource.resourceType != 'Observation'){
      console.error("Empty or incorrect function parameter.");
      return null;
    }
    const result = observationResource?.valueCodeableConcept?.coding?.[0]?.display;
    return result;
  };

  private findResourceByType(documentBundle, resourceType) {
    if(!documentBundle
      || !documentBundle.resourceType || documentBundle.resourceType != "Bundle"
      || !documentBundle.type || documentBundle.type != "document"
      || !documentBundle.entry?.length){
      console.error("Empty or incorrect function parameter.");
      return null;
    }
    const result = documentBundle.entry
      .find(entry => entry?.resource?.resourceType === resourceType)
      ?.resource;
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
    const result = documentBundle?.entry
      ?.filter(entry => entry?.resource?.resourceType === "Observation")
      ?.find(entry => entry?.resource?.meta?.profile?.[0] === profileStr)
      ?.resource;

    return result;
  }

  //TODO this code simply does not work and needs to be refactored or extended properly

  getTrackingNumber(resource: any, type: TrackingNumberType): string {
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions?.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.value || undefined;
  }

}
