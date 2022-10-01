import * as Diff from 'diff';
import {DiffValue} from '../diff-value';
import {ObservationDiff} from './observation.diff';

export class ObservationCauseOfDeathPart1Diff extends ObservationDiff { 
    component: DiffValue;
    performer: DiffValue;    
    valueCodeableConcept: DiffValue;

    constructor()
    {
        super();

        this.component = new DiffValue();
        this.performer = new DiffValue();
        this.valueCodeableConcept = new DiffValue();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {      
            this.component.actual = JSON.stringify( actual.component, null, 4 );
            this.component.expected = JSON.stringify( expected.component, null, 4 );
            [this.component.state,this.component.difference] = DiffValue.doDiff( Diff.diffChars( this.component.actual, this.component.expected ));  

            this.performer.actual = JSON.stringify( actual.performer, null, 4 );
            this.performer.expected = JSON.stringify( expected.performer, null, 4 );
            [this.performer.state,this.performer.difference] = DiffValue.doDiff( Diff.diffChars( this.performer.actual, this.performer.expected ));  

            this.valueCodeableConcept.actual = JSON.stringify( actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.state,this.valueCodeableConcept.difference] = DiffValue.doDiff( Diff.diffChars( this.valueCodeableConcept.actual, this.valueCodeableConcept.expected ));  
        } catch(e) {
            console.log(e);
        }
    }
}