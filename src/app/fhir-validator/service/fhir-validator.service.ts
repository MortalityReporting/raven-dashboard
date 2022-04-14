import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FhirValidatorService {

  constructor( private http: HttpClient) { }

  getUiValidationMessages(fhirResource: any, resourceFormat: string): string {

    if(!fhirResource || (!!fhirResource && Object.keys(fhirResource).length === 0)) {
      return "Please enter a FHIR resource for validation.";
    }
    else if (resourceFormat === 'json'){
      if(!this.isJsonString(fhirResource)){
        return "Invalid json format detected.";
      }
      else if(!JSON.parse(fhirResource).resourceType){
        return "Missing required resourceType property.";
      }
    }
    else if (resourceFormat === 'xml' && !this.isXmlString(fhirResource)){
      return "Invalid xml format detected.";
    }
    return null;
  }

  isJsonString(str: string): boolean {
    try {
      JSON.parse(str.trim());
    } catch (e) {
      return false;
    }
    return true;
  }

  isXmlString(str: string): boolean {
    try {
      const parser = new DOMParser();
      const theDom = parser.parseFromString(str?.trim(), 'application/xml');
      return !(theDom.getElementsByTagName('parsererror').length > 0);
    }
    catch (e) {
      return false;
    }
  }

  beautifyJSON(str: string): string{
    return JSON.stringify(JSON.parse(str), null, 2);
  }

  // I borrowed some regex code
  beautifyXML(str: string): string{
    let formatted = '', indent= '';
    const tab='  ';
    str.split(/>\s*</).forEach(function(node) {
      if (node.match( /^\/\w/ )) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match( /^<?\w[^>]*[^\/]$/ )){
        indent += tab;
      }
    });
    return formatted.substring(1, formatted.length-3);
  }

  validateFhirResource(fhirResource: any, resourceFormat: string , selectedProfile: any):  Observable<any> {

   const requestData = {
      "resourceType": "Parameters",
      "parameter": [
        {
          "name": "ig",
          "valueString": "hl7.fhir.us.mdi#current"
        },
        {
          "name": "profile",
          "valueString": selectedProfile.url
        },
        {
          "name": "format",
          "valueString": resourceFormat
        },
        {
          "name": "sourceContent",
          "valueString": encodeURIComponent(fhirResource),
        }
      ]
    }
    return this.http.post("http://127.0.0.1:8080/fhir/Bundle/$validate", requestData).pipe( map((result: any) => (
      result as Object
    )));
  }

}
