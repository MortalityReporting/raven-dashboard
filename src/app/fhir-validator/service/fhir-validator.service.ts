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

  validateFhirResource(fhirResource: any, resourceFormat: string):  Observable<any> {

    let OBSERVATION = {
      "resourceType" : "Observation",
      "id" : "observation-death-date-j-rogers",
      "meta" : {
        "versionId" : "1",
        "lastUpdated" : "2022-02-17T03:30:31.175+00:00",
        "source" : "#HxNQbdXHR9YLhjG8",
        "profile" : [
          "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date"
        ]
      },
      "status" : "final",
      "component" : [
        {
          "code" : {
            "coding" : [
              {
                "system" : "http://loinc.org",
                "code" : "80123-6",
                "display" : "Date and time pronounced dead [US Standard Certificate of Death]"
              }
            ]
          },
          "valueDateTime" : "2022-01-04T05:30:00-05:00"
        }
      ]
    }

    //OBSERVATION.meta.profile[0] = encodeURI(OBSERVATION.meta.profile[0])

    const testPostCall = {
      "resourceType": "Parameters",
      "parameter": [
        {
          "name": "ig",
          "valueString": "hl7.fhir.us.mdi#current"
        },
        {
          "name": "profile",
          "valueString": "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date"
        },
        {
          "name": "format",
          "valueString": "json"
        },
        {

          "name": "sourceContent",
          "valueString": "%7B%0A%20%20%22resourceType%22%20%3A%20%22Observation%22%2C%0A%20%20%22id%22%20%3A%20%22observation-death-date-j-rogers%22%2C%0A%20%20%22meta%22%20%3A%20%7B%0A%20%20%20%20%22versionId%22%20%3A%20%221%22%2C%0A%20%20%20%20%22lastUpdated%22%20%3A%20%222022-02-17T03%3A30%3A31.175%2B00%3A00%22%2C%0A%20%20%20%20%22source%22%20%3A%20%22%23HxNQbdXHR9YLhjG8%22%2C%0A%20%20%20%20%22profile%22%20%3A%20%5B%0A%20%20%20%20%20%20%22http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fmdi%2FStructureDefinition%2FObservation-death-date%22%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22status%22%20%3A%20%22final%22%2C%0A%20%20%22component%22%20%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22code%22%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%22coding%22%20%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22system%22%20%3A%20%22http%3A%2F%2Floinc.org%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22code%22%20%3A%20%2280123-6%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22display%22%20%3A%20%22Date%20and%20time%20pronounced%20dead%20%5BUS%20Standard%20Certificate%20of%20Death%5D%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22valueDateTime%22%20%3A%20%222022-01-04T05%3A30%3A00-05%3A00%22%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D"
          // "valueString": encodeURI(JSON.stringify(OBSERVATION))
         // "name": "sourceContent",
         //"valueString": "%7B%0A%20%20%22resourceType%22%20%3A%20%22Observation%22%2C%0A%20%20%22id%22%20%3A%20%22observation-death-date-j-rogers%22%2C%0A%20%20%22meta%22%20%3A%20%7B%0A%20%20%20%20%22versionId%22%20%3A%20%221%22%2C%0A%20%20%20%20%22lastUpdated%22%20%3A%20%222022-02-17T03%3A30%3A31.175%2B00%3A00%22%2C%0A%20%20%20%20%22source%22%20%3A%20%22%23HxNQbdXHR9YLhjG8%22%2C%0A%20%20%20%20%22profile%22%20%3A%20%5B%0A%20%20%20%20%20%20%22http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fmdi%2FStructureDefinition%2FObservation-death-date%22%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22status%22%20%3A%20%22final%22%2C%0A%20%20%22component%22%20%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22code%22%20%3A%20%7B%0A%20%20%20%20%20%20%20%20%22coding%22%20%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22system%22%20%3A%20%22http%3A%2F%2Floinc.org%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22code%22%20%3A%20%2280616-6%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22display%22%20%3A%20%22Date%20and%20time%20pronounced%20dead%20%5BUS%20Standard%20Certificate%20of%20Death%5D%22%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%22valueDateTime%22%20%3A%20%222022-01-04T05%3A30%3A00-05%3A00%22%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D"
        }
      ]
    }

    return this.http.post("http://127.0.0.1:8080/fhir/Bundle/$validate", testPostCall).pipe( map((result: any) => (
      result as Object
    )));
  }

}
