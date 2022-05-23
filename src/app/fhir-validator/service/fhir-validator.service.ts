import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FhirValidatorService {

  private prodUri = "https://gt-apps.hdap.gatech.edu/HL7ValidatorService/fhir";
 // private prodUri = "https://gt-apps.hdap.gatech.edu/HL7ValidatorService/fhir/Bundle/$validate";
  private localhostUri = "http://127.0.0.1:8080/fhir/Bundle/$validate";

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

  validateFhirResourceOldRev(fhirResource: any, resourceFormat: string , selectedProfile: any):  Observable<any> {

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
    return this.http.post(this.localhostUri, requestData).pipe( map((result: any) => (
      result as Object
    )));
  }

  validateFhirResource(fhirResource: any, resourceFormat: string, resourceType: string):  Observable<any> {
    return this.http.get('./assets/data/formatted_response.json').pipe( map((result: any) => (
      result as Object
    )));
  }

  validateFhirResourceTemp(fhirResource: any, resourceFormat: string, resourceType: string):  Observable<any> {

    if (resourceFormat === 'json') {
      const requestData = {
        "resourceType": "Parameters",
        "parameter": [
          {
            "name": "ig",
            "valueString": "hl7.fhir.us.mdi#current"
          },
          {
            "name": "resource",
            "resource": fhirResource,
          }
        ]
      }

      return this.http.post(this.prodUri + "/$validate", requestData).pipe(map((result: any) => (
        result as Object
      )));
    }

    else if(resourceFormat === 'xml'){

      const requestData =
      `<?xml version="1.0" encoding="UTF-8"?>
      <Parameters xmlns="http://hl7.org/fhir">
        <parameter>
          <name value="ig" />
          <valueString value="hl7.fhir.us.mdi#current" />
        </parameter>
        <parameter>
          <name value="resource" />
            <resource>
              ${fhirResource}
            </resource>
          </parameter>
      </Parameters>`;
      let headers = new HttpHeaders()
        .set('Content-Type', 'application/fhir+xml');

      return this.http.get('./assets/data/valid_resource_response.json').pipe( map((result: any) => (
        result as Object
      )));


      // return this.http.post(this.prodUri + "/$validate", requestData, {headers: headers}).pipe(map((result: any) => (
      //   result as Object
      // )));

    }

    else {
      console.error("Unrecognized resource type. " +
        "Resource type can only be JSON or XML, not other resource can be validated");
      return null;
    }

  }


}
