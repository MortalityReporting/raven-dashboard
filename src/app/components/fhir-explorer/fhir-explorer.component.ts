import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FhirResource} from "../../model/fhir/fhir.resource";
import {FhirResourceProviderService} from "../../service/fhir-resource-provider.service";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "../../service/decedent.service";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  fhirResource: FhirResource;
  fhirResource$: Observable<FhirResource>; // TODO: For Testing, remove.
  selectedStructure: string = 'json';
  
  constructor(
    private httpClient: HttpClient,
    private decedentService: DecedentService,
    private fhirResourceProvider: FhirResourceProviderService,
  ) {
    this.fhirResourceProvider.fhirResource$.subscribe( resource => {
      this.fetchResource();
    })
  };

  ngOnInit(): void {
  }

  onToggleClick() {
    this.fetchResource();
  }

  fetchResource() {

    let format = '?_format=application/fhir+' + this.selectedStructure;

    const options  = {
      responseType: 'text' as 'text',
    };

    // Alternative implementation: POST https://gt-apps.hdap.gatech.edu/HL7ValidatorService/fhir/$translate
    //
    // with payload
    // {
    //   "resourceType": "Parameters",
    //   "parameter": [
    //       {
    //           "name": "resource",
    //           "resource": {}
    //       }
    //   ]
    // }
    //
    // where parameter[0].resource is {} the actual resource you want to convert to XML.

    this.httpClient.get(this.decedentService.getFhirServerBaseURL() + "Composition/" + this.fhirResourceProvider.compostionId + "/$document" + format, options ).subscribe( resource => {

      this.fhirResource = resource;
    })
  }  
}
