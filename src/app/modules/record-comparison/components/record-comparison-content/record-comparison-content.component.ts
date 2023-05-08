import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { USCorePatientDiff } from '../../models/us-core-patient.diff';
import { CompositionMdiToEdrsDiff } from '../../models/composition-mdi-to-edrs.diff';
import { USCoreLocationDiff } from '../../models/us-core-location.diff';
import { USCorePractitionerDiff } from '../../models/us-core-practitioner.diff';
import { ObservationDecedentPregnancyDiff } from '../../models/observation-decedent-pregnancy.diff';
import { ObservationDeathDateDiff } from '../../models/observation-death-date.diff';
import { ObservationMannerOfDeathDiff } from '../../models/observation-manner-of-death.diff';
import { DecedentService } from "../../../record-viewer/services/decedent.service";
import { RecordComparisonDialogComponent } from '../record-comparison-dialog/record-comparison-dialog.component';
import { UtilsService } from "../../../../service/utils.service";
import { ActivatedRoute } from "@angular/router";
import {UserDocumentService} from "../../services/user-document.service";
import {MdiToEDRSDocumentWrapper} from "../../models/mdiToEdrsDocumentWrapper";
import {ReferenceDocumentService} from "../../services/reference-document.service";
import {ComparisonService} from "../../services/comparison.service";
import {Difference} from "../../models/difference";
import {MatDialog} from "@angular/material/dialog";
import {MdiToEdrsDocumentHandlerService} from "../../../record-viewer";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {FieldConfig, Fields} from "../../providers/field.config";

@Component({
  selector: 'record-comparison-content',
  templateUrl: './record-comparison-content.component.html',
  styleUrls: ['./record-comparison-content.component.scss'],
})
export class RecordComparisonContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  /**
   * UI State Variables
   * */
  isLoading = false;
  isAccordionExpanded = false;
  idStateList = [
    { expanded: true,     id: 'caseAdminInfo' },
    { expanded: false,    id: 'demographics' },
    { expanded: false,    id: 'jurisdiction' },
    { expanded: false,    id: 'causeAndManner' },
    { expanded: false,    id: 'medicalHistory' },
    { expanded: false,    id: 'narratives' },
    { expanded: false,    id: 'circumstances' },
    { expanded: false,    id: 'examAndAutopsy' },
  ]
  stateList = {
    isLoading: false,
    comparisonLoaded: false
  }

  /**
   * Reference Case List
   * */
  testCases: any;
  selectedTestCase: any = undefined;

  /**
   * MDI to EDRS Documents with Wrappers to be compared.
   * */
  userDocumentWrapper: MdiToEDRSDocumentWrapper; // A
  referenceDocumentWrapper: MdiToEDRSDocumentWrapper; // B
  difference: Difference = undefined; // Difference between A and B

  /**
   * Comparison Field Configuration
   * */
  fields: Fields = new Fields();


  patient: USCorePatientDiff = new USCorePatientDiff( undefined, undefined );
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff( undefined, undefined );
  location: USCoreLocationDiff = new USCoreLocationDiff( undefined, undefined );
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff( undefined, undefined );
  deathDate: ObservationDeathDateDiff;
  mannerOfDeath: ObservationMannerOfDeathDiff;
  practitioner: USCorePractitionerDiff;


  constructor(
    @Inject('comparisonConfig') public config: ModuleHeaderConfig,
    private userDocumentService: UserDocumentService,
    private referenceDocumentService: ReferenceDocumentService,
    private comparisonService: ComparisonService,
    private dialog: MatDialog,
    private decedentService: DecedentService,
    private documentHandler: MdiToEdrsDocumentHandlerService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // If an "id" parameter is passed in the URL, load that case immediately.
    let compositionId = this.route.snapshot.params['id'];
    console.log(compositionId);
    if (compositionId) {
      this.isLoading = true;
      this.userDocumentService.getUserDocumentBundle(compositionId).subscribe(
        {
          next: (userDocumentWrapper: MdiToEDRSDocumentWrapper) => {
            this.userDocumentWrapper = userDocumentWrapper;
          }
        }
      );
    }

    // Get Reference Document List
    this.referenceDocumentService.getReferenceDocuments().subscribe(
      {next: value => {
        console.log(value);
          this.testCases = value;
          this.testCases.splice(0,0, {"display": "Select a reference record..."})
          this.selectedTestCase = this.testCases[0];
      }}
    );
  }

  runComparison() {
    this.difference = this.comparisonService.doDiff(this.userDocumentWrapper.documentBundle, this.referenceDocumentWrapper.documentBundle);
    this.stateList.comparisonLoaded = true;
  }

  onReferenceDocumentChanged(event: any ) {
    if (event.isUserInput === true && event.source.value.bundle) {
      this.referenceDocumentWrapper = this.userDocumentService.createDocumentWrapper(event.source.value.bundle);
      //this.referenceDocument = event.source.value.bundle;
      this.stateList.comparisonLoaded = false;
    }
  }

  onInputBundleClick() {
    const dialogRef = this.dialog.open(RecordComparisonDialogComponent, {
      data: null
    }).afterClosed().subscribe(data => {
      if (data) {
        const parsedBundle = JSON.parse( data ); // TODO: Add error handling.
        this.userDocumentWrapper = this.userDocumentService.createDocumentWrapper(parsedBundle);
      }
    });
  }

  clearCase() {
    this.userDocumentWrapper = undefined;
    this.difference = this.comparisonService.doDiff(undefined, undefined);
  }

  isExpanded(elementId: string) {
    return this.idStateList.find(element => element.id == elementId)?.expanded;
  }

  onToggleState(id: any ) {
    this.idStateList = this.idStateList.map(element => element.id == id ? {id: element.id, expanded: !element.expanded}: element);
  }

  onSetState(resourceId, state){
    this.idStateList = this.idStateList.map(element => element.id == resourceId ? {id: element.id, expanded: state} : element);
  }

  onOpenAll() {
    this.idStateList.forEach(element => element.expanded = true);
    this.accordion.openAll()
  }

  onCloseAll() {
    this.idStateList.forEach(element => element.expanded = false);
    this.accordion.closeAll()
  }
}
