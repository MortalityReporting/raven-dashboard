import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {MdiToEDRSDocumentWrapper} from "../../models/mdiToEdrsDocumentWrapper";

@Component({
  selector: 'rc-set-records',
  templateUrl: './set-records.component.html',
  styleUrl: './set-records.component.scss'
})
export class SetRecordsComponent implements OnInit{
  documentTypes = ["EDRS", "MDI-and-EDRS Document Bundle"]
  documentType = new FormControl<string | null>(null);

  personFc = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  @Input() userDocumentWrapper: MdiToEDRSDocumentWrapper;

  ngOnInit(): void {
    this.filteredOptions = this.personFc.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
