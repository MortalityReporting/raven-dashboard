import {Injectable} from '@angular/core';
import {map, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DecedentService} from "./decedent.service";
import {
  Autopsy,
  CaseSummary,
  CauseAndManner,
  CauseOfDeathPart1,
  CauseOfDeathPart2,
  Circumstances,
  Demographics,
  Jurisdiction
} from "../model/record-models/case.summary";
import {Author, CaseHeader} from "../model/record-models/case.header";
import {TrackingNumber} from "../model/mdi/tracking.number";
import {TerminologyHandlerService} from "./terminology-handler.service";
import {
  Loc_death,
  Loc_injury,
  Obs_CauseOfDeathPart1,
  Obs_CauseOfDeathPart2,
  Obs_DeathDate,
  Obs_DecedentPregnancy,
  Obs_HowDeathInjuryOccurred,
  Obs_MannerOfDeath,
  Obs_TobaccoUseContributedToDeath,
} from "../model/mdi/profile.list"
import {FhirResourceProviderService} from "./fhir-resource-provider.service";
import {Address} from "../model/fhir/types/address";
import {EnvironmentHandlerService} from "./environment-handler.service";
import {FhirHelperService} from "./fhir/fhir-helper.service";
import {BundleHelperService} from "./fhir/bundle-helper.service";
import {TrackingNumberType} from "../model/tracking.number.type";
import {ToxRecordStub} from "../model/record-models/toxRecordStub";

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

  private relatedToxicology = new Subject<any>();
  relatedToxicology$ = this.relatedToxicology.asObservable();

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

  setRelatedToxicology(searchResultBundle){
    this.relatedToxicology.next(searchResultBundle);
  }

  clearObservablesAndCashedData(){
    this.setCurrentCompositionResource(null);
    this.setCurrentDocumentBundle(null);
    this.setCaseHeader(null);
    this.setPatienceResource(null);
    this.setCaseSummary(null);
    this.setDocumentBundle(null);
    this.setRelatedToxicology(null);
  }

  constructor(
    private http: HttpClient,
    private fhirResourceProvider: FhirResourceProviderService,
    private decedentService: DecedentService,
    private terminologyService: TerminologyHandlerService,
    private environmentHandler: EnvironmentHandlerService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService
  ) {}

  getDocumentBundle(compositionId: string) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document").pipe(
      map((documentBundle: any) => {
        this.currentDocumentBundle = documentBundle;
        let compositionResource = this.bundleHelper.findResourceByFullUrl(documentBundle, "Composition/" + compositionId);
        this.currentCompositionResource = compositionResource;
        this.subjectId = compositionResource.subject.reference
        let patientResource = this.bundleHelper.findResourceByFullUrl(documentBundle, this.subjectId);
        this.patientResource.next(patientResource);
        this.caseHeader.next(this.createCaseHeader(documentBundle, patientResource, compositionResource));
        this.caseSummary.next(this.createCaseSummary(documentBundle, patientResource, compositionResource));
        this.fhirResourceProvider.setCompositionId(compositionId);
        this.fhirResourceProvider.setSelectedFhirResource(documentBundle);
        return documentBundle;
      })
    );
  }

  getRawDocumentBundle(compositionId: string) {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "Composition/" + compositionId + "/$document");
  }

  getRelatedToxicologyReports(mdiCaseNumber: string): any {
    return this.http.get(this.environmentHandler.getFhirServerBaseURL() + "DiagnosticReport?mdi-case-number=" + mdiCaseNumber)
      .pipe(
        map((resultBundle: any) => {
          console.log(resultBundle)
          let toxRecordList = [];
          resultBundle?.entry?.forEach((bec:any) => {
            const diagnosticReport = bec.resource;
            let toxRecordStub = new ToxRecordStub();
            toxRecordStub.date = diagnosticReport.issued.split("T")[0] || undefined;
            toxRecordStub.mdiCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport);
            toxRecordStub.mdiCaseSystem = this.fhirHelper.getTrackingNumberSystem(diagnosticReport);
            toxRecordStub.toxCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
            toxRecordStub.toxCaseSystem = this.fhirHelper.getTrackingNumberSystem(diagnosticReport, TrackingNumberType.Tox);
            console.log(toxRecordStub)
            toxRecordList.push(toxRecordStub)
          });
          return toxRecordList;
      })
    );
  }

  // -------------------------
  // Case Header Functions
  // -------------------------

  createCaseHeader(documentBundle: any, patientResource: any, compositionResource: any): CaseHeader {

    let caseHeader = new CaseHeader();
    caseHeader.fullName = this.fhirHelper.getPatientOfficialName(patientResource);
    let genderString = patientResource.gender || this.defaultString;
    caseHeader.gender = genderString.substring(0,1).toUpperCase() + genderString.substring(1);
    let deathDateResource = this.bundleHelper.findResourceByProfileName(documentBundle, Obs_DeathDate);
    let splitDateTime = deathDateResource?.valueDateTime?.split("T") || []; //TODO: Add more handling to this for other forms of dateTime?
    caseHeader.deathDate = splitDateTime[0] || this.defaultString;
    caseHeader.deathTime = splitDateTime[1] || this.defaultString;
    caseHeader.trackingNumbers = this.getTrackingNumbers(compositionResource);
    caseHeader.mdiCaseNumber = new TrackingNumber()
    caseHeader.mdiCaseNumber.value = this.fhirHelper.getTrackingNumber(compositionResource, TrackingNumberType.Mdi) || "Unknown";
    caseHeader.mdiCaseNumber.system = this.fhirHelper.getTrackingNumberSystem(compositionResource, TrackingNumberType.Mdi) || "Unknown";

    compositionResource.author?.map(( ref: any ) => {

      let practitioner = this.bundleHelper.findResourceByFullUrl(documentBundle, ref.reference );

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
    summary.compositionId = compositionResource?.id || '';
    return summary;
  }

  generateDemographics(documentBundle: any, compositionResource: any, patientResource: any): Demographics {
    let demographics: Demographics = new Demographics();

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

    let deathLocationResource = this.bundleHelper.findResourceByProfileName(documentBundle, Loc_death);
    let injuryLocationResource = this.bundleHelper.findResourceByProfileName(documentBundle, Loc_injury);

    circumstances.deathLocation = deathLocationResource?.name || this.defaultString;
    circumstances.injuryLocation = injuryLocationResource?.name || this.defaultString;

    circumstances.pregnancy = this.bundleHelper.findResourceByProfileName(documentBundle, Obs_DecedentPregnancy)?.valueCodeableConcept?.coding[0]?.display || this.defaultString; // TODO: Missing data, once available fix.
    circumstances.tobaccoUseContributed = this.bundleHelper.findResourceByProfileName(documentBundle, Obs_TobaccoUseContributedToDeath)?.valueCodeableConcept?.coding[0]?.display || this.defaultString; // TODO: Missing data, once available fix.

    return circumstances;
  }

  generateJurisdiction(documentBundle: any, compositionResource: any): Jurisdiction {

    let jurisdiction: Jurisdiction = new Jurisdiction();
    let jurisdictionSection = this.getSection(compositionResource, "jurisdiction");
    let observation = this.findJurisdictionObservation(documentBundle, compositionResource, jurisdictionSection);

    let typeOfDeathLocationComponent = this.fhirHelper.findObservationComponentByCode(observation, "58332-8");
    let pronouncedDateTimeComponent = this.fhirHelper.findObservationComponentByCode(observation, "80616-6");

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
      let observation = this.bundleHelper.findResourceByFullUrl(documentBundle, entry.reference);

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
            console.log(observation)
            causeAndManner.howDeathInjuryOccurred = observation.valueCodeableConcept?.text || this.defaultString;

            let placeOfInjuryComponent = this.fhirHelper.findObservationComponentByCode(observation, "69450-5");
            causeAndManner.placeOfInjury = placeOfInjuryComponent?.valueCodeableConcept?.text || this.defaultString;

            let workInjuryIndicatorComponent = this.fhirHelper.findObservationComponentByCode(observation, "69444-8");
            let workInjuryIndicatorValue = workInjuryIndicatorComponent?.valueCodeableConcept;
            causeAndManner.workInjuryIndicator = workInjuryIndicatorValue?.text || workInjuryIndicatorValue?.coding?.[0]?.display || workInjuryIndicatorValue?.coding?.[0]?.code || this.defaultString;

            let transportationRoleComponent = this.fhirHelper.findObservationComponentByCode(observation, "69451-3");
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
    let observation = this.bundleHelper.findResourcesByProfileName(documentBundle, "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-autopsy-performed-indicator")[0];
    let performedValue = observation?.valueCodeableConcept;
    autopsy.performed = performedValue?.text || performedValue?.coding?.[0]?.display || performedValue?.coding?.[0]?.code || this.defaultString;

    let availableComponent = this.fhirHelper.findObservationComponentByCode(observation, "69436-4");
    let availableValue = availableComponent?.valueCodeableConcept;
    autopsy.resultsAvailable = availableValue?.text || availableValue?.coding?.[0]?.display || availableValue?.coding?.[0]?.code || this.defaultString;

    return autopsy;
  }

  findJurisdictionObservation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, jurisdictionSection: any): any {
    let id = (jurisdictionSection?.entry?.find((entry: any) => entry.reference.startsWith("Observation")))?.reference || undefined;
    return this.bundleHelper.findResourceByFullUrl(documentBundle, id);
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

    let trackingNumbers = [];

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

  // Get SSN from Patient Identifier
  getSocialSecurityNumber(patientResource: any): string {
    let identifierList = patientResource.identifier || [];
    let ssnIdentifier = (identifierList.find((identifier: any) => identifier.system === "http://hl7.org/fhir/sid/us-ssn"));
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
    return this.bundleHelper.findResourceByFullUrl(this.currentDocumentBundle, this.subjectId);
  }

  getCertifier(): any {
    let certifierId = this.currentCompositionResource?.author?.[0]?.reference;
    console.log(certifierId);
    let test = this.bundleHelper.findResourceByFullUrl(this.currentDocumentBundle, certifierId);
    console.log(test)
    return test;
  }

  // TODO: REFACTOR DIRECTIVE AND REMOVE THIS FUNCTION
  findResourceByProfileNamePassThrough(profile) {
    return this.bundleHelper.findResourceByProfileName(this.currentDocumentBundle, profile);
  }

}
