import { Component, OnInit } from '@angular/core';
import {DocumentHandlerService} from "../../service/document-handler.service";
import {Observable} from "rxjs";
import {FhirResource} from "../../model/fhir/fhir.resource";
import {FhirResourceProviderService} from "../../service/fhir-resource-provider.service";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  selectedStructure: string = 'json';

  JSON: any; // TODO: For Testing, remove.
  fhirResource$: Observable<FhirResource>; // TODO: For Testing, remove.


  constructor(
    public documentHandler: DocumentHandlerService,
    private fhirResourceProvider: FhirResourceProviderService
  ) {
    this.JSON = JSON; // TODO: For Testing, remove.
    this.fhirResource$ = this.fhirResourceProvider.fhirResource$; // TODO: For Testing, remove.
  }

  ngOnInit(): void {
  }

}
