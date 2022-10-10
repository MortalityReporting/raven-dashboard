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
            this.component.actual = JSON.stringify( this.actual.component, null, 4 );
            this.component.expected = JSON.stringify( this.expected.component, null, 4 );
            [this.component.style,this.component.difference] = DiffType.doDiff( Diff.diffChars( this.component.expected, this.component.actual ));  

            this.performer.actual = JSON.stringify( this.actual.performer, null, 4 );
            this.performer.expected = JSON.stringify( this.expected.performer, null, 4 );
            [this.performer.style,this.performer.difference] = DiffType.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

            let style =
                this.style === 'valid' &&
                this.component.style === 'valid' &&
                this.performer.style === 'valid' &&
                this.valueCodeableConcept.style === 'valid'
        
            this.style = style ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}