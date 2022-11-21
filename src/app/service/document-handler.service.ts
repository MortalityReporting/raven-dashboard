import {Injectable} from '@angular/core';
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "./decedent.service";
import {
  CaseSummary,
  CauseAndManner,
  CauseOfDeathPart1,
  CauseOfDeathPart2,
  Circumstances,
  Jurisdiction,
  Demographics,
  UsualWork,
  Autopsy
} from "../model/case-summary-models/case.summary";
import {Author, CaseHeader} from "../model/case-summary-models/case.header";
import {TrackingNumber} from "../model/mdi/tracking.number";
import {TerminologyHandlerService} from "./terminology-handler.service";
import {
  Obs_DeathDate,
  Obs_DeathInjuryEventOccurredAtWork,
  Obs_DecedentPregnancy,
  Obs_HowDeathInjuryOccurred,
  Obs_MannerOfDeath,
  Obs_TobaccoUseContributedToDeath,
  Obs_CauseOfDeathPart1,
  Obs_CauseOfDeathPart2,
  Loc_death,
  Loc_injury,
} from "../model/mdi/profile.list"
import {FhirResourceProviderService} from "./fhir-resource-provider.service";
import {Address} from "../model/fhir/types/address";

@Injectable({
  providedIn: 'root'
})
export class DocumentHandlerService {

  private subjectId: string;
  public defaultString: string = "VALUE NOT FOUND";

  // TODO: Refactor this in conjunction with directive.
  private currentDocumentBundle: any;
  private currentCompositionResource: any;

  private caseHeader = new Subject<CaseHeader>();
  caseHeader$ = this.caseHeader.asObservable();

  private caseSummary = new Subject<CaseSummary>();
  caseSummary$ = this.caseSummary.asObservable();

  private patientResource = new Subject<any>();
  patientResource$ = this.patientResource.asObservable();

  setDocumentBundle(documentBundle){
    this.currentDocumentBundle = documentBundle;
  }

  setCaseSummary(caseSummary){
    this.caseSummary.next(caseSummary);
  }

  setPatienceResource(patientResource){
    this.patientResource.next(patientResource);
  }

  setCaseHeader(caseHeader){
    this.caseHeader.next(caseHeader);
  }

  setCurrentDocumentBundle(documentBundle){
    this.currentDocumentBundle = documentBundle;
  }

  setCurrentCompositionResource(compositionResource){
    this.currentCompositionResource = compositionResource;
  }

  clearObservablesAndCashedData(){
    this.setCurrentCompositionResource(null);
    this.setCurrentDocumentBundle(null);
    this.setCaseHeader(null);
    this.setPatienceResource(null);
    this.setCaseSummary(null);
    this.setDocumentBundle(null);
  }

  constructor(private http: HttpClient, private fhirResourceProvider: FhirResourceProviderService, private decedentService: DecedentService, private terminologyService: TerminologyHandlerService) {}

  getDocumentBundle(compositionId: string) {
    return this.http.get(this.decedentService.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document").pipe(
      map((documentBundle: any) => {
        this.currentDocumentBundle = documentBundle;
        let compositionResource = this.findResourceById(documentBundle, "Composition/" + compositionId);
        this.currentCompositionResource = compositionResource;
        this.subjectId = compositionResource.subject.reference
        let patientResource = this.findResourceById(documentBundle, this.subjectId);
        this.patientResource.next(patientResource);
        this.caseHeader.next(this.createCaseHeader(documentBundle, patientResource, compositionResource));
        this.caseSummary.next(this.createCaseSummary(documentBundle, patientResource, compositionResource));
        this.fhirResourceProvider.setCompositionId(compositionId);
        this.fhirResourceProvider.setSelectedFhirResource(documentBundle);
      })
    );
  }

  // -------------------------
  // Case Header Functions
  // -------------------------

  createCaseHeader(documentBundle: any, patientResource: any, compositionResource: any): CaseHeader {

    let caseHeader = new CaseHeader();
    caseHeader.fullName = this.getPatientOfficialName(patientResource);
    let genderString = patientResource.gender || this.defaultString;
    caseHeader.gender = genderString.substring(0,1).toUpperCase() + genderString.substring(1);
    let deathDateResource = this.findResourceByProfileName(documentBundle, Obs_DeathDate);
    let splitDateTime = deathDateResource?.valueDateTime?.split("T") || []; //TODO: Add more handling to this for other forms of dateTime?
    caseHeader.deathDate = splitDateTime[0] || this.defaultString;
    caseHeader.deathTime = splitDateTime[1] || this.defaultString;
    caseHeader.trackingNumbers = this.getTrackingNumbers(compositionResource);

    compositionResource.author?.map(( ref: any ) => {

      let practitioner = this.findResourceById(documentBundle, ref.reference );

      let author = new Author();

      author.license = practitioner?.identifier != null ? practitioner.identifier[0].value : undefined;
      author.familyName = practitioner?.name[0].family;
      author.givenName = practitioner?.name[0].given;
      author.phoneNumber = practitioner?.telecom != null ? practitioner.telecom[0].value : undefined;
      author.line = practitioner?.address != null ? practitioner.address[0].line[0] : undefined;
      author.city = practitioner?.address != null ? practitioner.address[0].city : undefined;
      author.state = practitioner?.address != null ? practitioner.address[0].state : undefined;
      author.postalCode = practitioner?.address != null ? practitioner.address[0].postalCode : undefined;

      caseHeader.authors.push( author );
    });

    return caseHeader;
  }

  // -------------------------
  // Case Summary Section Functions
  // -------------------------

  createCaseSummary(documentBundle: any, patientResource: any, compositionResource: any): CaseSummary {
    let summary: CaseSummary = new CaseSummary();
    summary.demographics = this.generateDemographics(documentBundle, compositionResource, patientResource);
    summary.circumstances = this.generateCircumstances(documentBundle, compositionResource);
    summary.jurisdiction = this.generateJurisdiction(documentBundle, compositionResource);
    summary.causeAndManner = this.generateCauseAndManner(documentBundle, compositionResource);
    summary.examAndAutopsy = this.generateExamAndAutopsy(documentBundle, compositionResource);
    return summary;
  }

  generateDemographics(documentBundle: any, compositionResource: any, patientResource: any): Demographics {
    let demographics: Demographics = new Demographics();
    console.log(demographics)

    // Setup Basic Demographics from Patient Resource Directly
    demographics.aliases = patientResource.name || this.defaultString;
    demographics.gender = patientResource.gender || this.defaultString;
    demographics.birthDate = patientResource.birthDate || this.defaultString;
    demographics.maritalStatus = patientResource.maritalStatus || this.defaultString;

    demographics.address = new Address();
    demographics.address.line1 = patientResource.address?.[0]?.line?.[0] || this.defaultString;
    demographics.address.line2 = patientResource.address?.[0]?.line?.[1] || this.defaultString;
    demographics.address.city = patientResource.address?.[0]?.city || this.defaultString;
    demographics.address.state = patientResource.address?.[0]?.state || this.defaultString;
    demographics.address.zip = patientResource.address?.[0]?.postalCode || this.defaultString;
    demographics.address.country = patientResource.address?.[0]?.country || this.defaultString;

    // Setup Identifiers
    demographics.ssn = this.getSocialSecurityNumber(patientResource);
    demographics.identifiers = patientResource.identifier;

    // Handle Extensions
    let extensions = patientResource.extension;
    demographics.race = this.getDecedentRaceText(extensions);
    demographics.ethnicity = this.getDecedentEthnicityText(extensions);

    return demographics;
  }

  generateCircumstances(documentBundle: any, compositionResource: any): Circumstances {
    let circumstances: Circumstances = new Circumstances();
    let circumstancesSection = this.getSection(compositionResource, "circumstances");

    let deathLocationResource = this.findResourceByProfileName(documentBundle, Loc_death);
    let injuryLocationResource = this.findResourceByProfileName(documentBundle, Loc_injury);

    circumstances.deathLocation = deathLocationResource?.name || this.defaultString;
    circumstances.injuryLocation = injuryLocationResource?.name || this.defaultString;

    circumstances.pregnancy = this.findResourceByProfileName(documentBundle, Obs_DecedentPregnancy)?.valueCodeableConcept?.coding[0]?.display || this.defaultString; // TODO: Missing data, once available fix.
    circumstances.tobaccoUseContributed = this.findResourceByProfileName(documentBundle, Obs_TobaccoUseContributedToDeath)?.valueCodeableConcept?.coding[0]?.display || this.defaultString;; // TODO: Missing data, once available fix.

    return circumstances;
  }

  generateJurisdiction(documentBundle: any, compositionResource: any): Jurisdiction {

    let jurisdiction: Jurisdiction = new Jurisdiction();
    let jurisdictionSection = this.getSection(compositionResource, "jurisdiction");
    let observation = this.findJurisdictionObservation(documentBundle, compositionResource, jurisdictionSection);

    let typeOfDeathLocationComponent = this.findObservationComponentByCode(observation, "58332-8");
    let pronouncedDateTimeComponent = this.findObservationComponentByCode(observation, "80616-6");
    
    jurisdiction.typeOfDeathLocation = typeOfDeathLocationComponent?.valueCodeableConcept?.text ||
      typeOfDeathLocationComponent?.valueCodeableConcept?.coding?.[0].display || typeOfDeathLocationComponent?.valueCodeableConcept?.coding?.[0].code || this.defaultString;
    jurisdiction.establishmentApproach = observation?.method?.text || observation?.method?.coding?.[0]?.display || observation?.method?.coding?.[0]?.code || this.defaultString;
    jurisdiction.deathDateTime = observation?.effectiveDateTime?.replace( "T", " " ) || this.defaultString;

    // Search for component by code. 80616-6
    jurisdiction.pronouncedDateTime = pronouncedDateTimeComponent?.valueDateTime || this.defaultString;

    return jurisdiction;
  }

  generateCauseAndManner(documentBundle: any, compositionResource: any): CauseAndManner {

    let causeAndManner: CauseAndManner = new CauseAndManner();

    let causeAndMannerSection = compositionResource.section.find((section: any) => section.code.coding.some((coding: any) => coding.code === "cause-manner"));

    causeAndMannerSection?.entry.map(( entry: any) =>
    {
      let observation = this.findResourceById(documentBundle, entry.reference );

      if (observation != null)
      {
        let length = observation.meta?.profile?.length || 0;

        if (length > 0)
        {
          let profile = observation.meta.profile[0];

          if (profile === Obs_CauseOfDeathPart1)
          {
            let causeOfDeathPart1 = new CauseOfDeathPart1();

            observation.component?.map(( entry: any ) =>
            {
              if (entry.valueString != null) {
                causeOfDeathPart1.interval = entry.valueString;
              }
            })

            causeOfDeathPart1.id = entry.reference;
            causeOfDeathPart1.event = observation.valueCodeableConcept?.text || undefined;

            causeAndManner.causeOfDeathPart1.push( causeOfDeathPart1 );
          }
          else if (profile === Obs_CauseOfDeathPart2)
          {
            let causeOfDeathPart2 = new CauseOfDeathPart2();
            causeOfDeathPart2.id = entry.reference;
            causeOfDeathPart2.value = observation.valueCodeableConcept?.text || this.defaultString;

            causeAndManner.causeOfDeathPart2.push( causeOfDeathPart2 );
          }
          else if (profile === Obs_MannerOfDeath)
          {
            let coding = observation.valueCodeableConcept?.coding;

            if (coding != null && coding.length > 0)
            {
              causeAndManner.mannerOfDeath = coding[0]?.display
            }
          }
          else if (profile === Obs_HowDeathInjuryOccurred)
          {
            causeAndManner.howDeathInjuryOccurred = observation.valueCodeableConcept?.text || this.defaultString;

            let placeOfInjuryComponent = this.findObservationComponentByCode(observation, "69450-5");
            causeAndManner.placeOfInjury = placeOfInjuryComponent?.valueCodeableConcept?.text || this.defaultString;

            let workInjuryIndicatorComponent = this.findObservationComponentByCode(observation, "69444-8");
            let workInjuryIndicatorValue = workInjuryIndicatorComponent?.valueCodeableConcept;
            causeAndManner.workInjuryIndicator = workInjuryIndicatorValue?.text || workInjuryIndicatorValue?.coding?.[0]?.display || workInjuryIndicatorValue?.coding?.[0]?.code || this.defaultString;
                
            let transportationRoleComponent = this.findObservationComponentByCode(observation, "69451-3");
            let transportationRoleValue = transportationRoleComponent?.valueCodeableConcept;
            causeAndManner.transportationRole = transportationRoleValue?.text || transportationRoleValue?.coding?.[0]?.display || transportationRoleValue?.coding?.[0]?.code || this.defaultString;
            
            if (observation._effectiveDateTime != null) 
            {
              let year = 0;
              let month = 0;
              let day = 0;
              let time = "";

              observation._effectiveDateTime.extension[0].extension.map((item: any) => {
                if (item.url.includes("Extension-date-year"))
                {
                  year = item.valueUnsignedInt;
                }
                else if (item.url.includes("Extension-date-month"))
                {
                  month = item.valueUnsignedInt;
                }
                else if (item.url.includes("Extension-date-day"))
                {
                  day = item.valueUnsignedInt;
                }
                else if (item.url.includes("Extension-date-time"))
                {
                  time = item.valueTime;
                }
              })

              causeAndManner.injuryDateTime = year + "-" + month.toString().padStart( 2, "0" ) + "-" + day.toString().padStart( 2, "0" ) + " " + time;
            }
          }
        }
      }
    });

    return causeAndManner;
  }

  generateExamAndAutopsy(documentBundle: any, compositionResource: any): Autopsy {
    let autopsy: Autopsy = new Autopsy();
    // let autopsySection = this.getSection(compositionResource, "exam-autopsy");
    let observation = this.findResourcesByProfileName(documentBundle, "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-autopsy-performed-indicator")[0];
    let performedValue = observation?.valueCodeableConcept;
    autopsy.performed = performedValue?.text || performedValue?.coding?.[0]?.display || performedValue?.coding?.[0]?.code || this.defaultString;

    let availableComponent = this.findObservationComponentByCode(observation, "69436-4");
    let availableValue = availableComponent?.valueCodeableConcept;
    autopsy.resultsAvailable = availableValue?.text || availableValue?.coding?.[0]?.display || availableValue?.coding?.[0]?.code || this.defaultString;

    return autopsy;
  }
  // -------------------------
  // Find and Filter Functions
  // -------------------------

  // This function should be used whenever possible to go off of absolute references to the full URL within the Document Bundle.
  findResourceById(documentBundle: any = this.currentDocumentBundle, resourceId: string): any {
    if(!documentBundle || !documentBundle.entry){
      return null;
    }
    return (documentBundle.entry.find((entry: any) => entry.fullUrl === resourceId))?.resource || undefined;
  }

  findObservationComponentByCode(observation: any, componentCode: string): any {
    if(!observation.component || !componentCode){
      return null;
    }
    return (observation.component.find((component: any) => component.code.coding[0].code === componentCode)) || undefined;
  }

  // For singleton profiles, this function can be used to find the resource by the profile name. ID should be preferred whenever available.
  findResourceByProfileName(documentBundle: any = this.currentDocumentBundle, profileName: string): any {
    try {
      const profile = documentBundle.entry.find((entry: any) => entry.resource.meta.profile.includes(profileName))?.resource;
      return documentBundle.entry.find((entry: any) => entry.resource.meta.profile.includes(profileName))?.resource || undefined;
    } catch(e) {
      return undefined;
    }
  }

  findResourcesByProfileName(documentBundle: any = this.currentDocumentBundle, profileName: string): any[] {
    try {
      let items = [];
      documentBundle.entry.map( (entry: any) => {
        if (entry.resource.meta.profile.includes(profileName)) {
          items.push( entry.resource );
        }
      })
      return items;
    } catch(e) {
      return undefined;
    }
  }

  // // Find Death Location Resource (US Core Location Profile) through the Composition.section reference.
  // findDeathLocation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, circumstancesSection: any): any {
  //   let deathLocationResourceId = (circumstancesSection?.entry?.find((entry: any) => entry.reference.startsWith("Location")))?.reference || undefined;
  //   // TODO: Add handling for reference from death date?
  //   return this.findResourceById(documentBundle, deathLocationResourceId);
  // }
  //
  // findDeathLocation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, circumstancesSection: any): any {
  //   let deathLocationResourceId = (circumstancesSection?.entry?.find((entry: any) => entry.reference.startsWith("Location")))?.reference || undefined;
  //   // TODO: Add handling for reference from death date?
  //   return this.findResourceById(documentBundle, deathLocationResourceId);
  // }

  findJurisdictionObservation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, jurisdictionSection: any): any {
    let id = (jurisdictionSection?.entry?.find((entry: any) => entry.reference.startsWith("Observation")))?.reference || undefined;
    return this.findResourceById(documentBundle, id);
  }

  // Filter Bundle Entries by Patient Resource.
  filterPatientResources(documentBundle: any): any {
    return documentBundle.entry.filter((entry: any) => entry.resource.resourceType === "Patient");
  }

  // Filter Bundle Entries by Observation Resource.
  filterObservationResources(documentBundle: any): any {
    return documentBundle.entry.filter((entry: any) => entry.resource.resourceType === "Observation");
  }

  // -------------------------
  // Get Sections
  // -------------------------

  getSection(compositionResource: any = this.currentCompositionResource, sectionName: string): any {
    // console.log(compositionResource);
    return compositionResource.section.find((section: any) => section.code.coding.some((coding: any) => coding.code === sectionName));
  }

  // -------------------------
  // Helper Functions
  // -------------------------

  // Get Tracking Numbers from Composition Extension
  getTrackingNumbers(compositionResource: any): TrackingNumber[] {
    let extensions = compositionResource.extension;
    let trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");

    let trackingNumbers = new Array();

    trackingNumberExtensions?.map(( item: any ) => {

      let trackingNumber = new TrackingNumber();

      let valueIdentifier = item?.valueIdentifier;
      trackingNumber.value = valueIdentifier?.value || "Tracking Number Not Specified";

      if (valueIdentifier?.type?.text) {
        trackingNumber.type = valueIdentifier.type.text;
      }
      else if (valueIdentifier?.type?.coding[0].code) {
        let code = valueIdentifier.type?.coding[0].code;
        trackingNumber.type = this.terminologyService.mapMdiCodeToDisplay(code);
      }
      else {
        trackingNumber.type = "Unknown Type"
      }

      trackingNumbers.push( trackingNumber );
    });

    return trackingNumbers;
  }

    // Get Tracking Number from Composition Extension
    getTrackingNumber(compositionResource: any): TrackingNumber {
      let trackingNumber = new TrackingNumber();
      let extensions = compositionResource.extension;
      let trackingNumberExtension = extensions?.find((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");
      let valueIdentifier = trackingNumberExtension?.valueIdentifier;
      trackingNumber.value = valueIdentifier?.value || "Tracking Number Not Specified";

      if (valueIdentifier?.type?.text) {
        trackingNumber.type = valueIdentifier.type.text;
      }
      else if (valueIdentifier?.type?.coding[0].code) {
        let code = valueIdentifier.type?.coding[0].code;
        trackingNumber.type = this.terminologyService.mapMdiCodeToDisplay(code);
      }
      else {
        trackingNumber.type = "Unknown Type"
      }
      return trackingNumber;
    }

  // Build a full name from Patient official use name
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

  // Get SSN from Patient Identifier
  getSocialSecurityNumber(patientResource: any): string {
    let identifierList = patientResource.identifier;
    let ssnIdentifier = (identifierList.filter((identifier: any) => identifier.system === "http://hl7.org/fhir/sid/us-ssn"))[0];
    return ssnIdentifier?.value || this.defaultString;
  }

  // Get Race Text from Patient Extension
  getDecedentRaceText(extensions: any): string {
    let raceExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
    let textExtension = raceExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }

  // Get Ethnicity Text from Patient Extension
  getDecedentEthnicityText(extensions: any): string {
    let ethnicityExtension = extensions.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
    let textExtension = ethnicityExtension?.extension?.find((extension: any) => extension.url === "text");
    return textExtension?.valueString || "Unknown";
  }

  getCurrentDocumentBundle(): any {
    return this.currentDocumentBundle;
  }

  getCurrentSubjectResource(): any {
    return this.findResourceById(undefined, this.subjectId);
  }

  getCertifier(): any {
    let certifierId = this.currentCompositionResource?.author?.[0]?.reference;
    console.log(certifierId);
    let test = this.findResourceById(this.currentDocumentBundle, certifierId);
    console.log(test)
    return test;
  }

  getObservationResource(id: any): any {
    return this.findResourceById(undefined, id);
  }

}
