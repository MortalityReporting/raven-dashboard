export enum TestStatus {
  notStarted = 'Not Started',
  inProgress = 'In Progress',
  testSuccess = 'Success',
  testFailed = 'Test Failed'
}

export const TestStatusDictionary = {
  "not-started": TestStatus.notStarted,
  "in-progress": TestStatus.inProgress,
  "test-success": TestStatus.testSuccess,
  "test-failed": TestStatus.testFailed
}
