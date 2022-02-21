import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../service/utils.service";

@Component({
  selector: 'app-fhir-validator-js',
  templateUrl: './fhir-validator-js.component.html',
  styleUrls: ['./fhir-validator-js.component.css']
})
export class FhirValidatorJsComponent implements OnInit {
  fhirResource: string ='';
  resourceFormat = 'json';
  errorMessage: string;

  constructor(
    private utilsService: UtilsService
  ) { }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate it's operation.
  onFormatInput() {
    if(this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource)))
    {
      if(this.resourceFormat === 'json'){
        this.fhirResource = this.utilsService.beautifyJSON(this.fhirResource);
      }
      else if(this.resourceFormat === 'xml'){
        this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
      }
    }
    this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
  }

  ngOnInit(): void {
  }

  isEnabledFormatInputBtn(): boolean {
    return !!this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource));
  }
}
