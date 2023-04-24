import {Injectable} from '@angular/core';
import {TrackingNumberType} from "../../../model/tracking.number.type";
import {TerminologyHandlerService} from "./terminology-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {

  constructor() { }

  findObservationComponentByCode(observation: any, componentCode: string): any {
    if(!observation.component || !componentCode){
      return null;
    }
    return (observation.component.find((component: any) => component?.code?.coding?.[0]?.code === componentCode)) || undefined;
  }

  // This function should only apply to Composition or DiagnosticReport. Matches by tracking number type constant.
  getTrackingNumber(resource: any, type: TrackingNumberType = TrackingNumberType.Mdi): string {
    if(!resource?.extension){
      return null;
    }
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.value || undefined;
  }

  getTrackingNumberSystem(resource: any, type: TrackingNumberType = TrackingNumberType.Mdi): string {
    if(!resource?.extension){
      return null;
    }
    const extensions = resource.extension;
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    const matchedExtension = trackingNumberExtensions.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    return matchedExtension?.valueIdentifier?.system || undefined;
  }

// {
//   "url": "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number",
//   "valueIdentifier": {
//     "type": {
//       "coding": [
//         {
//           "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
//           "code": "tox-lab-case-number",
//           "display": "Toxicology Laboratory Case Number"
//         }
//       ]
//     },
//     "system": "http://uf-path-labs.org/fhir/lab-cases",
//     "value": "R21-01580"
//   }
// }



  getOfficialName(resource: any, returnStyle: PatientNameReturn = 0, includePrefix: boolean = false): string {
    console.log(resource);
    let nameList = resource.name;
    let firstOrOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];

    // If No Official Name is Found, use First HumanName in List
    if (firstOrOfficialName === undefined) {
      firstOrOfficialName = nameList[0]
    }

    // TODO: Add better conditional handling if not present.
    switch(returnStyle) {
      case PatientNameReturn.fullname: {
        let fullName = "";
        if (includePrefix) {
          firstOrOfficialName.prefix.forEach((prefix: any) => {
            fullName = fullName + prefix + " "
          });
        }
        firstOrOfficialName.given.forEach((name: any) => {
          fullName = fullName + name + " "
        });
        fullName = fullName + firstOrOfficialName.family;
        return fullName.trim();
      }
      case PatientNameReturn.lastfirst: {
        // TODO: Consider what to return if error?
        return firstOrOfficialName?.family.trim() + ", " + firstOrOfficialName?.given?.[0].trim();
      }
      case PatientNameReturn.firstonly: {
        return firstOrOfficialName?.given?.[0].trim() || ""
      }
      case PatientNameReturn.lastonly: {
        return firstOrOfficialName?.family.trim() || ""
      }
    }
  }
}

export enum PatientNameReturn {
  fullname, // Given Given Given ... Family
  lastfirst, // Family, Given
  firstonly, // Given
  lastonly  // Family
}
