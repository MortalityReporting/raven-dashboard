import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentHandlerService {

  constructor(@Inject('env') private environment: any) { }

  getFhirServerBaseURL(): string {
    let ravenFhirServer = this.environment.ravenFhirServer;
    if (!ravenFhirServer.endsWith("/")) {
      ravenFhirServer = ravenFhirServer.concat("/");
    }
    return ravenFhirServer;
  }

  getFhirImportServerURL(): string {
    let fhirImportServer = this.environment.ravenImportApi;
    if (!fhirImportServer.endsWith("/")) {
      fhirImportServer = fhirImportServer.concat("/");
    }
    return fhirImportServer;
  }

  getBlueJayServerBase(): string {
    let blueJayServer = this.environment.blueJayServerBase;
    if (!blueJayServer.endsWith("/")) {
      blueJayServer = blueJayServer.concat("/");
    }
    return blueJayServer;
  }


}
