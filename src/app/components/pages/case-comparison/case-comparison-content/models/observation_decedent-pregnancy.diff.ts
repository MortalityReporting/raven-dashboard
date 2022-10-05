import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationDecedentPregnancyDiff extends ObservationDiff { 
    status: DiffType;
    valueCodeableConcept: DiffType;
    
    constructor()
    {
        super();

        this.state = 'invalid';
        this.status = new DiffType();
        this.valueCodeableConcept = new DiffType();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {      
            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.state,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

            let state =
                this.state === 'valid' &&
                this.status.state === 'valid' &&
                this.valueCodeableConcept.state === 'valid'
        
            this.state = state ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}