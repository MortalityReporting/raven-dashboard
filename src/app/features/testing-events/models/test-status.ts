// This is the FHIR CodeSystem. // TODO: MAKE PUBLIC.
export const TestStatusSystem = "https://raven.dev.heat.icl.gtri.org/mdi-fhir-server/fhir/CodeSystem/624454";

// This is the FHIR ValueSet codes.
export enum TestStatusCodes {
  notStarted = 'not-started',
  inProgress = 'in-progress',
  complete = 'complete',
  reviewPending = 'review-pending',
  actionRequired = 'action-required'
}

export const TestStatusDictionary = {
  "not-started": {
    "display": "Not Started",
    "description": "Test has not been attempted by the user."
  },
  "in-progress": {
    "display": "In Progress",
    "description": "Test has been started and is in progress by the user."
  },
  "complete": {
    "display": "Complete",
    "description": "Test has been successfully completed by the user."
  },
  "review-pending": {
    "display": "Review Pending",
    "description": "Documentation of test completion has been submitted by the user and is pending review by administrators."
  },
  "action-required": {
    "display": "Action Required",
    "description": "Action is required by the user. Typically this means there was an issue with submitted documentation. If no specific action is required, please reach out to administrators."
  }
}

export function TestStatusReverseLookUp(display: string): string {
  return Object.keys(TestStatusDictionary).find(key => TestStatusDictionary[key].display === display);
}

