import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationCauseOfDeathPart1Diff extends ObservationDiff {
    component: DiffType;
    performer: DiffType;
    valueCodeableConcept: DiffType;

    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.component = new DiffType();
        this.performer = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();

        try {
            this.component.expected = JSON.stringify( this.expected.component, null, 4 );
            this.component.actual = JSON.stringify( this.actual.component, null, 4 );
            [this.component.style,this.component.difference] = DiffType.doDiff( Diff.diffChars( this.component.expected, this.component.actual ));
        } catch(e) {};

        try {
            this.performer.expected = JSON.stringify( this.expected.performer, null, 4 );
            this.performer.actual = JSON.stringify( this.actual.performer, null, 4 );
            [this.performer.style,this.performer.difference] = DiffType.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));
        } catch(e) {};

        try {
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));
        } catch(e) {};
    }
}
