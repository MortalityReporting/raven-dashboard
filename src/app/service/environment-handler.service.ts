import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentHandlerService {

  constructor() { }

  getFhirServerBaseURL(): string {
    let ravenFhirServer = environment.ravenFhirServer;
    if (!ravenFhirServer.endsWith("/")) {
      ravenFhirServer = ravenFhirServer.concat("/");
    }
    return ravenFhirServer;
  }

}
