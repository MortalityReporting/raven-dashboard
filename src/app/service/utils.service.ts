import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
      console.log(theDom.getElementsByTagName('parsererror'));
      return !(theDom.getElementsByTagName('parsererror').length > 0);
    }
    catch (e) {
      return false;
    }
  }

  beautifyJSON(str: string): string{
    return JSON.stringify(JSON.parse(str), null, 2);
  }

}
