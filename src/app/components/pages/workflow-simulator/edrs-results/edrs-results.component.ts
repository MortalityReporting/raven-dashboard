import {Component, Input, OnInit} from '@angular/core';
import {DecedentSimpleInfo} from "../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {MatStepper} from "@angular/material/stepper";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-edrs-results',
  templateUrl: './edrs-results.component.html',
  styleUrls: ['./edrs-results.component.css']
})
export class EdrsResultsComponent implements OnInit {
  @Input('parentStepper') parentStepper: MatStepper;
  decedentInfo: DecedentSimpleInfo;

  edrsSearchParametersForm = this.formBuilder.group({
    decedentFirstName: [],
    decedentLastName: [],
    legalSexAtDeath: [],
    range: this.formBuilder.group({
      start: [],
      end: [],
    }),
    districtOfDeath: [],
  });

  constructor(
    private searchEdrsService: SearchEdrsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  onSelectDifferentDocument() {
    this.parentStepper.reset();
  }

  onChangeEndpointConfiguration() {
    this.parentStepper.previous();
  }

  onSubmitSearchParams() {
    console.log(this.edrsSearchParametersForm.value);
  }

  getSearchParametersResourcePreview() {
    return this.edrsSearchParametersForm.value;
  }

  onResultsTabChange() {

  }
}
