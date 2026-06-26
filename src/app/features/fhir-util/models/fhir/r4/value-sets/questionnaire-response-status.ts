// https://hl7.org/fhir/R4/valueset-questionnaire-answers-status.html

export enum QuestionnaireResponseStatus {
  inProgress = "in-progress", // In Progress
  completed = "completed", // Completed
  amended = "amended", // Amended
  enteredInError = "entered-in-error", // Entered in Error
  stopped = "stopped" // Stopped
}
