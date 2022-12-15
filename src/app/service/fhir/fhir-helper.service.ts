import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {

  constructor() { }

  findObservationComponentByCode(observation: any, componentCode: string): any {
    if(!observation.component || !componentCode){
      return null;
    }
    return (observation.component.find((component: any) => component.code.coding[0].code === componentCode)) || undefined;
  }



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
