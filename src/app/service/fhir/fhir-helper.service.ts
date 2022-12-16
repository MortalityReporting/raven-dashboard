import {Injectable} from '@angular/core';
import {TrackingNumberType} from "../../model/tracking.number.type";
import {TerminologyHandlerService} from "../terminology-handler.service";

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {

  constructor(
    private terminologyHandler: TerminologyHandlerService

  ) { }

  findObservationComponentByCode(observation: any, componentCode: string): any {
    if(!observation.component || !componentCode){
      return null;
    }
    return (observation.component.find((component: any) => component.code.coding[0].code === componentCode)) || undefined;
  }

  // This function should only apply to Composition or DiagnosticReport. Matches by tracking number type constant.
  getTrackingNumber(resource: any, type: TrackingNumberType = TrackingNumberType.Mdi): string {
    const extensions = resource.extension;
    console.log(extensions)
    const trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
    console.log(trackingNumberExtensions)
    const matchedExtension = trackingNumberExtensions.find((extension: any) => extension?.valueIdentifier?.type?.coding?.[0].code === type);
    console.log(matchedExtension)
    return matchedExtension?.valueIdentifier?.value || undefined;
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



  getPatientOfficialName(patientResource: any, returnStyle: PatientNameReturn = 0): string {
    let nameList = patientResource.name;
    let firstOrOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];

    // If No Official Name is Found, use First HumanName in List
    if (firstOrOfficialName === undefined) {
      firstOrOfficialName = nameList[0]
    }

    // TODO: Add better conditional handling if not present.
    switch(returnStyle) {
      case PatientNameReturn.fullname: {
        let fullName = "";
        firstOrOfficialName.given.forEach((name: any) => {
          fullName = fullName + name + " "
        });
        fullName = fullName + firstOrOfficialName.family;
        return fullName;
      }
      case PatientNameReturn.lastfirst: {
        // TODO: Consider what to return if error?
        return firstOrOfficialName?.family + " " + firstOrOfficialName?.given?.[0];
      }
      case PatientNameReturn.firstonly: {
        return firstOrOfficialName?.given?.[0] || ""
      }
      case PatientNameReturn.lastonly: {
        return firstOrOfficialName?.family || ""
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
