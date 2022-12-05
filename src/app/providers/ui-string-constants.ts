import { Injectable } from '@angular/core'
@Injectable()

export class UiStringConstants {

  Common = {
    DECEDENT_NAME: `Decedent Name`,
    DATE_TIME_OF_DEATH: `Date/Time of death`,
    MDI_TRACKING_NUMBER: `MDI Tracking Number`,
  }

  WorkflowSimulator = {
    // Landing page
    FEATURE_DESCRIPTION: `Select a testing workflow from the list below. You will walk through a series of steps to guide in testing of that workflow using the Raven platform, with demonstration of relevant FHIR Resources and API interactions.1`,
    EDRS_SEARCH_DESCRIPTION: `Description. (need to talk through wording with Myung, may be able to pull from test docs somewhat)`,

    searchEdrs: {
      // Step 1
      step1: {
        STEP_LABEL: `Select MDI to EDRS document`,
        DESCRIPTION: `Step 1 - Select or Import an MDI to EDRS Document (Optional) If provided, the Document Bundle is used to populate the Search Parameters. Otherwise, the Search Parameters may be manually specified.`,
        TAB_LABEL_1: `Select MDI to EDRS Document`,
        TAB_LABEL_2: `Import MDI to EDRS FHIR Document Bundle`,
        INPUT_FILE_BTN: `Import MDI to EDRS FHIR Document Bundle`,
        SELECT_FILE_BTN: `Select File`,
        PROCEED_TO_NEXT_STEP_BTN: `Proceed to Configure Endpoint`,
        UPLOAD_JSON_CONTENT_MSG:`The data provided should be a valid FHIR MDI to EDRS Document Bundle. Please validate your resource prior to using it in the workflow simulator or unexpected behavior may occur.`,
        UPLOAD_FILE_CONTENT_MSG:`Click the "Input MDI to EDRS Document Bundle" button below to paste in your complete Document Bundle resource or click "Select File" to select a plain text (JSON) file from your local drive.`
      },

      // Step 2
      step2: {
        STEP_LABEL: `Configure Endpoint`,
        DISCLAIMER: `Disclaimer about user data storage being client side and not visible to Raven/GTRI/etc`,
        VIEW_CAPABILITY_STMT_BTN: `View Server Capability Statement`,
        VIEW_SERVER_$MDI_DOCS_OP_DEFINITION_BTN: `View Server $mdi-documents Operation Definition`,
        PROCEED_TO_NEXT_STEP_BTN: `Proceed to search`,
      },
      // Step 3
      step3: {
        STEP_LABEL: `Search EDRS`,
      },




    }
  }
}
