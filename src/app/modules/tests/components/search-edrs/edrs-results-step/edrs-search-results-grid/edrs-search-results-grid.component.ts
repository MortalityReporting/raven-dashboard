import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  FHIRProfileConstants,
} from "../../../../../../providers/fhir-profile-constants";
import {FhirHelperService, PatientNameReturn} from "../../../../../fhir-util/services/fhir-helper.service";
import {MatTabGroup} from "@angular/material/tabs";
import {MatTableDataSource} from "@angular/material/table";
import {MdiToEdrsDocumentHandlerService} from "../../../../../record-viewer";
import {TrackingNumberType} from "../../../../../fhir-mdi-library";
import {BundleHelperService, CodeableConcept} from "../../../../../fhir-util";

@Component({
    selector: 'app-edrs-search-results-grid',
    templateUrl: './edrs-search-results-grid.component.html',
    styleUrls: ['./edrs-search-results-grid.component.scss'],
    standalone: false
})
export class EdrsSearchResultsGridComponent implements OnInit, OnChanges {

  @Input() successResponse: any;
  @Input() errorResponse: any;

  @Output() selectedCaseValueEmitter : EventEmitter<any> = new EventEmitter();

  @ViewChild(MatTabGroup) resultsTabGroup: MatTabGroup;

  resultTableColumns = ['officialName', 'gender', 'address', 'edrsFileNumber'];
  resultTableDataSource = new MatTableDataSource<any>();
  selectedCase: any;

  constructor(
    private bundleHelper: BundleHelperService,
    private fhirHelperService: FhirHelperService,
    private documentHandlerService: MdiToEdrsDocumentHandlerService,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
    ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes['successResponse']?.currentValue){
      this.parseResponseToTable(changes['successResponse']?.currentValue);
      this.resultsTabGroup.selectedIndex = 0;
    }
    if(!!changes['errorResponse']?.currentValue){
      this.resultTableDataSource.data = [];
      this.resultsTabGroup.selectedIndex = 0;
    }
  }

  private parseResponseToTable(response: any) {
    if(!response.total){
      this.resultTableDataSource.data = [];
    }
    else {
      const outerEntryList = response.entry;
      let formattedData = [];
      outerEntryList.forEach((bundle, i) => {
        let decedent: any = {};
        decedent.bundleResource = bundle;

        const patientResource = this.findResourceByType(bundle.resource, "Patient");
        const officialName = this.fhirHelperService.getOfficialName(patientResource, PatientNameReturn.lastfirst);
        decedent.officialName = officialName;

        const genderStr = this.toTitleCase(patientResource.gender);
        decedent.gender = genderStr;

        decedent.address = this.getFormattedAddress(patientResource.address);

        const dob = patientResource.birthDate;
        decedent.dob = dob;

        const deceasedDateTime = patientResource.deceasedDateTime;
        decedent.deceasedDateTime = deceasedDateTime;

        const ethnicityStr = this.documentHandlerService.getDecedentEthnicityText(patientResource.extension);
        decedent.ethnicity = ethnicityStr;

        const raceStr = this.documentHandlerService.getDecedentRaceText(patientResource.extension);
        decedent.race = raceStr;


        const mannerOfDeathObservation = this.bundleHelper.findResourceByProfileName(bundle.resource, this.fhirProfiles.VRDR.Obs_MannerOfDeath);
        if(!mannerOfDeathObservation){
          decedent.mannerOfDeath = '';
        }
        else {
          const mannerOfDeathCc: CodeableConcept = new CodeableConcept(mannerOfDeathObservation?.valueCodeableConcept);
          decedent.mannerOfDeath = mannerOfDeathCc?.toString();
        }


        const deathDateObservation = this.bundleHelper.findResourceByProfileName(bundle.resource, this.fhirProfiles.VRDR.Obs_DeathDate)
        decedent.deathDate = deathDateObservation?.effectiveDateTime;

        const compositionResource = this.findResourceByType(bundle.resource, "Composition");

        const mdiCaseNumber = this.getTrackingNumber(compositionResource, TrackingNumberType.Mdi);
        decedent.mdiCaseNumber = mdiCaseNumber;

        const edrsFileNumber = this.getTrackingNumber(compositionResource, TrackingNumberType.Edrs);
        decedent.edrsFileNumber = edrsFileNumber;


        formattedData.push(decedent);
      })

      this.resultTableDataSource.data = formattedData;
    }
  }

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

  getTrackingNumber(resource: any, type: TrackingNumberType): string {
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions?.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.value || undefined;
  }

  private toTitleCase(str: string): string{
    if(!str){
      return "";
    }
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  setSelectedCase(row) {
    if(!!row){
      this.selectedCase = row;
    }
    else {
      this.selectedCase = null;
    }
    this.selectedCaseValueEmitter.emit(this.selectedCase);
  }

  private getFormattedAddress(patientResourceAddress) {
    if (!patientResourceAddress) {
      return null;
    }

    const address = patientResourceAddress.find(address => address.use == 'home');
    const addressLine = address?.line?.join(', ');
    const addressCity = address?.city;
    const addressState = address?.state;
    const addressPostalCode = address?.postalCode;
    const addressCounty = address?.country;

    const decedentAddress = {
      line: addressLine,
      city: addressCity,
      state: addressState,
      postalCode: addressPostalCode,
      country: addressCounty
    }
    return decedentAddress;
  }
}
