import {Inject, Injectable} from '@angular/core';
import {combineLatest, map, mergeMap, Observable, skipWhile} from "rxjs";
import {
  Autopsy,
  CaseSummary,
  CauseAndManner,
  CauseOfDeathPart1,
  CauseOfDeathPart2,
  Circumstances,
  Demographics,
  Jurisdiction
} from "../models/case.summary";
import {Author, CaseHeader} from "../models/case.header";
import {
  Address,
  BundleHelperService,
  CodeableConcept,
  FhirClientService,
  FhirHelperService,
  TerminologyHandlerService
} from "../../fhir-util";
import {ToxRecordStub} from "../models/tox-record-stub";
import {FHIRProfileConstants} from "../../../providers/fhir-profile-constants";
import {TrackingNumberExtension, TrackingNumberType} from "../../fhir-mdi-library";
import {MdiToEdrsRecord} from "../models/mdiToEdrsRecord";

@Injectable({
  providedIn: 'root'
})
export class MdiToEdrsDocumentHandlerService {

  public defaultString: string = "VALUE NOT FOUND";

  // TODO: Refactor this in conjunction with directives.
  private currentDocumentBundle: any;
  private currentCompositionResource: any;

  constructor(
    private terminologyService: TerminologyHandlerService,
    private fhirHelper: FhirHelperService,
    private bundleHelper: BundleHelperService,
    private fhirClient: FhirClientService,
    @Inject('fhirProfiles') public fhirProfiles: FHIRProfileConstants
  ) {}

  setDocumentBundle(documentBundle){
    this.currentDocumentBundle = documentBundle;
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
    this.setDocumentBundle(null);
  }

  getRecord(subjectId: string): Observable<any> {
    const composition$ = this.fetchComposition(subjectId);
    const documentBundle$ = composition$.pipe(
      mergeMap((composition: any) => {
        return this.fetchDocumentBundle(composition?.['id']);
      })
    );
    const relatedToxicology$ = composition$.pipe(
      mergeMap(composition => {
        const mdiCaseNumber = this.fhirHelper.getTrackingNumber(composition);
        return this.getRelatedToxicologyReports(mdiCaseNumber);
      }));
    return combineLatest([composition$, documentBundle$, relatedToxicology$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      map(combinedResults => {
        const composition = combinedResults[0];
        const mdiCaseNumber = this.fhirHelper.getTrackingNumber(composition);
        const documentBundle = combinedResults[1];
        const relatedToxicology = combinedResults[2];
        const patient = this.bundleHelper.findSubjectInBundle(composition, documentBundle);
        const caseHeader = this.createCaseHeader(documentBundle, patient, composition);
        const caseSummary = this.createCaseSummary(documentBundle, patient, composition);
        const record = new MdiToEdrsRecord(
          caseHeader,
          caseSummary,
          composition['id'],
          mdiCaseNumber,
          documentBundle,
          relatedToxicology);
        return record;
      }))
  }

  private fetchComposition(subjectId: string): Observable<any> {
    return this.fhirClient.search(`Composition`,`?subject=${subjectId}`, true)
      .pipe(map(
        searchList => searchList[0]));
  }
  private fetchDocumentBundle(compositionId: string): Observable<any> {
    return this.fhirClient.read("Composition", `${compositionId}/$document`);
  }

  /**
   * Get a summarized list of tox-to-mdi records (Toxicology Reports) related to a particular mdi-to-edrs document.
   *
   * @param {string} mdiCaseNumber the MDI tracking number for a mdi-to-edrs document.
   * @returns {Observable<ToxRecordStub[]>} an Observable of an array of ToxRecordStub objects.
   **/
  getRelatedToxicologyReports(mdiCaseNumber: string): Observable<ToxRecordStub[]> {
    return this.fhirClient.search("DiagnosticReport", `?tracking-number=${mdiCaseNumber}`).pipe(
        map((resultBundle: any) => {
          let toxRecordList = [];
          resultBundle?.entry?.forEach((bec:any) => {
            const diagnosticReport = bec.resource;
            let toxRecordStub = new ToxRecordStub();
            toxRecordStub.date = diagnosticReport?.issued?.split("T")[0] ?? undefined;
            toxRecordStub.mdiCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport);
            toxRecordStub.mdiCaseSystem = this.fhirHelper.getTrackingNumberSystem(diagnosticReport);
            toxRecordStub.toxCaseNumber = this.fhirHelper.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
            toxRecordStub.toxCaseSystem = this.fhirHelper.getTrackingNumberSystem(diagnosticReport, TrackingNumberType.Tox);
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
    caseHeader.fullName = this.fhirHelper.getOfficialName(patientResource);
    let genderString = patientResource.gender || this.defaultString;
    caseHeader.gender = genderString.substring(0,1).toUpperCase() + genderString.substring(1);
    let deathDateResource = this.bundleHelper.findResourceByProfileName(documentBundle, this.fhirProfiles.VRDR.Obs_DeathDate);
    caseHeader.deathDateTime = deathDateResource?.valueDateTime || this.defaultString;
    caseHeader.trackingNumbers = this.getTrackingNumbers(compositionResource);
    caseHeader.mdiCaseNumber = new TrackingNumberExtension()
    caseHeader.mdiCaseNumber.value = this.fhirHelper.getTrackingNumber(compositionResource, TrackingNumberType.Mdi) || "Unknown";
    caseHeader.mdiCaseNumber.system = this.fhirHelper.getTrackingNumberSystem(compositionResource, TrackingNumberType.Mdi) || "Unknown";

    compositionResource.author?.map(( ref: any ) => {
      // TODO: Refactor this to handle missing authors
      let practitioner = this.bundleHelper.findResourceByFullUrl(documentBundle, ref.reference );

      let author = new Author();

      // TODO: Do not assume that all address items exist just because address exists
      author.license = practitioner?.identifier != null ? practitioner.identifier[0].value : undefined;
      author.familyName = practitioner?.name[0].family;
      author.givenName = practitioner?.name[0].given;
      author.phoneNumber = practitioner?.telecom != null ? practitioner.telecom[0].value : undefined;
      author.line = practitioner?.address != null ? practitioner.address[0].line[0] : undefined;
      author.city = practitioner?.address != null ? practitioner.address[0].city : undefined;
      author.state = practitioner?.address != null ? practitioner.address[0].state : undefined;
      author.postalCode = practitioner?.address != null ? practitioner.address[0].postalCode : undefined;
      author.resource = practitioner;

      caseHeader.authors.push( author );
    });

    return caseHeader;
  }

  // -------------------------
  // Case Summary Section Functions
  // -------------------------

  createCaseSummary(documentBundle: any, patientResource: any, compositionResource: any): CaseSummary {
    let summary: CaseSummary = new CaseSummary();
    summary.demographics = this.generateDemographics(patientResource);
    summary.circumstances = this.generateCircumstances(documentBundle);
    summary.jurisdiction = this.generateJurisdiction(documentBundle, compositionResource);
    summary.causeAndManner = this.generateCauseAndManner(documentBundle, compositionResource);
    summary.examAndAutopsy = this.generateExamAndAutopsy(documentBundle, compositionResource);
    summary.compositionId = compositionResource?.id || '';

    summary.documentBundleResource = documentBundle;

    const certifierId = this.currentCompositionResource?.author?.[0]?.reference;
    summary.certifierResource = this.bundleHelper.findResourceByFullUrl(documentBundle, certifierId);

    return summary;
  }

  generateDemographics(patientResource: any): Demographics {
    let demographics: Demographics = new Demographics();

    demographics.patientResource = patientResource;

    // Setup Basic Demographics from Patient Resource Directly
    demographics.aliases = patientResource.name || this.defaultString;
    demographics.gender = patientResource.gender || this.defaultString;
    demographics.birthDate = patientResource.birthDate || this.defaultString;
    demographics.maritalStatus = patientResource.maritalStatus || this.defaultString;

    demographics.address = new Address();
    demographics.address.line1 = patientResource.address?.[0]?.line?.[0] || this.defaultString;
    demographics.address.line2 = patientResource.address?.[0]?.line?.[1] || this.defaultString;
    // In a lot of cases an address can have a line 1 only and not have a line 2
    // In such cases we should not render the default string.
    if(demographics.address.line1 !== this.defaultString && demographics.address.line2 === this.defaultString){
      demographics.address.line2 = '';
    }
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

  generateCircumstances(documentBundle: any): Circumstances {
    let circumstances: Circumstances = new Circumstances();

    let deathLocationResource = this.bundleHelper.findResourceByProfileName(documentBundle, this.fhirProfiles.VRDR.Loc_DeathLocation);
    let injuryLocationResource = this.bundleHelper.findResourceByProfileName(documentBundle, this.fhirProfiles.VRDR.Loc_InjuryLocation);

    circumstances.deathLocation = deathLocationResource?.name ?? this.defaultString;
    circumstances.injuryLocation = injuryLocationResource?.name ?? this.defaultString;

    const pregnancyResource = this.bundleHelper.findResourceByProfileName(documentBundle, this.fhirProfiles.VRDR.Obs_DecedentPregnancyStatus);
    circumstances.pregnancy = pregnancyResource?.valueCodeableConcept?.coding[0]?.display || this.defaultString;

    const tobaccoUseResource = this.bundleHelper.findResourceByProfileName(documentBundle, this.fhirProfiles.VRDR.Obs_TobaccoUseContributedToDeath);
    const tobaccoUseCc: CodeableConcept = new CodeableConcept(tobaccoUseResource?.valueCodeableConcept);
    circumstances.tobaccoUseContributed = tobaccoUseCc?.toString() ?? this.defaultString;

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
    jurisdiction.deathDateTime = observation?.valueDateTime?.replace( "T", " " ) || this.defaultString;

    // Search for component by code. 80616-6
    jurisdiction.pronouncedDateTime = pronouncedDateTimeComponent?.valueDateTime?.replace( "T", " " ) || this.defaultString;

    return jurisdiction;
  }

  generateCauseAndManner(documentBundle: any, compositionResource: any): CauseAndManner {
    let causeAndManner: CauseAndManner = new CauseAndManner();
    let causeAndMannerSection = compositionResource?.section?.find(
      (section: any) => section?.code?.coding?.some((coding: any) => coding?.code === "cause-manner"));

    causeAndMannerSection?.entry?.map(( entry: any) =>
    {
      let observation = this.bundleHelper.findResourceByFullUrl(documentBundle, entry.reference);

      if (observation != null) {
        let length = observation.meta?.profile?.length || 0;
        if (length > 0) {
          let profile = observation.meta.profile[0];
          if (profile === this.fhirProfiles.MdiToEdrs.Obs_CauseOfDeathPart1) {
            let causeOfDeathPart1 = new CauseOfDeathPart1();
            observation.component?.map(( entry: any ) => {
              if (entry.valueString != null) {
                causeOfDeathPart1.interval = entry.valueString;
              }
            })
            causeOfDeathPart1.id = entry.reference;
            causeOfDeathPart1.event = observation.valueCodeableConcept?.text || undefined;
            causeAndManner.causeOfDeathPart1.push( causeOfDeathPart1 );
          }
          else if (profile === this.fhirProfiles.VRDR.Obs_CauseOfDeathPart2) {
            let causeOfDeathPart2 = new CauseOfDeathPart2();
            causeOfDeathPart2.id = entry.reference;
            causeOfDeathPart2.value = observation.valueCodeableConcept?.text || this.defaultString;
            causeAndManner.causeOfDeathPart2.push( causeOfDeathPart2 );
          }
          else if (profile === this.fhirProfiles.VRDR.Obs_MannerOfDeath) {
            let coding = observation.valueCodeableConcept?.coding;
            if (coding != null && coding.length > 0) {
              causeAndManner.mannerOfDeath = coding[0]?.display
            }
          }
          else if (profile === this.fhirProfiles.VRDR.Obs_InjuryIncident) {
            causeAndManner.howDeathInjuryOccurred = observation.valueCodeableConcept?.text || this.defaultString;
            let placeOfInjuryComponent = this.fhirHelper.findObservationComponentByCode(observation, "69450-5");
            causeAndManner.placeOfInjury = placeOfInjuryComponent?.valueCodeableConcept?.text || this.defaultString;
            let workInjuryIndicatorComponent = this.fhirHelper.findObservationComponentByCode(observation, "69444-8");
            let workInjuryIndicatorValue = workInjuryIndicatorComponent?.valueCodeableConcept;
            causeAndManner.workInjuryIndicator = workInjuryIndicatorValue?.text || workInjuryIndicatorValue?.coding?.[0]?.display || workInjuryIndicatorValue?.coding?.[0]?.code || this.defaultString;
            let transportationRoleComponent = this.fhirHelper.findObservationComponentByCode(observation, "69451-3");
            let transportationRoleValue = transportationRoleComponent?.valueCodeableConcept;
            causeAndManner.transportationRole = transportationRoleValue?.text || transportationRoleValue?.coding?.[0]?.display || transportationRoleValue?.coding?.[0]?.code || this.defaultString;

            if (observation?.effectiveDateTime) {
              causeAndManner.injuryDateTime = observation?.effectiveDateTime?.replace( "T", " " ) || this.defaultString;
            }
            else if (observation?._effectiveDateTime != null) {
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
    let observation = this.bundleHelper.findResourcesByProfileName(documentBundle, this.fhirProfiles.VRCL.Obs_AutopsyPerformed)[0];
    let performedValue = observation?.valueCodeableConcept;
    autopsy.performed = performedValue?.text || performedValue?.coding?.[0]?.display || performedValue?.coding?.[0]?.code || this.defaultString;

    let availableComponent = this.fhirHelper.findObservationComponentByCode(observation, "69436-4"); // TODO: Add to constants.
    let availableValue = availableComponent?.valueCodeableConcept;
    autopsy.resultsAvailable = availableValue?.text || availableValue?.coding?.[0]?.display || availableValue?.coding?.[0]?.code || this.defaultString;

    let examAutopsySection = compositionResource.section.find(section => section.code.coding[0].code === "exam-autopsy"); // TODO: Add to constants.
    let autopsyLocationReference = examAutopsySection.entry.find(entry => entry.reference.startsWith("Location")) // TODO: This is bad handling.
    autopsyLocationReference = autopsyLocationReference?.reference;
    let autopsyLocationResource = this.bundleHelper.findResourceByFullUrl(documentBundle, autopsyLocationReference);
    autopsy.autopsyLocation = autopsyLocationResource?.name || this.defaultString;
    autopsy.autopsyLocationResource = autopsyLocationResource;

    return autopsy;
  }

  findJurisdictionObservation(documentBundle: any = this.currentDocumentBundle, compositionResource: any, jurisdictionSection: any): any {
    let id = (jurisdictionSection?.entry?.find((entry: any) => entry.reference.startsWith("Observation")))?.reference || undefined;
    return this.bundleHelper.findResourceByFullUrl(documentBundle, id);
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
  getTrackingNumbers(compositionResource: any): TrackingNumberExtension[] {
    let extensions = compositionResource.extension;
    let trackingNumberExtensions = extensions?.filter((extension: any) => extension.url === "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number");

    let trackingNumbers = [];

    trackingNumberExtensions?.map(( item: any ) => {

      let trackingNumber = new TrackingNumberExtension();

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
    if (!extensions) return "Unknown";
    else {
      let raceExtension = this.findExtensionByUrl(extensions, "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
      let textExtension = this.findExtensionByUrl(raceExtension?.extension, "text");
      return textExtension?.valueString || "Unknown";
    }
  }

  // Get Ethnicity Text from Patient Extension
  getDecedentEthnicityText(extensions: any): string {
    if (!extensions) return "Unknown";
    else {
      let ethnicityExtension = this.findExtensionByUrl(extensions, "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
      let textExtension = this.findExtensionByUrl(ethnicityExtension?.extension, "text");
      return textExtension?.valueString || "Unknown";
    }
  }

  private findExtensionByUrl(extensions: any[], url: string): any {
    return extensions?.find((extension: any) => extension?.url === url);
  }

}
