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

}
