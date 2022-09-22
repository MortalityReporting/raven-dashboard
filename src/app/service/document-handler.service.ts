import {Injectable} from '@angular/core';
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "./decedent.service";
import {CaseSummary, CauseAndManner, CauseOfDeathPart1, CauseOfDeathCondition, Circumstances, Jurisdiction, Demographics, UsualWork, Interval} from "../model/case-summary-models/case.summary";
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
  List_CauseOfDeathPathway,
} from "../model/mdi/profile.list"
import {FhirResourceProviderService} from "./fhir-resource-provider.service";
import {FhirResource} from "../model/fhir/fhir.resource";

@Injectable({
  providedIn: 'root'
})
export class DocumentHandlerService {

  private subjectId: string;
  private defaultString: string = "VALUE NOT FOUND";

  // TODO: Refactor this in conjunction with directive.
  private currentDocumentBundle: any;
  private currentCompositionResource: any;

  private caseHeader = new Subject<CaseHeader>();
  caseHeader$ = this.caseHeader.asObservable();

  private caseSummary = new Subject<CaseSummary>();
  caseSummary$ = this.caseSummary.asObservable();

  private patientResource = new Subject<any>();
  patientResource$ = this.patientResource.asObservable();

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

    let authorRefs = compositionResource.author;

    authorRefs.map(( ref: any ) => {

      let practitioner = this.findResourceById(documentBundle, ref.reference );

      let author = new Author();

      author.license = practitioner.identifier[0].value;
      author.familyName = practitioner.name[0].family;
      author.givenName = practitioner.name[0].given;
      author.phoneNumber = practitioner.telecom[0].value;
      author.line = practitioner.address[0].line[0];
      author.city = practitioner.address[0].city;
      author.state = practitioner.address[0].state;
      author.postalCode = practitioner.address[0].postalCode;

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
    return summary;
  }

  generateDemographics(documentBundle: any, compositionResource: any, patientResource: any): Demographics {
    let demographics: Demographics = new Demographics();
    
    // Setup Basic Demographics from Patient Resource Directly
    demographics.aliases = patientResource.name || this.defaultString;
    demographics.gender = patientResource.gender || this.defaultString;
    demographics.birthDate = patientResource.birthDate || this.defaultString;
    demographics.maritalStatus = patientResource.maritalStatus || this.defaultString;

    // Setup Identifiers
    demographics.ssn = this.getSocialSecurityNumber(patientResource);
    demographics.identifiers = patientResource.identifier;

    // Handle Extensions
    let extensions = patientResource.extension;
    demographics.race = this.getDecedentRaceText(extensions);
    demographics.ethnicity = this.getDecedentEthnicityText(extensions);

    // TODO: Add handling for ODH USual Work and Other Identifiers (missing data)

    let demographicsSection = this.getSection(compositionResource, "demographics");

    if (demographicsSection != null) {
      
      demographicsSection.entry.map(( entry: any ) => {

        let observation = this.findResourceById(documentBundle, entry.reference );
  
        demographics.usualWork.push( new UsualWork( observation?.valueCodeableConcept?.text, observation?.component[0].valueCodeableConcept.text ));
      });  
    }

    return demographics;
  }

  generateCircumstances(documentBundle: any, compositionResource: any): Circumstances {
    let circumstances: Circumstances = new Circumstances();
    let circumstancesSection = this.getSection(compositionResource, "circumstances");

    let deathLocationResource = this.findDeathLocation(documentBundle, compositionResource, circumstancesSection);
    circumstances.deathLocation = deathLocationResource?.name || this.defaultString;

    circumstances.workInjury = this.findResourceByProfileName(documentBundle, Obs_DeathInjuryEventOccurredAtWork)?.valueCodeableConcept?.coding[0]?.display || this.defaultString; // TODO: Missing data, once available fix.
    circumstances.pregnancy = this.findResourceByProfileName(documentBundle, Obs_DecedentPregnancy)?.valueCodeableConcept?.coding[0]?.display || this.defaultString; // TODO: Missing data, once available fix.
    circumstances.tobaccoUseContributed = this.findResourceByProfileName(documentBundle, Obs_TobaccoUseContributedToDeath)?.valueCodeableConcept?.coding[0]?.display || this.defaultString;; // TODO: Missing data, once available fix.

    return circumstances;
  }

  generateJurisdiction(documentBundle: any, compositionResource: any): Jurisdiction {

    let jurisdiction: Jurisdiction = new Jurisdiction();
    let jurisdictionSection = this.getSection(compositionResource, "jurisdiction");

    let observation = this.findJurisdictionObservation(documentBundle, compositionResource, jurisdictionSection);

    jurisdiction.typeOfDeathLocation = this.defaultString;
    jurisdiction.establishmentApproach = this.defaultString;
        
    let dateTime = observation?.effectiveDateTime?.replace( "T", " " ) || this.defaultString;
    jurisdiction.deathDateTime = dateTime;
    jurisdiction.pronouncedDateTime = observation?.component?.valueDateTime || this.defaultString;

    return jurisdiction;
  }

  generateCauseAndManner(documentBundle: any, compositionResource: any): CauseAndManner {
    
    let causeAndManner: CauseAndManner = new CauseAndManner();
    
    let causeAndMannerSection = compositionResource.section.find((section: any) => section.code.coding.some((coding: any) => coding.code === "cause-manner"));    

    if (causeAndMannerSection != null) 
    {      
      causeAndMannerSection.entry.map(( entry: any) => 
      {
        let observation = this.findResourceById(documentBundle, entry.reference );
  
        if (observation != null) 
        {
          let length = observation.meta?.profile?.length || 0;

          if (length > 0)
          {
            let profile = observation.meta.profile[0];

            if (profile == Obs_CauseOfDeathPart1) 
            {
              let causeOfDeathPart1 = new CauseOfDeathPart1();
      
              observation.component?.map(( entry: any ) => 
              {
                if (entry.valueString != null) {
                  causeOfDeathPart1.interval = entry.valueString;
                }
              })
        
              causeOfDeathPart1.event = observation.valueCodeableConcept?.text || undefined;
        
              causeAndManner.causeOfDeathPart1.push( causeOfDeathPart1 );  
            }
            else if (profile == Obs_CauseOfDeathPart2)
            {
              causeAndManner.causeOfDeathPart2.push( observation.valueCodeableConcept?.text || this.defaultString );
            }              
            else if (profile == Obs_MannerOfDeath)
            {
              let coding = observation.valueCodeableConcept?.coding;

              if (coding != null && coding.length > 0)
              {
                causeAndManner.mannerOfDeath = coding[0]?.display
              }
            }              
            else if (profile == Obs_HowDeathInjuryOccurred)
            {
              causeAndManner.howDeathInjuryOccurred =observation.valueString || this.defaultString;
            }
          }
        }
      });  
    }

    return causeAndManner;
  }

  // -------------------------
  // Find and Filter Functions
  // -------------------------

  // This function should be used whenever possible to go off of absolute references to the full URL within the Document Bundle.
  findResourceById(documentBundle: any = this.currentDocumentBundle, resourceId: string): any {
    return (documentBundle.entry.find((entry: any) => entry.fullUrl === resourceId))?.resource || undefined;
  }

  // For singleton profiles, this function can be used to find the resource by the profile name. ID should be preferred whenever available.
  findResourceByProfileName(documentBundle: any = this.currentDocumentBundle, profileName: string): any {
    return documentBundle.entry.find((entry: any) => entry.resource.meta.profile.includes(profileName))?.resource || undefined;
  }

  // Find Death Location Resource (US Core Location Profile) through the Composition.section reference.
  findDeathLocation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, circumstancesSection: any): any {
    let deathLocationResourceId = (circumstancesSection?.entry?.find((entry: any) => entry.reference.startsWith("Location")))?.reference || undefined;
    // TODO: Add handling for reference from death date?
    return this.findResourceById(documentBundle, deathLocationResourceId);
  }

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

    trackingNumberExtensions.map(( item: any ) => {

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

  getCurrentSubjectResource(): any {
    return this.findResourceById(undefined, this.subjectId);
  }

}
