import * as Diff from 'diff';
import {DiffType} from './diff-type';
import {ObservationDiff} from './observation.diff';
import { DocumentHandlerService } from "../../record-viewer/services/document-handler.service";
import {FhirHelperService} from "../../fhir-util/services/fhir-helper.service";

export class ObservationCauseOfDeathPart1Diff extends ObservationDiff {
    performer: DiffType;
    valueString: DiffType;
    valueCodeableConcept: DiffType;

  fhirHelper: FhirHelperService

    constructor(
        actual: any,
        expected: any,
        fhirHelper: FhirHelperService
      )
    {
        super( actual, expected );

        this.fhirHelper = fhirHelper;
        this.performer = new DiffType();
        this.valueString = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();

        try {
            let expectedComponent = this.fhirHelper.findObservationComponentByCode(this.expected, "69440-6");
            this.valueString.expected = JSON.stringify( expectedComponent.valueString, null, 4 );
            let actualComponent = this.fhirHelper.findObservationComponentByCode(this.actual, "69440-6");
            this.valueString.actual = JSON.stringify( actualComponent.valueString, null, 4 );
            [this.valueString.style,this.valueString.difference] = DiffType.doDiff( Diff.diffChars( this.valueString.expected, this.valueString.actual ));
        } catch(e) {}

        try {
            this.performer.expected = JSON.stringify( this.expected.performer, null, 4 );
            this.performer.actual = JSON.stringify( this.actual.performer, null, 4 );
            [this.performer.style,this.performer.difference] = DiffType.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));
        } catch(e) {}

        try {
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));
        } catch(e) {}
    }
}