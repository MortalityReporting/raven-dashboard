# FHIR Validator Results

## Zip Filename Format
**validator_results_YYYY-MM-DD HH_MM_SS.zip**

The timestamp in the Zip file's name indicates when the validation results were exported.

## Contents of Zip
* `README.md` -  This file.
* `resource.json` - The FHIR resource that was validated as JSON. (Note: This file is plain text and can be opened in any text editor.)
* `fhir_validator_report.pdf` - The results of the resource validation.

## Report PDF
The PDF file contains detailed validation results in a table. Each row represents a warning, information, or error related to the data elements in the resource. The information provided here aligns with the resource as it is written in the `resource.json` file.

The columns represent the following information:
* Severity - The severity of the validation issue. May be one of Error, Warning, Information, or Note. For more information on severity levels, see below.
* FHIR Path - FHIR Path provides technical users a path through the FHIR resource to identify the source of the issue. For example, `patient.gender` indicates there is an issue in the gender field of the patient resource.
* Diagostics - The description of the issue, such as what rule was violated or an issue that occurred during validation (e.g., not being able to connect to a terminology server).
* Location - A line number and column (character in the line) that aligns with the formatting found in the `resource.json` file.

The FHIR Path and Location are provided to assist users in locating the lines where warnings, information, or errors occur. It's important to note that sometimes the line numbers may not match the exact location indicated by the FHIR path due to cascade issues. To resolve this, please refer to the FHIR PATH. If you encounter the same or similar paths in subsequent lines, navigate to the latest row as it is likely the source of the warning, information, or error.

### Severity Levels

* **Error** - A violation of a rule either in the base FHIR specification or in the profile for a given resource. For example, a required field that is missing from the rsource. Any resource with an error is considered invalid.
* **Warn** - A warning is an issue that may be an error (invalidating the resource), but the validator cannot be definitive in assessing the issue due to any number of reasons. Warnings require human review. For example, a valueset with a binding of "preferred" does not disallow the use of codes outside of the valueset, but it is considered a rule that if a code from that valueset can be used it should be used.
* **Information** and **Note** - Information and Notes both provide additional details on a field to draw attention to various considerations, though are not indicative of an an actual or potential issue.

Rows tagged with "error" must be corrected, while other rows require human review.

For more information, please see: https://hl7.org/fhir/R4/conformance-rules.html#rule

## Contact
If you have any questions or encounter any issues, you may post an issue in the Mortality Reporting GitHub Organization in the relevant repository or reach out through the FHIR MDI Zulip Chat.
* Mortality Reporting GitHub - https://github.com/MortalityReporting/
* FHIR MDI Zulip Chat - https://chat.fhir.org/#narrow/stream/305799-Medicolegal-Death-Investigation


### Note
For Medicolegal Death Investigation (MDI) FHIR Implementation Collaborative (FIC) testing events, the PDF can be used to report testing results.
