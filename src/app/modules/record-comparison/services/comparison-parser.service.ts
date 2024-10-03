import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {FhirResource} from "../../fhir-util";
import {ComparisonResult} from "../models_new/comparison-result";
import {ComparisonDocumentType, ComparisonFhirType, ComparisonModel} from "../models_new/comparison-model";

@Injectable({
  providedIn: 'root'
})
export class ComparisonParserService {

  constructor() { }

  getComparisonModel(comparisonType: string){
    return of(this.mock_mdiAndEdrsComparson);
  }

  getComparisonRecord(identifier: string) {
    return of(this.mock_mdiAndEdrsRecord);
  }

  getComparisonResult(): Observable<ComparisonResult> {
    const cResult = new ComparisonResult(this.mock_mdiAndEdrsRecord, this.mock_mdiAndEdrsRecord, this.mock_mdiAndEdrsComparson)
    return of(cResult);
  }

  findEntity(bundle: FhirResource, discriminator) {
    if (discriminator["root"]) {
      return bundle;
    }
    else if (discriminator["profile"]) {
      // search by key
      //return bundle?.["entry"]?.[0]?.["resource"];
      const becList: any[] = bundle?.["entry"]
      const entity = becList.find(bec => bec?.["resource"]?.["profile"].includes(discriminator["profile"]))
      return entity;
    }
    else return undefined;
  }

  compareField(userEntity: FhirResource, comparisonEntity: FhirResource, field) {

  }

  private mock_mdiAndEdrsComparson: ComparisonModel = {
    "documentType": ComparisonDocumentType.MDI_AND_EDRS,
    "entities": [
      {
        "entityName": "Bundle",
        "discriminator": {
          "root": true
        },
        "fields": [
          {
            "label": "Bundle Profile",
            "type": ComparisonFhirType.STRING,
            "path": "$.meta.profile.[0]"
          },
          {
            "label": "Bundle Type",
            "type": ComparisonFhirType.CODE,
            "path": "$.type"
          }
        ]
      },
      {
        "entityName": "Composition",
        "discriminator": {
          "profile": "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-and-edrs"
        },
        "fields": [
          {
            "label": "MDI Case Number",
            "specialRule": "trackingNumber(mdi-case-number)"
          },
          {
            "label": "EDRS File Number",
            "specialRule": "trackingNumber(edrs-file-number)"
          }
        ]

      },
      {
        "entityName": "Decedent",
        "discriminator": {
          "profile": "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Patient-vr"
        },
        "fields": [
          {
            "label": "Legal Name",
            "type": ComparisonFhirType.HUMAN_NAME,
            "list": false,
            "path": "$.name",
            "discriminator": {
              "path": "use",
              "value": "official"
            }
          },
          {
            "label": "Gender",
            "type": ComparisonFhirType.STRING,
            "path": "$.gender"
          },
          {
            "label": "Patient's Home Address",
            "type": ComparisonFhirType.ADDRESS,
            "path": "$.address",
            "discriminator": {
              "path": "use",
              "value": "home"
            }
          }
        ]
      }
    ]
  }

  private mock_mdiAndEdrsRecord = {
    "resourceType": "Bundle",
    "id": "9fcdc0ec-f5be-47be-ab94-afb9059e302e",
    "meta": {
      "profile": [
        "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-and-edrs"
      ]
    },
    "identifier": {
      "system": "urn:mdi:raven",
      "value": "22-1234"
    },
    "type": "document",
    "timestamp": "2024-09-30T18:46:49.865+00:00",
    "entry": [
      {
        "fullUrl": "Composition/MDI-DEV-AUG2024-1-MDIAndEDRS-Composition",
        "resource": {
          "resourceType": "Composition",
          "id": "MDI-DEV-AUG2024-1-MDIAndEDRS-Composition",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-and-edrs"
            ]
          },
          "extension": [
            {
              "url": "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number",
              "valueIdentifier": {
                "type": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                      "code": "mdi-case-number",
                      "display": "MDI Case Number"
                    }
                  ]
                },
                "system": "urn:mdi:raven",
                "value": "22-1234"
              }
            },
            {
              "url": "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number",
              "valueIdentifier": {
                "type": {
                  "coding": [
                    {
                      "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                      "code": "edrs-file-number",
                      "display": "EDRS File Number"
                    }
                  ]
                },
                "system": "urn:mdi:raven",
                "value": "22-0001"
              }
            }
          ],
          "identifier": {
            "type": {
              "coding": [
                {
                  "system": "urn:temporary:code",
                  "code": "1000007",
                  "display": "Case Number"
                }
              ]
            },
            "value": "TestIdentifier"
          },
          "status": "preliminary",
          "type": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "86807-5",
                "display": "Death administrative information Document"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "date": "2024-09-10T19:32:02Z",
          "author": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "title": "Raven generated MDI-And-EDRS Document",
          "attester": [
            {
              "mode": "legal",
              "party": {
                "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
              }
            }
          ],
          "section": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                    "code": "jurisdiction"
                  }
                ]
              },
              "entry": [
                {
                  "reference": "Procedure/MDI-DEV-AUG2024-1-Certification"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-DeathDate"
                }
              ]
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                    "code": "circumstances"
                  }
                ]
              },
              "entry": [
                {
                  "reference": "Location/MDI-DEV-AUG2024-1-Death-Location"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-Tobacco"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-Pregnancy"
                },
                {
                  "reference": "Location/MDI-DEV-AUG2024-1-Injury-Location"
                }
              ]
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                    "code": "cause-manner"
                  }
                ]
              },
              "entry": [
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart1-0"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart1-1"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart2-0"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-MannerOfDeath"
                },
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-InjuryIncident"
                }
              ]
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                    "code": "medical-history"
                  }
                ]
              },
              "text": {
                "status": "empty",
                "div": "<div smlnx=\"http://www.w3.org/1999/xhtml\"><p>unavailable</p></div>"
              },
              "emptyReason": {
                "coding": [
                  {
                    "system": "http://terminology.hl7.org/CodeSystem/list-empty-reason",
                    "code": "unavailable",
                    "display": "Unavailable"
                  }
                ]
              }
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-vr-codes",
                    "code": "exam-autopsy"
                  }
                ]
              },
              "entry": [
                {
                  "reference": "Observation/MDI-DEV-AUG2024-1-Autopsy"
                },
                {
                  "reference": "Organization/MDI-DEV-AUG2024-1-Autopsy-Organization"
                }
              ]
            }
          ]
        }
      },
      {
        "fullUrl": "Patient/MDI-DEV-AUG2024-1-Decedent",
        "resource": {
          "resourceType": "Patient",
          "id": "MDI-DEV-AUG2024-1-Decedent",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Patient-vr",
              "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
            ]
          },
          "extension": [
            {
              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
              "extension": [
                {
                  "url": "ombCategory",
                  "valueCoding": {
                    "system": "urn:oid:2.16.840.1.113883.6.238",
                    "code": "2028-9"
                  }
                },
                {
                  "url": "text",
                  "valueString": "Asian"
                }
              ]
            },
            {
              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
              "extension": [
                {
                  "url": "ombCategory",
                  "valueCoding": {
                    "system": "urn:oid:2.16.840.1.113883.6.238",
                    "code": "2186-5"
                  }
                },
                {
                  "url": "text",
                  "valueString": "Not Hispanic or Latino"
                }
              ]
            }
          ],
          "identifier": [
            {
              "type": {
                "coding": [
                  {
                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                    "code": "MR",
                    "display": "Medical Record Number"
                  }
                ]
              },
              "system": "http://hl7.org/fhir/sid/us-ssn",
              "value": "472895623"
            }
          ],
          "name": [
            {
              "use": "official",
              "family": "Kagan",
              "given": [
                "Michael"
              ]
            }
          ],
          "gender": "male",
          "birthDate": "0069-01-22",
          "address": [
            {
              "use": "home",
              "line": [
                "1212 Fairmount Street"
              ],
              "city": "St. Paul",
              "district": "Ramsey",
              "state": "MN",
              "postalCode": "55102",
              "country": "US"
            }
          ],
          "maritalStatus": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus"
              }
            ],
            "text": "Single"
          }
        }
      },
      {
        "fullUrl": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner",
        "resource": {
          "resourceType": "Practitioner",
          "id": "MDI-DEV-AUG2024-1-Primary-Practitioner",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Practitioner-vr"
            ]
          },
          "identifier": [
            {
              "system": "urn:mdi:raven:provideridentifier",
              "value": "1234"
            }
          ],
          "name": [
            {
              "use": "official",
              "family": "Olson",
              "given": [
                "Lary"
              ]
            }
          ],
          "address": [
            {
              "line": [
                "1435 Besier Lane"
              ],
              "city": "Las Vegas",
              "district": "Clark",
              "state": "NV",
              "postalCode": "89106"
            }
          ]
        }
      },
      {
        "fullUrl": "Procedure/MDI-DEV-AUG2024-1-Certification",
        "resource": {
          "resourceType": "Procedure",
          "id": "MDI-DEV-AUG2024-1-Certification",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-certification"
            ]
          },
          "status": "not-done",
          "category": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "103693007",
                "display": "Diagnostic procedure"
              }
            ]
          },
          "code": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "308646001",
                "display": "Death certification"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "function": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "455381000124109",
                    "display": "Medical Examiner/Coroner"
                  }
                ]
              },
              "actor": {
                "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
              }
            }
          ]
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-DeathDate",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-DeathDate",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-death-date"
            ]
          },
          "status": "final",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "81956-5",
                "display": "Date+time of death"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "valueDateTime": "2021-09-23T00:00:00Z",
          "method": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-date-of-death-determination-methods-cs",
                "code": "exact",
                "display": "Exact"
              }
            ]
          },
          "component": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "80616-6",
                    "display": "Date and time pronounced dead [US Standard Certificate of Death]"
                  }
                ]
              },
              "valueDateTime": "2021-09-23T00:00:00Z"
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "58332-8",
                    "display": "Location of Death"
                  }
                ]
              },
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "16983000",
                    "display": "Death in hospital"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "fullUrl": "Location/MDI-DEV-AUG2024-1-Death-Location",
        "resource": {
          "resourceType": "Location",
          "id": "MDI-DEV-AUG2024-1-Death-Location",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Location-vr"
            ]
          },
          "name": "9501 West Sahara",
          "address": {
            "text": "9501 West Sahara"
          }
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-Tobacco",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-Tobacco",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-tobacco-use-contributed-to-death"
            ]
          },
          "status": "preliminary",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69443-0",
                "display": "Did tobacco use contribute to death"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "373067005",
                "display": "No"
              }
            ]
          }
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-Pregnancy",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-Pregnancy",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-decedent-pregnancy-status"
            ]
          },
          "status": "preliminary",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69442-2",
                "display": "Timing of recent pregnancy in relation to death"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-pregnancy-status-cs",
                "code": "1",
                "display": "Not pregnant within the past year"
              }
            ]
          }
        }
      },
      {
        "fullUrl": "Location/MDI-DEV-AUG2024-1-Injury-Location",
        "resource": {
          "resourceType": "Location",
          "id": "MDI-DEV-AUG2024-1-Injury-Location",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-location"
            ]
          },
          "name": "9501 West Sahara",
          "address": {
            "text": "9501 West Sahara"
          }
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart1-0",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-CauseOfDeathPart1-0",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-mdi-cause-of-death-part1"
            ]
          },
          "status": "preliminary",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69453-9"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "valueCodeableConcept": {
            "text": "Fat embolism syndrome"
          },
          "component": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-component-cs",
                    "code": "lineNumber"
                  }
                ]
              },
              "valueInteger": 1
            }
          ]
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart1-1",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-CauseOfDeathPart1-1",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-mdi-cause-of-death-part1"
            ]
          },
          "status": "preliminary",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69453-9"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "valueCodeableConcept": {
            "text": "Blunt force injuries of the legs"
          },
          "component": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/us/vrdr/CodeSystem/vrdr-component-cs",
                    "code": "lineNumber"
                  }
                ]
              },
              "valueInteger": 2
            }
          ]
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-CauseOfDeathPart2-0",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-CauseOfDeathPart2-0",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-cause-of-death-part2"
            ]
          },
          "status": "preliminary",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69441-4",
                "display": "Other significant causes or conditions of death"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "valueCodeableConcept": {
            "text": "Blunt force injuries of the head, acute renal failure, alcoholic cirrhosis"
          }
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-MannerOfDeath",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-MannerOfDeath",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-manner-of-death"
            ]
          },
          "status": "final",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "69449-7",
                "display": "Manner of death"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "7878000",
                "display": "Accidental Death"
              }
            ]
          }
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-InjuryIncident",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-InjuryIncident",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vrdr/StructureDefinition/vrdr-injury-incident"
            ]
          },
          "status": "final",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "11374-6",
                "display": "Injury incident description"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "effectiveDateTime": "0021-09-21T00:00:00+00:00",
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "component": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "69450-5",
                    "display": "Place of injury Facility"
                  }
                ]
              },
              "valueCodeableConcept": {
                "text": "9501 West Sahara"
              }
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "69444-8",
                    "display": "Did death result from injury at work"
                  }
                ]
              },
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://terminology.hl7.org/CodeSystem/v2-0136",
                    "code": "N",
                    "display": "No"
                  }
                ]
              }
            },
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "69448-9",
                    "display": "Injury leading to death associated with transportation event"
                  }
                ]
              },
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://snomed.info/sct",
                    "code": "257518000",
                    "display": "Pedestrian"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "fullUrl": "Observation/MDI-DEV-AUG2024-1-Autopsy",
        "resource": {
          "resourceType": "Observation",
          "id": "MDI-DEV-AUG2024-1-Autopsy",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/vr-common-library/StructureDefinition/Observation-autopsy-performed-indicator-vr"
            ]
          },
          "status": "final",
          "code": {
            "coding": [
              {
                "system": "http://loinc.org",
                "code": "85699-7",
                "display": "Autopsy was performed"
              }
            ]
          },
          "subject": {
            "reference": "Patient/MDI-DEV-AUG2024-1-Decedent"
          },
          "performer": [
            {
              "reference": "Practitioner/MDI-DEV-AUG2024-1-Primary-Practitioner"
            }
          ],
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v2-0136",
                "code": "N",
                "display": "No"
              }
            ]
          },
          "component": [
            {
              "code": {
                "coding": [
                  {
                    "system": "http://loinc.org",
                    "code": "69436-4",
                    "display": "Autopsy results available"
                  }
                ]
              },
              "valueCodeableConcept": {
                "coding": [
                  {
                    "system": "http://terminology.hl7.org/CodeSystem/v2-0136",
                    "code": "N",
                    "display": "No"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        "fullUrl": "Organization/MDI-DEV-AUG2024-1-Autopsy-Organization",
        "resource": {
          "resourceType": "Organization",
          "id": "MDI-DEV-AUG2024-1-Autopsy-Organization",
          "meta": {
            "profile": [
              "http://hl7.org/fhir/us/core/StructureDefinition/us-core-organization"
            ]
          },
          "identifier": [
            {
              "system": "http://hl7.org/fhir/sid/us-npi",
              "value": "12345678"
            }
          ],
          "active": true,
          "type": [
            {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/organization-type",
                  "code": "govt",
                  "display": "Government"
                }
              ]
            }
          ],
          "name": "Clark County Bureau of Investigations",
          "telecom": [
            {
              "system": "phone",
              "value": "(+1) 734-677-7777"
            }
          ],
          "address": [
            {
              "line": [
                "5820 Blush Ave"
              ],
              "city": "Las Vegas",
              "district": "Clark County",
              "state": "NV",
              "postalCode": "89130",
              "country": "USA"
            }
          ]
        }
      }
    ]
  }
}
