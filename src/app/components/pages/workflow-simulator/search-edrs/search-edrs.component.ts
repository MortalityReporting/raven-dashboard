import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {SearchEdrsService} from "../../../../service/search-edrs.service";

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.css'],
  encapsulation: ViewEncapsulation.None // we need this to disable the header for the stepper and use it as an indicator
})
export class SearchEdrsComponent implements OnInit {

  inputTypeOptions: string[] = ['Registered Endpoint', 'Custom Endpoint'];
  documentBundle: any;

  serverEndpointList: any[] = [
    {uri: 'www.bluejay.edu', displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'Gavers'},
  ];

  endpointConfigurationFormGroup = this.formBuilder.group({
    inputType: [this.inputTypeOptions[0]],
    serverEndpoint: [this.serverEndpointList[0].uri]
  });

  constructor(
    private formBuilder: FormBuilder,
    private searchEdrsService: SearchEdrsService
  ) {}

  ngOnInit(): void {
    this.searchEdrsService.documentBundle$.subscribe({
      next: value => this.documentBundle = value
    })
  }

  onSubmitEndpointConfiguration() {
    console.log(this.endpointConfigurationFormGroup);
  }

  tabSelectionChange() {
    this.searchEdrsService.setDocumentBundle(null);
  }
}
