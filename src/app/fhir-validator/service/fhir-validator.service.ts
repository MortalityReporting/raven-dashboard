import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FhirValidatorService {

  private prodUri = "https://gt-apps.hdap.gatech.edu/HL7ValidatorService/fhir";
  //private prodUri = "http://127.0.0.1:8080/fhir/$validate";

  private isValid = new Subject<boolean>();
  private hasExecuted = new Subject<boolean>();
  private fhirResource = new Subject<any>();

  setValid(value: boolean){
    this.isValid.next(value);
  }

  isValidResourceFound(): Observable<boolean>{
    return this.isValid.asObservable();
  }

  isValidationExecuted(): Observable<boolean>{
    return this.hasExecuted.asObservable();
  }

  setValidationFinished(value: boolean){
    this.hasExecuted.next(value);
  }

  setFhirResource(value: any){
    this.fhirResource.next(value);
  }
  getFhirResource(): Observable<any>{
    return this.fhirResource.asObservable();
  }

  constructor( private http: HttpClient) { }

  getUiValidationMessages(fhirResource: any, resourceFormat: string): string {

    if(!fhirResource || (!!fhirResource && Object.keys(fhirResource).length === 0)) {
      return "Please enter a FHIR resource for validation.";
    }
    else if (resourceFormat === 'json'){
      if(!this.isJsonString(fhirResource)){
        // Could not parse the resource at all. It is not a valid JSON as far as the js parser is concerned.
        return "Invalid json format detected.";
      }
      else if(!JSON.parse(fhirResource).resourceType){
        return "Missing required resourceType property.";
      }
    }
    else if (resourceFormat === 'xml') {
      if(!this.isXmlString(fhirResource)){
        // Could not parse the resource at all. It is not a valid XML as far as the js parser is concerned.
        return "Invalid xml format detected.";
      }
      else {
        // TODO we may need to to some error handling here
        let fhirResourceXML = new DOMParser().parseFromString(fhirResource, 'text/xml');
        const resourceType = fhirResourceXML.childNodes[0].nodeName;
        const xmlnsAttribute  = fhirResourceXML.querySelector(resourceType).getAttribute('xmlns');

        // all FHIR resources should have xmlns="http://hl7.org/fhir"
        if(!xmlnsAttribute || xmlnsAttribute != 'http://hl7.org/fhir'){
          return "Invalid or missing xmlns attribute.";
        }
      }
    }
    // did not find any obvious errors, so returning nothing
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

  validateFhirResourceTemp(fhirResource: any, resourceFormat: string, resourceType: string):  Observable<any> {
    return this.http.get('./assets/data/formatted_response.json').pipe( map((result: any) => (
      result as Object
    )));
  }

  validateFhirResource(fhirResource: any, resourceFormat: string):  Observable<any> {

    let headers = null;
    let requestData = null;

    // Requests are formed in order to be consumed by the API.
    // Note that requestData is nothing but a wrapper to the request and should never change.
    if (resourceFormat === 'json') {
     requestData = {
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

      headers = new HttpHeaders()
        .set('Content-Type', 'application/fhir+json');
    }
    else if (resourceFormat === 'xml'){

      requestData =
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
      headers = new HttpHeaders()
        .set('Content-Type', 'application/fhir+xml');
    }

    return this.http.post(this.prodUri + "/$validate", requestData, {headers: headers}).pipe(map((result: any) => (
      result as Object
    )));

  }


}
