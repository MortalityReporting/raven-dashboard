import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.css'],
  encapsulation: ViewEncapsulation.None // we need this to disable the header for the stepper and use it as an indicator
})
export class SearchEdrsComponent implements OnInit {

  documentBundle: any;
  errorMessage: string;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('mdiToEdrsTabGroup') private mdiToEdrsTabGroup: MatTabGroup;

  constructor(
    private formBuilder: FormBuilder,
    private searchEdrsService: SearchEdrsService
  ) {}

  ngOnInit(): void {
    this.searchEdrsService.documentBundle$.subscribe({
      next: value => {
        this.documentBundle = value
        if(this.documentBundle){
          this.errorMessage = null;
        }
      }
    });
  }

  tabSelectionChange() {
    this.searchEdrsService.setDocumentBundle(null);
    this.searchEdrsService.setDecedentData(null);
  }

  onAdvanceStepper() {
    this.errorMessage = null;

    if (this.stepper.selectedIndex === 0) {
      if(!this.documentBundle && this.mdiToEdrsTabGroup.selectedIndex === 0){
        this.errorMessage = "Select a bundle from the table above to proceed.";
      }
      else if (!this.documentBundle && this.mdiToEdrsTabGroup.selectedIndex === 1){
        this.errorMessage = "Upload a valid bundle to proceed.";
      }
    }

    if(!this.errorMessage){
      this.stepper.next();
    }
  }
}
