import {RequestType} from "../models/request-type";
import {ConnectionType} from "../models/connection-type";

export const RequestTypeOptions = [RequestType.GET, RequestType.PUT, RequestType.POST];


export const ConnectionTypeOptions: Record<ConnectionType, { value: ConnectionType; name: string }> = {
  [ConnectionType.basicAuth]: { value: ConnectionType.basicAuth, name: 'Basic Auth' },
  [ConnectionType.token]: { value: ConnectionType.token, name: 'Bearer Token' },
  [ConnectionType.custom]: { value: ConnectionType.custom, name: 'Custom' }
};


export const ETHNICITY = [
  {
    code: "2135-2",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Hispanic or Latino",
    definition: "",
  },
  {
    code: "2186-5",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Not Hispanic or Latino",
    definition: "",
  },

  {
    code: "ASKU",
    system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    display: "Asked but unknown",
    definition: "Information was sought but not found (e.g., patient was asked but didn't know)",
  },
  {
    code: "UNK",
    system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    display: "Unknown",
    definition: "\t**Description:**A proper value is applicable, but not known. **Usage Notes**: This means the actual value is not known. If the only thing that is unknown is how to properly express the value in the necessary constraints (value set, datatype, etc.), then the OTH or UNC flavor should be used. No properties should be included for a datatype with this property unless: 1. Those properties themselves directly translate to a semantic of \"unknown\". (E.g. a local code sent as a translation that conveys 'unknown') 2. Those properties further qualify the nature of what is unknown. (E.g. specifying a use code of \"H\" and a URL prefix of \"tel:\" to convey that it is the home phone number that is unknown.)",
  }
];


export const RACE_CATEGORIES = [
  {
    code: "1002-5",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "American Indian or Alaska Native",
    definition: "American Indian or Alaska Native",
  },
  {
    code: "2028-9",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Asian",
    definition: "Asian",
  },
  {
    code: "2054-5",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Black or African American",
    definition: "Black or African American",
  },
  {
    code: "2076-8",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Native Hawaiian or Other Pacific Islander",
    definition: "Native Hawaiian or Other Pacific Islander",
  },
  {
    code: "2106-3",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "White",
    definition: "White",
  },
  {
    code: "ASKU",
    system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    display: "Asked but no answer",
    definition: "Information was sought but not found (e.g., patient was asked but didn't know)",
  },
  {
    code: "UNK",
    system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    display: "Unknown",
    definition: "Description:A proper value is applicable, but not known. Usage Notes: This means the actual value " +
      "is not known. If the only thing that is unknown is how to properly express the value in the necessary " +
      "constraints (value set, datatype, etc.), then the OTH or UNC flavor should be used. No properties should be " +
      "included for a datatype with this property unless: Those properties themselves directly translate to a semantic" +
      " of \"unknown\". (E.g. a local code sent as a translation that conveys 'unknown') Those properties further " +
      "qualify the nature of what is unknown. (E.g. specifying a use code of \"H\" and a URL prefix of \"tel:\" to " +
      "convey that it is the home phone number that is unknown.)",
  },
];

export const PLACE_OF_DEATH = ["Decedent's Residence", "Residence of Another", "Hospital - Inpatient", "Hospital ER/Outpatient", "Hospice Facility", "Nursing Home/LTCF", "Street/Highway", "Body of Water", "Other" ]
