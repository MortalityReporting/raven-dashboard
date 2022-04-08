import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentHandlerService {

  constructor() { }

  getSourceResourceByFieldId(fieldId: string) {
    return ''
  }

  getPatientOfficialName(documentBundle: any): string {
    if (documentBundle) {
      let patientResource = this.filterPatientResource(documentBundle)
      let nameList = patientResource.name;
      let firstOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];
      console.log(firstOfficialName);
      let fullName = "";
      firstOfficialName.given.forEach((name: any) => {
        fullName = fullName + name + " "
      });
      fullName = fullName + firstOfficialName.family;
      return fullName;
    }
    else {
      return ""; // TODO: Need to handle the DOM to not call this unless resources available.
    }
  }

  filterPatientResource(documentBundle: any): any {
    let entryList = documentBundle.entry;
    let patientResource = (entryList.filter((entry: any) => entry.resource.resourceType === "Patient"))[0].resource;
    return patientResource;
  }
}
