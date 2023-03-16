export interface ValidationResults {
  // Fields that characterize the validator API response
  isValid?: boolean,
  hasBasicErrors?: boolean,
  infoCount?: number,
  notesCount?: number,
  warningsCount?: number,
  errorsCount?: number
}
