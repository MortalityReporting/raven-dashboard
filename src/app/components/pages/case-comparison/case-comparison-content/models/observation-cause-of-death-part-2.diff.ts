import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationCauseOfDeathPart2Diff extends ObservationDiff { 
    performer: DiffType;
    valueCodeableConcept: DiffType;
    
    constructor()
    {
        super();

        this.performer = new DiffType();
        this.valueCodeableConcept = new DiffType();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {      
            this.performer.actual = JSON.stringify( actual.performer, null, 4 );
            this.performer.expected = JSON.stringify( expected.performer, null, 4 );
            [this.performer.style,this.performer.difference] = DiffType.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

            let style =
                this.style === 'valid' &&
                this.performer.style === 'valid' &&
                this.valueCodeableConcept.style === 'valid'
        
            this.style = style ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}