import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationDecedentPregnancyDiff extends ObservationDiff {
    status: DiffType;
    valueCodeableConcept: DiffType;

    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.style = 'invalid';
        this.status = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();

        try {
            this.status.expected = JSON.stringify( {status: this.expected.status}, null, 4 );
            this.status.actual = JSON.stringify( {status: this.actual.status}, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));
        } catch(e) {};

        try {
            this.valueCodeableConcept.expected = JSON.stringify( {valueCodeableConcept: this.expected.valueCodeableConcept}, null, 4 );
            this.valueCodeableConcept.actual = JSON.stringify( {valueCodeableConcept: this.actual.valueCodeableConcept}, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));
        } catch(e) {};
    }
}
