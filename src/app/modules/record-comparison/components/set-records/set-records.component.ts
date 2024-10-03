import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {distinctUntilChanged, map, Observable, startWith, switchMap} from "rxjs";
import {openFileUpload} from "../../../../components/widgets/file-uploader/file-uploader.component";
import {MatDialog} from "@angular/material/dialog";
import {ReferenceDocumentService} from "../../services/reference-document.service";
import {MdiToEDRSDocumentWrapper} from "../../models/mdiToEdrsDocumentWrapper";
import {filter} from "rxjs/operators";
import {Bundle} from "../../../fhir-util";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

export class ReferenceRecord{
  display: string;
  bundle: Bundle;
}


@Component({
  selector: 'rc-set-records',
  templateUrl: './set-records.component.html',
  styleUrl: './set-records.component.scss'
})
export class SetRecordsComponent implements OnInit{
  @Output() referenceRecordSelectedEvent = new EventEmitter<Bundle>();

  //TODO load the reference record types from API
  documentTypes = ["EDRS", "MDI-and-EDRS Document Bundle"]
  documentType = new FormControl<string | null>(null);

  referenceRecordFc = new FormControl();
  filteredOptions: Observable<ReferenceRecord[]>;
  selectedPatient: MdiToEDRSDocumentWrapper;

  constructor(private dialog: MatDialog, private referenceDocumentService: ReferenceDocumentService) {
  }

  ngOnInit(): void {
    this.subscribeToReferenceRecordsOptions();
  }

  onUploadDocument() {
    openFileUpload(
      this.dialog,
      {
        //empty object for now
      })
      .subscribe(result=> console.log(result));

  }

  displayTriggerEventFn(triggerEvent: ReferenceRecord): string {
    return triggerEvent?.display;
  }

  private subscribeToReferenceRecordsOptions(){
    this.filteredOptions = this.referenceRecordFc.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        switchMap(value => {
          return this._filter(value || '')
        })
      );
  }

  private _filter(value: string): Observable<ReferenceRecord[]> {
    return this.referenceDocumentService.getReferenceDocuments().pipe(
      filter(data => !!data),
      map((data) => {
        return data.filter(option =>
          option.display?.toLowerCase()?.includes(value)
          ||
          option.display?.toLowerCase()?.includes(value)
        )
      })
    )
  }

  onReferenceRecordSelected(event: MatAutocompleteSelectedEvent) {
    this.referenceRecordSelectedEvent.emit(event.option.value.bundle);
  }
}
