import { Injectable } from '@angular/core';
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class FhirValidatorService {

  constructor( private utilsService: UtilsService) { }

  getUiValidationMessages(fhirResource: any, resourceFormat: string): string {

    if(!fhirResource || (!!fhirResource && Object.keys(fhirResource).length === 0)) {
      return "Please enter a FHIR resource for validation.";
    }
    else if (resourceFormat === 'json'){
      if(!this.utilsService.isJsonString(fhirResource)){
        return "Invalid json format detected.";
      }
      else if(!fhirResource.resourceType){
        return "Missing required resourceType property.";
      }
    }
    else if (resourceFormat === 'xml' && !this.utilsService.isXmlString(fhirResource)){
      return "Invalid xml format detected.";
    }
    return null;
  }
}
