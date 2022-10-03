import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class ObservationDiff {    
    code: DiffValue;
    id: DiffValue;
    meta: DiffValue;
    resourceType: DiffValue;
    subject: DiffValue;

    state: string;

    constructor()
    {
        this.state = 'invalid';
        this.code = new DiffValue();
        this.id = new DiffValue();
        this.meta = new DiffValue();
        this.resourceType = new DiffValue();
        this.subject = new DiffValue();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.code.actual = JSON.stringify( actual.code, null, 4 );
            this.code.expected = JSON.stringify( expected.code, null, 4 );
            [this.code.state,this.code.difference] = DiffValue.doDiff( Diff.diffChars( this.code.expected, this.code.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffValue.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  

            this.subject.actual = JSON.stringify( actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( expected.subject, null, 4 );
            [this.subject.state,this.subject.difference] = DiffValue.doDiff( Diff.diffChars( this.subject.expected, this.subject.actual ));  

            let state = 
                this.code.state === 'valid' &&
                this.id.state === 'valid' &&
                this.meta.state === 'valid' &&
                this.resourceType.state === 'valid' &&
                this.subject.state === 'valid';

            this.state = state ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}