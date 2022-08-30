import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FhirResource} from "../../model/fhir/fhir.resource";
import {FhirResourceProviderService} from "../../service/fhir-resource-provider.service";
import {HttpClient} from "@angular/common/http";
import {DocumentHandlerService} from "../../service/document-handler.service";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  formattedText: string;
  fhirResource: FhirResource;
  selectedStructure: string = 'json';
  fhirResource$: Observable<FhirResource>; // TODO: For Testing, remove.
  
  constructor(
    private httpClient: HttpClient,
    private documentHandler: DocumentHandlerService,
    private fhirResourceProvider: FhirResourceProviderService,
  ) {
      this.fhirResourceProvider.fhirResource$.subscribe( resource => {

      this.fhirResource = resource;
      
      if (this.selectedStructure === "xml") {
        this.fetchXml();
      } else {
        this.formattedText = JSON.stringify( resource, null, 2 );
      }
    })
  };

  ngOnInit(): void {
  }

  fetchXml() {
    const body = {"resourceType": "Parameters", "parameter": [
      {
        "name": "resource",
        "resource": this.fhirResource
      }
    ]};

    const options  = {
      responseType: 'text' as 'text',
    };

    this.httpClient.post("https://apps.hdap.gatech.edu/HL7ValidatorService/fhir/$translate", body, options ).subscribe( response => {
      this.formattedText = response as string;
    });
  }

  onToggleClick() {
    if (this.selectedStructure === "xml") {    
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource());
      this.fetchXml();
    } else if (this.selectedStructure === "json") {
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource());
    } else if (this.selectedStructure === "narrative") {
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource().text);
    }
}  
}
