import * as Diff from 'diff';
import {DiffValue} from '../diff-value';
import {ObservationDiff} from './observation.diff';

export class ObservationDecedentPregnancyDiff extends ObservationDiff { 
    status: DiffValue;
    valueCodeableConcept: DiffValue;
    
    constructor()
    {
        super();

        this.state = 'invalid';
        this.status = new DiffValue();
        this.valueCodeableConcept = new DiffValue();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {      
            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffValue.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.state,this.valueCodeableConcept.difference] = DiffValue.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

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