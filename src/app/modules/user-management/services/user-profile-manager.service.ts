import {Injectable} from '@angular/core';
import {Bundle, EnvironmentHandlerService, FhirClientService, FhirResource} from "../../fhir-util";
import {BehaviorSubject, map, Observable, single, tap} from "rxjs";
import {UserProfile} from "../models/user-profile";

@Injectable({
  providedIn: 'root'
})
export class UserProfileManagerService {
  private currentUser = new BehaviorSubject<UserProfile>(undefined);
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private environmentHandler: EnvironmentHandlerService,
    private fhirClient: FhirClientService) {
  }

  setCurrentUser(user: any) {
    //TODO: Don't subscribe inside a service
    this.getUserProfile(user.email).subscribe({
      next: (userProfile: UserProfile) => {
        if (userProfile) {
          this.currentUser.next(userProfile);
        } else {
          console.warn("User Profile not found on FHIR Server, creating new Resource.")
          this.createUserProfile(user.name, user.email).subscribe({
            next: (user: UserProfile) => {this.currentUser.next(user)}
          })
          //this.currentUser.next(this.createUserProfile(user.name, user.email));
        }
      }
    });
  }

  getAllUsers(): Observable<UserProfile[]> {
    return this.fhirClient.search("Practitioner", "?_profile=http://raven-user", true).pipe(
      map((results: FhirResource[] | Bundle) => {
        let users: UserProfile[] = [];
        (results as FhirResource[])?.map(
          (entry: any) => users.push(UserProfile.constructFromFHIR(entry))
        );
        return users;
      }));
  }

  getUserProfile(email: string): Observable<UserProfile | null> {
    return this.fhirClient.search("Practitioner", `?telecom=${email}`, true).pipe(
      map((results: FhirResource[] | Bundle) => {
        return (results as FhirResource[])?.length === 0 ? null :
          UserProfile.constructFromFHIR(results[0])
      })
    );
  }

  createUserProfile(name: string, email: string) {//: Observable<UserProfile> {
    let userProfile = UserProfile.constructFromStrings(name, email);
    const fhirResource = userProfile.toFhirJSON();
    let request$ = this.fhirClient.create("Practitioner", fhirResource).pipe(
      map((result: FhirResource) => {
        if (result.resourceType === "OperationOutcome") return null; // TODO: Add error handling
        else {
          return UserProfile.constructFromFHIR(result)
        }
      }))

    return request$;
  }

  //
  // updateUserProfile(userProfile: UserProfile): Observable<FhirResource> {
  //
  // }

  checkIfUserEmailExists(email): Observable<boolean> {
    return this.fhirClient.search("Practitioner", `?telecom=${email}`, true).pipe(
      map((results: FhirResource[] | Bundle) => {
        return (results as FhirResource[])?.length !== 0
      }),
      single()
    );
  }

  getUserProfileImage(id: string) {
    return this.fhirClient.search("DocumentReference", `?subject=Practitioner/${id}`, true).pipe(
      map((results: FhirResource[] | Bundle) => {
        return (results as FhirResource[])?.length === 0 ? null :
          results[0]
      })
    )
  }
}
