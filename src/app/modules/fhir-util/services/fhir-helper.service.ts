import {Injectable} from '@angular/core';
import {TrackingNumberType} from "../../fhir-mdi-library";
import {AppConstants} from "../../../providers/app-constants";

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {
  public defaultString: string = this.appConstants.VALUE_NOT_FOUND;

  constructor(
    private appConstants: AppConstants,
  ) { }

  findObservationComponentByCode(observation: any, componentCode: string): any {
    if(!observation?.component || !componentCode){
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


  getOfficialName(resource: any, returnStyle: PatientNameReturn = 0, includePrefix: boolean = false): string {
    if(!resource.name){
      return this.defaultString;
    }
    let nameList = resource.name;

    // Helper function to check for extension and return title case
    const getExtensionValue = (extensionArray: any[]): string | null => {
      if (!extensionArray || !Array.isArray(extensionArray)) {
        return null;
      }
      const maskedExt = extensionArray.find(ext =>
        ext.valueCode === 'masked'
      );
      if (maskedExt && maskedExt.valueCode) {
        // Convert to title case: first letter uppercase, rest lowercase
        return maskedExt.valueCode.charAt(0).toUpperCase() + maskedExt.valueCode.slice(1).toLowerCase();
      }
      return null;
    };

    // Check if the name array itself only contains extension (no actual name data)
    const nameExtension = getExtensionValue(nameList[0]?.extension);
    if (nameExtension && !nameList[0]?.given && !nameList[0]?.family && !nameList[0]?.use) {
      return nameExtension;
    }

    let firstOrOfficialName = (nameList.filter((humanName: any) => humanName.use === "official"))[0];

    // If No Official Name is Found, use First HumanName in List
    if (firstOrOfficialName === undefined) {
      firstOrOfficialName = nameList[0];
    }

    // Check if this name entry only has extension
    const currentNameExtension = getExtensionValue(firstOrOfficialName?.extension);
    if (currentNameExtension && !firstOrOfficialName?.given && !firstOrOfficialName?.family) {
      return currentNameExtension;
    }

    // Helper function to get first/given name (checks value then extension)
    const getFirstName = (): string | null => {
      if (firstOrOfficialName?.given?.[0]?.trim()) {
        return firstOrOfficialName.given[0].trim();
      }
      // Check for extension on the given name element
      const givenExtension = firstOrOfficialName?._given?.[0]?.extension;
      return getExtensionValue(givenExtension);
    };

    // Helper function to get last/family name (checks value then extension)
    const getLastName = (): string | null => {
      if (firstOrOfficialName?.family?.trim()) {
        return firstOrOfficialName.family.trim();
      }
      // Check for extension on the family name element
      const familyExtension = firstOrOfficialName?._family?.extension;
      return getExtensionValue(familyExtension);
    };

    // TODO: Add better conditional handling if not present.
    switch(returnStyle) {
      case PatientNameReturn.fullname: {
        let fullName = "";
        if (includePrefix) {
          firstOrOfficialName?.prefix?.forEach((prefix: any) => {
            fullName = fullName + prefix + " "
          });
        }

        // Get first name (value or extension)
        const firstName = getFirstName();
        if (firstName) {
          fullName = fullName + firstName + " ";
        }

        // Get last name (value or extension)
        const lastName = getLastName();
        if (lastName) {
          fullName = fullName + lastName;
        }

        return fullName.trim() || currentNameExtension || this.defaultString;
      }
      case PatientNameReturn.lastfirst: {
        const firstName = getFirstName();
        const lastName = getLastName();

        if (lastName && firstName) {
          return lastName + ", " + firstName;
        }
        return null;
      }
      case PatientNameReturn.firstonly: {
        return getFirstName() || null;
      }
      case PatientNameReturn.lastonly: {
        return getLastName() || "";
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
