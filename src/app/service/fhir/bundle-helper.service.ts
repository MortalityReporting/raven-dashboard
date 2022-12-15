import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BundleHelperService {

  constructor() { }

  // Passing a resource with a subject and a bundle, this will find that subject in the bundle.
  findSubjectInBundle(resource: any, bundle: any): any {
    const subjectId = resource?.subject?.reference?.split("/").pop();
    const subject = bundle.entry.find(bec => bec.resource.id === subjectId).resource;
    return subject; // Return subject resource
  }

  // For singleton profiles, this function can be used to find the resource by the profile name. ID should be preferred whenever available.
  findResourceByProfileName(bundle: any, profileName: string): any {
    try {
      const profile = bundle.entry.find((entry: any) => entry.resource.meta.profile.includes(profileName))?.resource;
      return bundle.entry.find((entry: any) => entry.resource.meta.profile.includes(profileName))?.resource || undefined;
    } catch(e) {
      return undefined;
    }
  }

  // For non-singleton profiles, this function can be used to return a list of those resources matching by profile name.
  findResourcesByProfileName(bundle: any, profileName: string): any[] {
    try {
      let items = [];
      bundle.entry.map( (entry: any) => {
        if (entry.resource.meta.profile.includes(profileName)) {
          items.push( entry.resource );
        }
      })
      return items;
    } catch(e) {
      return undefined;
    }
  }
  // This function should be used whenever possible to go off of absolute references to the full URL within the Document Bundle.
  findResourceById(bundle: any, resourceId: string): any {
    if(!bundle || !bundle.entry){
      return null;
    }
    return (bundle.entry.find((entry: any) => entry.fullUrl === resourceId))?.resource || undefined;
  }




}
