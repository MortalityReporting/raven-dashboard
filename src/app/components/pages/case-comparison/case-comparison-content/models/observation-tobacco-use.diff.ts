import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationTobaccoUseDiff extends ObservationDiff { 
    status: DiffType;
    valueCodeableConcept: DiffType;
    
    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.status = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {    
        super.doDiff();

        try {      
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

            let style = 
                this.style === 'valid' &&
                this.status.style === 'valid' &&
                this.valueCodeableConcept.style === 'valid';

            this.style = style ? 'valid' : 'invalid';
        } catch(e) {
//            console.log(e);
        }
    }
}