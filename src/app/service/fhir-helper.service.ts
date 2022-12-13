import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {

  constructor() { }

  findSubjectInBundle(resource: any, bundle: any): any {
    const subjectId = resource?.subject?.reference?.split("/").pop();
    const subject = bundle.entry.find(bec => bec.resource.id === subjectId).resource;
    return subject; // Return subject resource
  }

  getPatientOfficialName(patientResource: any): string {
    let nameList = patientResource.name;
    let firstOrOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];

    // If No Official Name is Found, use First HumanName in List
    if (firstOrOfficialName === undefined) {
      firstOrOfficialName = nameList[0]
    }
    let fullName = "";
    firstOrOfficialName.given.forEach((name: any) => {
      fullName = fullName + name + " "
    });
    fullName = fullName + firstOrOfficialName.family;
    return fullName;
  }

}
