import { Injectable } from '@angular/core'
import {TestStatusCodes} from "../modules/testing-events";
import {Test} from "../modules/tests";

@Injectable()
export class UiStringConstants {

  Common = {
    DECEDENT_NAME: `Decedent Name`,
    DATE_TIME_OF_DEATH: `Date/Time of death`,
    MDI_TRACKING_NUMBER: `MDI Tracking Number`,
    DECEDENT_FIRST_NAME: `Decedent First Name`,
    DECEDENT_LAST_NAME: `Decedent Last Name`,
    LEGAL_SEX_AT_DEATH: `Legal Sex at Death`,
    DISTRICT_OF_DEATH: `District of Death`,
  }

  WorkflowSimulator = {
    // Landing page
    FEATURE_DESCRIPTION: `Select a testing workflow from the list below. You will walk through a series of steps to guide in testing of that workflow using the Raven platform, with demonstration of relevant FHIR Resources and API interactions.1`,
    EDRS_SEARCH_DESCRIPTION: `Description. (need to talk through wording with Myung, may be able to pull from test docs somewhat)`,

    searchEdrs: {
      // Step 1
      step1: {
        STEP_LABEL: `Select MDI to EDRS Document`,
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
        STEP_LABEL: `Establish Connection`,
        DESCRIPTION: `Step 2 - Establish Connection. The BlueJay test server is provided as a default.`,
        VIEW_CAPABILITY_STMT_BTN: `View Server Capability Statement`,
        VIEW_SERVER_$MDI_DOCS_OP_DEFINITION_BTN: `View Server $mdi-documents Operation Definition`,
        PROCEED_TO_NEXT_STEP_BTN: `Proceed to search`,
        authenticationOptions: ['None', 'Basic', 'Bearer Token'],
        endpointTypeOptions: ['Registered Endpoint', 'Custom Endpoint'],
        auth0Credentials: {
          grantType: { name: 'GRANT TYPE', value: 'Client Credentials', display: 'Grant Type' },
          accessTokenUrl: { name: 'ACCESS TOKEN URL', value: 'https://dev-dk7cyfpkwowbtdbt.us.auth0.com/oauth/token', display: 'Access Token' },
          clientId: { name: 'CLIENT ID', value: 'vsRE3dEgCWF24mEf1KOsWD88igoHKAKl', display: 'Client ID' },
          clientSecret: { name: 'CLIENT SECRET', value: 'UZVZxFR_Ykj2ByXqqsahso0PO1wDk0Wutl2lCvzf-21Y_I2OugTxUa1hnpwb27Ym', display: 'Client Secret' },
          audience: { name: 'AUDIENCE', value: 'http://bluejay-fhir-api/', display: 'Audience' },
          curlExample: { display:
          "curl \t--request POST\n"+
              "\t--url https://dev-dk7cyfpkwowbtdbt.us.auth0.com/oauth/token\n" +
              "\t--header 'content-type: application/json\n" +
              "\t--data '{\"client_id\":\"vsRE3dEgCWF24mEf1KOsWD88igoHKAKl\",\"client_secret\":\"UZVZxFR_Ykj2ByXqqsahso0PO1wDk0Wutl2lCvzf-21Y_I2OugTxUa1hnpwb27Ym\",\"audience\":\"http://bluejay-fhir-api/\",\"grant_type\":\"client_credentials\"}'"
          ,
            value: `curl --request POST   --url https://dev-dk7cyfpkwowbtdbt.us.auth0.com/oauth/token   --header 'content-type: application/json'   --data '{"client_id":"vsRE3dEgCWF24mEf1KOsWD88igoHKAKl","client_secret":"UZVZxFR_Ykj2ByXqqsahso0PO1wDk0Wutl2lCvzf-21Y_I2OugTxUa1hnpwb27Ym","audience":"http://bluejay-fhir-api/","grant_type":"client_credentials"}'`
          }
        }
      },
      // Step 3
      step3: {
        STEP_LABEL: `Search EDRS`,
        DESCRIPTION: `Step 3 - Set EDRS search parameters. Parameters may be automatically populated if a case was selected in Step #1. The parameter list is variable, defined by the FHIR Server's operation definition for EDRS searching. Search results are shown below. If any results were found, users may select a case and load a summary of the data.`,
        SEARCH_PARAMS_RESOURCE_PREVIEW: `Search Parameters Resource Preview`,
        RECORD_SUMMARY_INITIAL_DESCRIPTION: `Select a case from the results list to view summary here.`,
        RECORD_SUMMARY_TAB_LABEL: `Record Summary`,
        VIEW_FHIR_AS_MDI_DOCUMENT_TAB_LABEL: `View as FHIR MDI Document Bundle`
      },
    }
  }

  WORKFLOW_STANDALONE_TESTS : Test []= [
    {
      name: 'onboarding',
      display: 'Onboarding',
      description: "Onboarding module description",
      status: TestStatusCodes.notStarted,
      route: 'onboarding'
    },
    {
      name: 'search-edrs',
      display: 'Search EDRS',
      description: "The \"EDRS Search\" workflow simulates '" +
        "searching cases in an Electronic Death Registration System (EDRS). Testers representing Medical Examiners/Coroners (ME/Cs) " +
        "can provide search parameters executed against the BlueJay EDRS test server, which implements the MDI Documents FHIR " +
        "Operation for search. Supported parameters include primary case identification fields, as well as additional data " +
        "(e.g., demographics information) if it exists in the test EDRS case records. Search parameters and all relevant " +
        "HTTP requests and responses are provided in both human readable forms and as FHIR resources for demonstration.",
      status: TestStatusCodes.notStarted,
      route: 'search-edrs'
    },
    {
      name: 'updateEdrs',
      display: 'Update EDRS',
      description: "Updated EDRS module description",
      status: TestStatusCodes.notStarted,
      route: 'update-edrs'
    },
  ]
}
