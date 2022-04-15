export const TrackingNumberVS: any = {
  "resourceType": "ValueSet",
  "id": "ValueSet-tracking-number-type",
  "meta": {
    "versionId": "5",
    "lastUpdated": "2022-02-18T01:09:23.141+00:00",
    "source": "#JLKMqYSSFNkpqYlF"
  },
  "text": {
    "status": "extensions",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><ul><li>Include these codes as defined in <a href=\"CodeSystem-CodeSystem-mdi-codes.html\"><code>http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes</code></a><table class=\"none\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td><td><b>Definition</b></td></tr><tr><td><a href=\"CodeSystem-CodeSystem-mdi-codes.html#CodeSystem-mdi-codes-mdi-case-number\">mdi-case-number</a></td><td>MDI Case Number</td><td>MDI Case Number</td></tr><tr><td><a href=\"CodeSystem-CodeSystem-mdi-codes.html#CodeSystem-mdi-codes-edrs-file-number\">edrs-file-number</a></td><td>EDRS File Number</td><td>EDRS File Number</td></tr><tr><td><a href=\"CodeSystem-CodeSystem-mdi-codes.html#CodeSystem-mdi-codes-tox-lab-case-number\">tox-lab-case-number</a></td><td>Toxicology Laboratory Case Number</td><td>Toxicology Laboratory Case Number</td></tr></table></li></ul></div>"
  },
  "url": "http://hl7.org/fhir/us/mdi/ValueSet/ValueSet-tracking-number-type",
  "version": "1.0.0-ballot",
  "name": "ValueSetTrackingNumberType",
  "title": "ValueSet - Tracking Number Type",
  "status": "active",
  "date": "2022-03-31T04:01:47+00:00",
  "publisher": "HL7 Public Health Work Group (http://www.hl7.org/Special/committees/pher/index.cfm)",
  "contact": [
    {
      "name": "HL7 International - Public Health",
      "telecom": [
        {
          "system": "url",
          "value": "http://www.hl7.org/Special/committees/pher"
        }
      ]
    }
  ],
  "description": "This value set contains codes to that identify the type of tracking number.",
  "jurisdiction": [
    {
      "coding": [
        {
          "system": "urn:iso:std:iso:3166",
          "code": "US",
          "display": "United States of America"
        }
      ],
      "text": "United States of America"
    }
  ],
  "compose": {
    "include": [
      {
        "system": "http://hl7.org/fhir/us/mdi/CodeSystem/CodeSystem-mdi-codes",
        "concept": [
          {
            "code": "mdi-case-number",
            "display": "MDI Case Number"
          },
          {
            "code": "edrs-file-number",
            "display": "EDRS File Number"
          },
          {
            "code": "tox-lab-case-number",
            "display": "Toxicology Laboratory Case Number"
          }
        ]
      }
    ]
  }
}
