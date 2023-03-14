export class AppConfiguration {
  static config: AppConfiguration = {
    title: "Raven",
    subTitle: "Medicolegal Death Investigation FHIR Implementation Guide Reference Implementation and Testing Platform",
    color: "#646064",
    contrastColor: "#fafafa",
    modules: {
      recordViewer: {
        title: "Record Viewer",
        route: "record-viewer"
      },
      recordImport: {
        title: "Record Import",
        route: "record-import"
      },
      recordComparison: {
        title: "Record Comparison",
        route: "record-comparison"
      },
      fhirValidator: {
        title: "FHIR Validator",
        route: "fhir-validator"
      },
      workflowSimulator: {
        title: "Workflow Simulator",
        route: "workflow-simulator"
      }
    }
  }

  title: string;
  subTitle: string;
  color: string;
  contrastColor: string;
  modules: {
    [x: string | number | symbol]: Module;
  };
}

class Module {
  title: string;
  route: string;
}
