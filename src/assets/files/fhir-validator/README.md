# Raven FHIR Validator Results

## Zip Filename Format: </br>
**validator_results_YYYY-MM-DD HH_MM_SS**

The timestamp in the file indicates when the validation results were exported to PDF file.

## Contents:
 * README.md: This file
 * fhir_validator_report.pdf: validation results
 * resource.json: FHIR resource that was validated

### fhir_validator_report.pdf
This PDF file contains detailed validation results. Each row represents a warning, information, or error related to the data elements in the resource, which is available in the resource.json file.

Rows tagged with 'error' must be corrected, while warning and information rows require user attention.

The FHIR Path and Location are provided to assist users in locating the lines where warnings, information, or errors occur. It's important to note that sometimes the line numbers may not match the exact location indicated by the FHIR path due to cascade issues. To resolve this, please refer to the FHIR PATH. If you encounter the same or similar paths in subsequent lines, navigate to the latest row as it is likely the source of the warning, information, or error.

## Contact
For questions and issues, visit https://github.com/MortalityReporting/ or https://chat.fhir.org/#narrow/stream/305799-Medicolegal-Death-Investigation

### Note:
For Medicolegal Death Investigation (MDI) FHIR Implementation Collaborative (FIC), this PDF can be used as a test result for the test events
