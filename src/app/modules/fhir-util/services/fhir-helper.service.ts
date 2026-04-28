import {inject, Injectable} from '@angular/core';
import {TrackingNumberType} from "../../fhir-mdi-library";
import {AppConstants} from "../../../providers/app-constants";
import {FhirResource} from "../models/fhir/r4/base/fhir.resource";
import {TitleCasePipe} from "@angular/common";

interface HumanName {
  use?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  extension?: any[];
  _given?: any[];
  _family?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FhirHelperService {
  public defaultString: string = this.appConstants.VALUE_NOT_FOUND;
  private titleCasePipe = inject(TitleCasePipe)

  constructor(
    private appConstants: AppConstants,
  ) { }

  getDataAbsentReason(data: any){
    if(!data?.extension?.length){
      return null;
    }
    const dataAbsentReasonUrl = "http://hl7.org/fhir/StructureDefinition/data-absent-reason";
    const result =  data.extension.find(extension => extension.url === dataAbsentReasonUrl).valueCode;
    return result;
  }

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


  getOfficialName(resource: any, returnStyle: PatientNameReturn = PatientNameReturn.fullname, includePrefix: boolean = false): string | null {
    if (!resource?.name) {
      return this.defaultString;
    }

    const nameList: HumanName[] = resource.name;

    // Check if the name array only contains extension (no actual name data)
    const initialAbsentReason = this.getDataAbsentReason(nameList[0]);
    if (initialAbsentReason && !nameList[0]?.given && !nameList[0]?.family && !nameList[0]?.use) {
      return this.titleCasePipe.transform(initialAbsentReason);
    }

    const selectedName = this.findOfficialOrFirstName(nameList);
    if (!selectedName) {
      return this.defaultString;
    }

    // Check if this name entry only has extension
    const nameAbsentReason = this.getDataAbsentReason(selectedName);
    if (nameAbsentReason && !selectedName?.given && !selectedName?.family) {
      return this.titleCasePipe.transform(nameAbsentReason);
    }

    return this.formatNameByStyle(selectedName, returnStyle, includePrefix, nameAbsentReason);
  }

  private findOfficialOrFirstName(nameList: HumanName[]): HumanName | null {
    if (!nameList?.length) {
      return null;
    }

    // Find official name or use first name in list
    const officialName = nameList.find(name => name.use === 'official');
    return officialName || nameList[0];
  }

  private extractFirstName(name: HumanName): string | null {
    if (name?.given?.[0]?.trim()) {
      return name.given[0].trim();
    }

    const givenNameAbsentReason = this.getDataAbsentReason(name?._given?.[0]);
    return givenNameAbsentReason ? this.titleCasePipe.transform(givenNameAbsentReason) : null;
  }

  private extractLastName(name: HumanName): string | null {
    if (name?.family?.trim()) {
      return name.family.trim();
    }

    const familyNameAbsentReason = this.getDataAbsentReason(name?._family);
    return familyNameAbsentReason ? this.titleCasePipe.transform(familyNameAbsentReason) : null;
  }

  private formatFullName(name: HumanName, includePrefix: boolean): string {
    const parts: string[] = [];

    if (includePrefix && name.prefix?.length) {
      parts.push(...name.prefix);
    }

    const firstName = this.extractFirstName(name);
    if (firstName) {
      parts.push(firstName);
    }

    const lastName = this.extractLastName(name);
    if (lastName) {
      parts.push(lastName);
    }

    return parts.join(' ');
  }

  private formatNameByStyle(
    name: HumanName,
    returnStyle: PatientNameReturn,
    includePrefix: boolean,
    fallbackAbsentReason: string | null
  ): string | null {
    switch (returnStyle) {
      case PatientNameReturn.fullname: {
        const fullName = this.formatFullName(name, includePrefix);
        return fullName || fallbackAbsentReason || this.defaultString;
      }
      case PatientNameReturn.lastfirst: {
        const firstName = this.extractFirstName(name);
        const lastName = this.extractLastName(name);
        return (lastName && firstName) ? `${lastName}, ${firstName}` : null;
      }
      case PatientNameReturn.firstonly: {
        return this.extractFirstName(name);
      }
      case PatientNameReturn.lastonly: {
        return this.extractLastName(name) || '';
      }
      default:
        return this.defaultString;
    }
  }
}

export enum PatientNameReturn {
  fullname, // Given Given Given ... Family
  lastfirst, // Family, Given
  firstonly, // Given
  lastonly  // Family
}
