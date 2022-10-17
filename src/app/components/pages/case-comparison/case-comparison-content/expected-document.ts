export class ExpectedDocument {
  value = 
  {
    "resourceType": "Bundle",
    "id": "ba652e6a-ba37-44af-9821-b834dc0fa814",
    "meta": {
      "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs" ]
    },
    "type": "document",
    "entry": [ {
      "fullUrl": "Composition/560ea07f-132d-4479-b1c4-ab683e4cc412",
      "resource": {
        "resourceType": "Composition",
        "id": "560ea07f-132d-4479-b1c4-ab683e4cc412",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs" ]
        },
        "extension": [ {
          "url": "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number",
          "valueIdentifier": {
            "type": {
              "coding": [ {
                "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
                "code": "mdi-case-number"
              } ]
            },
            "value": "123789"
          }
        }, {
          "url": "http://hl7.org/fhir/us/mdi/StructureDefinition/Extension-tracking-number",
          "valueIdentifier": {
            "type": {
              "coding": [ {
                "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
                "code": "edrs-file-number"
              } ]
            },
            "value": "789123"
          }
        } ],
        "identifier": {
          "type": {
            "coding": [ {
              "system": "urn:mdi:temporary:code",
              "code": "1000007",
              "display": "Case Number"
            } ]
          },
          "value": "TestIdentifier"
        },
        "status": "preliminary",
        "type": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "86807-5",
            "display": "Death administrative information Document"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "date": "2022-09-27T12:41:25-04:00",
        "author": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "section": [ {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
              "code": "circumstances"
            } ]
          },
          "entry": [ {
            "reference": "Location/4be59621-a97b-4c7c-af82-c74c7b11082d"
          }, {
            "reference": "Observation/34b64056-2097-4d3a-b58b-04b65b1596d4"
          }, {
            "reference": "Observation/65c2fb7b-e1ce-4603-9f73-d1529d48acb9"
          } ]
        }, {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
              "code": "jurisdiction"
            } ]
          },
          "entry": [ {
            "reference": "Observation/f8da975a-cde7-45dd-a22a-4bb61b2fbaeb"
          } ]
        }, {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
              "code": "cause-manner"
            } ]
          },
          "entry": [ {
            "reference": "Observation/f1405782-a163-4e99-a389-cf50edd263fd"
          }, {
            "reference": "Observation/77a33613-7e1b-4bdb-92bb-032140af43f5"
          }, {
            "reference": "Observation/9a339f19-f621-40d5-b532-7d4f8cab39d9"
          }, {
            "reference": "Observation/9f1ab1be-0d67-4ec2-9646-d24806d2ef35"
          }, {
            "reference": "Observation/89bfd5cf-138f-48ff-bb1a-798006709093"
          }, {
            "reference": "Observation/5be5c1c0-0762-4dc9-8bb6-bcf1bf92428f"
          } ]
        } ]
      }
    }, {
      "fullUrl": "Location/4be59621-a97b-4c7c-af82-c74c7b11082d",
      "resource": {
        "resourceType": "Location",
        "id": "4be59621-a97b-4c7c-af82-c74c7b11082d",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-location" ]
        },
        "address": {
          "text": "456 Maple St., Manchester NH"
        }
      }
    }, {
      "fullUrl": "Observation/34b64056-2097-4d3a-b58b-04b65b1596d4",
      "resource": {
        "resourceType": "Observation",
        "id": "34b64056-2097-4d3a-b58b-04b65b1596d4",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-tobacco-use-contributed-to-death" ]
        },
        "status": "preliminary",
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69443-0",
            "display": "Did tobacco use contribute to death"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "valueCodeableConcept": {
          "coding": [ {
            "system": "http://snomed.info/sct",
            "code": "373067005",
            "display": "No"
          } ]
        }
      }
    }, {
      "fullUrl": "Observation/65c2fb7b-e1ce-4603-9f73-d1529d48acb9",
      "resource": {
        "resourceType": "Observation",
        "id": "65c2fb7b-e1ce-4603-9f73-d1529d48acb9",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-decedent-pregnancy" ]
        },
        "status": "preliminary",
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69442-2",
            "display": "Timing of recent pregnancy in relation to death"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "valueCodeableConcept": {
          "coding": [ {
            "system": "http://hl7.org/fhir/v3/NullFlavor",
            "code": "NA",
            "display": "not applicable"
          } ]
        }
      }
    }, {
      "fullUrl": "Observation/f8da975a-cde7-45dd-a22a-4bb61b2fbaeb",
      "resource": {
        "resourceType": "Observation",
        "id": "f8da975a-cde7-45dd-a22a-4bb61b2fbaeb",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date" ]
        },
        "status": "final",
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "81956-5",
            "display": "Date+time of death"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "effectiveDateTime": "2022-09-27T12:41:25-04:00",
        "valueDateTime": "2023-01-01T07:40:00-05:00"
      }
    }, {
      "fullUrl": "Observation/f1405782-a163-4e99-a389-cf50edd263fd",
      "resource": {
        "resourceType": "Observation",
        "id": "f1405782-a163-4e99-a389-cf50edd263fd",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1" ]
        },
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69453-9"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "text": "Staphylococcal sepsis"
        },
        "component": [ {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-local-component-codes",
              "code": "lineNumber"
            } ]
          },
          "valueInteger": 1
        }, {
          "code": {
            "coding": [ {
              "system": "http://loinc.org",
              "code": "69440-6"
            } ]
          },
          "valueString": "3 days"
        } ]
      }
    }, {
      "fullUrl": "Observation/77a33613-7e1b-4bdb-92bb-032140af43f5",
      "resource": {
        "resourceType": "Observation",
        "id": "77a33613-7e1b-4bdb-92bb-032140af43f5",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1" ]
        },
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69453-9"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "text": "Decubitus ulcers of back and buttocks"
        },
        "component": [ {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-local-component-codes",
              "code": "lineNumber"
            } ]
          },
          "valueInteger": 2
        }, {
          "code": {
            "coding": [ {
              "system": "http://loinc.org",
              "code": "69440-6"
            } ]
          },
          "valueString": "4 months"
        } ]
      }
    }, {
      "fullUrl": "Observation/9a339f19-f621-40d5-b532-7d4f8cab39d9",
      "resource": {
        "resourceType": "Observation",
        "id": "9a339f19-f621-40d5-b532-7d4f8cab39d9",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1" ]
        },
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69453-9"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "text": "Anoxic encephalopathy"
        },
        "component": [ {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-local-component-codes",
              "code": "lineNumber"
            } ]
          },
          "valueInteger": 3
        }, {
          "code": {
            "coding": [ {
              "system": "http://loinc.org",
              "code": "69440-6"
            } ]
          },
          "valueString": "12 years"
        } ]
      }
    }, {
      "fullUrl": "Observation/9f1ab1be-0d67-4ec2-9646-d24806d2ef35",
      "resource": {
        "resourceType": "Observation",
        "id": "9f1ab1be-0d67-4ec2-9646-d24806d2ef35",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-cause-of-death-part1" ]
        },
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69453-9"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "text": "Oxycodone and Alprazolam toxicity"
        },
        "component": [ {
          "code": {
            "coding": [ {
              "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-local-component-codes",
              "code": "lineNumber"
            } ]
          },
          "valueInteger": 4
        }, {
          "code": {
            "coding": [ {
              "system": "http://loinc.org",
              "code": "69440-6"
            } ]
          },
          "valueString": "12 years"
        } ]
      }
    }, {
      "fullUrl": "Observation/89bfd5cf-138f-48ff-bb1a-798006709093",
      "resource": {
        "resourceType": "Observation",
        "id": "89bfd5cf-138f-48ff-bb1a-798006709093",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-contributing-cause-of-death-part2" ]
        },
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69441-4",
            "display": "Other significant causes or conditions of death"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "text": "Diabetes mellitus"
        }
      }
    }, {
      "fullUrl": "Observation/5be5c1c0-0762-4dc9-8bb6-bcf1bf92428f",
      "resource": {
        "resourceType": "Observation",
        "id": "5be5c1c0-0762-4dc9-8bb6-bcf1bf92428f",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-manner-of-death" ]
        },
        "status": "final",
        "code": {
          "coding": [ {
            "system": "http://loinc.org",
            "code": "69449-7",
            "display": "Manner of death"
          } ]
        },
        "subject": {
          "reference": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b"
        },
        "performer": [ {
          "reference": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c"
        } ],
        "valueCodeableConcept": {
          "coding": [ {
            "system": "http://snomed.info/sct",
            "code": "7878000",
            "display": "Accidental Death"
          } ]
        }
      }
    }, {
      "fullUrl": "Patient/a383e0b3-cf64-4eb9-b4e3-57196ad81e9b",
      "resource": {
        "resourceType": "Patient",
        "id": "a383e0b3-cf64-4eb9-b4e3-57196ad81e9b",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient" ]
        },
        "text": {
          "status": "generated",
          "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">Whago C <b>BROX </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>771d3cb9-3d1f-4c5c-a53a-4ff21a5d81a3</td></tr><tr><td>Address</td><td><span>Phoenixville </span><span>PA </span></td></tr><tr><td>Date of birth</td><td><span>02 January 1982</span></td></tr></tbody></table></div>"
        },
        "extension": [ {
          "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
          "extension": [ {
            "url": "ombCategory",
            "valueCoding": {
              "system": "urn:oid:2.16.840.1.113883.6.238",
              "code": "2106-3"
            }
          }, {
            "url": "text",
            "valueString": "White"
          } ]
        }, {
          "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
          "extension": [ {
            "url": "ombCategory",
            "valueCoding": {
              "system": "urn:oid:2.16.840.1.113883.6.238",
              "code": "2135-2"
            }
          }, {
            "url": "text",
            "valueString": "Not Hipanic Or Latino"
          } ]
        } ],
        "identifier": [ {
          "type": {
            "coding": [ {
              "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
              "code": "MR",
              "display": "Medical Record Number"
            } ]
          },
          "system": "http://hl7.org/fhir/sid/us-ssn",
          "value": "555-11-1234"
        }, {
            "type": {
            "coding": [ {
              "system": "urn:mdi:temporary:code",
              "code": "1000007",
              "display": "Case Number"
            } ]
          },
          "system": "urn:mdi:cms:unknown",
          "value": "771d3cb9-3d1f-4c5c-a53a-4ff21a5d81a3"
        } ],
        "name": [ {
          "use": "official",
          "family": "Brox",
          "given": [ "Whago", "C" ]
        } ],
        "gender": "male",
        "birthDate": "1982-01-02",
        "address": [ {
          "extension": [ {
            "url": "Text",
            "valueString": "8005 Miller Street"
          } ],
          "use": "home",
          "city": "Phoenixville",
          "state": "PA"
        } ]
      }
    }, {
      "fullUrl": "Practitioner/b8cd530f-de4e-4f45-a5f9-a683de67d36c",
      "resource": {
        "resourceType": "Practitioner",
        "id": "b8cd530f-de4e-4f45-a5f9-a683de67d36c",
        "meta": {
          "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner" ]
        },
        "identifier": [ {
          "value": "34343"
        } ],
        "name": [ {
          "use": "official",
          "family": "Duval",
          "given": [ "Jennifer" ]
        } ],
        "telecom": [ {
          "value": "603-271-1235",
          "use": "work"
        } ],
        "address": [ {
          "line": [ "246 Pleasant St. Suite 218" ],
          "city": "Concord",
          "state": "NH",
          "postalCode": "3301"
        } ]
      }
    } ]
  }  
}