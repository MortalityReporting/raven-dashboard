export class AppConfiguration {
  static config: AppConfiguration = {
    title: "Raven",
    subTitle: "Medicolegal Death Investigation FHIR Implementation Guide Reference Implementation and Testing Platform",
    color: "#646064",
    contrastColor: "#fafafa",
    workflowTitles: {
      mdiToEdrs: "MDI to EDRS Document",
      toxToMdi: "Tox to MDI Message"
    },
    modules: {
      recordViewer: {
        title: "Record Viewer",
        route: "record-viewer",
        color: "#6EA4BF",
        icon: "record-viewer"
      },
      recordImport: {
        title: "Record Import",
        route: "record-import",
        color: "#4CAF50",
        icon: "record-import"
      },
      recordComparison: {
        title: "Record Comparison",
        route: "record-comparison",
        color: "#673AB7",
        icon: "record-comparison"
      },
      fhirValidator: {
        title: "FHIR Validator",
        route: "fhir-validator",
        color: "#dca705",
        icon: "fhir-validator"
      },
      workflowSimulator: {
        title: "Workflow Simulator",
        route: "workflow-simulator",
        color: "#E91E63",
        icon: "workflow-simulator"
      }
    }
  }

  title: string;
  subTitle: string;
  color: string;
  contrastColor: string;
  workflowTitles: {
    [x: string | number | symbol]: string;
  };
  modules: {
    [x: string | number | symbol]: Module;
  };
}

class Module {
  title: string;
  route: string;
  color: string;
  icon: string;
}
