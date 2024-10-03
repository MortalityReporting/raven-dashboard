import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../providers/module-header-config";
import {MdiToEDRSDocumentWrapper} from "../models/mdiToEdrsDocumentWrapper";
import {Bundle} from "../../fhir-util";

@Component({
  selector: 'rc-record-comparison',
  templateUrl: './record-comparison.component.html',
  styleUrl: './record-comparison.component.scss'
})
export class RecordComparisonComponent{

  setRecordExpanded = true;
  userDocumentWrapper: MdiToEDRSDocumentWrapper; // A
  referenceRecordBundle: Bundle;

  constructor(
    @Inject('comparisonConfig') public config: ModuleHeaderConfig,
  ) {}

  setSelectedReferenceRecord(event: Bundle) {
    console.log(event);
    this.referenceRecordBundle = event;
  }
}
