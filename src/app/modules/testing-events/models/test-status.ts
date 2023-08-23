export enum TestStatus {
  notStarted = 'Not Started',
  inProgress = 'In Progress',
  complete = 'Complete',
  reviewPending = 'Review Pending',
  actionRequired = 'Action Required'
}

export const TestStatusDescriptions = {
  "not-started": "Test has not been attempted by the user.",
  "in-progress": "Test has been started and is in progress by the user.",
  "complete": "Test has been successfully completed by the user.",
  "review-pending": "Documentation of test completion has been submitted by the user and is pending review by administrators.",
  "action-required": "Action is required by the user. Typically this means there was an issue with submitted documentation. If no specific action is required, please reach out to administrators."
}

export const TestStatusDictionary = {
  "not-started": TestStatus.notStarted,
  "in-progress": TestStatus.inProgress,
  "complete": TestStatus.complete,
  "review-pending": TestStatus.reviewPending,
  "action-required": TestStatus.actionRequired
}
