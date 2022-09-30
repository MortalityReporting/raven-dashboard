import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class ObservationDiff {    
    code: DiffValue;
    id: DiffValue;
    meta: DiffValue;
    resourceType: DiffValue;
    status: DiffValue;
    subject: DiffValue;

    constructor()
    {
        this.code = new DiffValue();
        this.id = new DiffValue();
        this.meta = new DiffValue();
        this.resourceType = new DiffValue();
        this.status = new DiffValue();
        this.subject = new DiffValue();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.code.actual = JSON.stringify( actual.code, null, 4 );
            this.code.expected = JSON.stringify( expected.code, null, 4 );
            [this.code.state,this.code.difference] = DiffValue.doDiff( Diff.diffChars( this.code.actual, this.code.expected ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.actual, this.id.expected ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffValue.doDiff( Diff.diffChars( this.meta.actual, this.meta.expected ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffValue.doDiff( Diff.diffChars( this.status.actual, this.status.expected ));  

            this.subject.actual = JSON.stringify( actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( expected.subject, null, 4 );
            [this.subject.state,this.subject.difference] = DiffValue.doDiff( Diff.diffChars( this.subject.actual, this.subject.expected ));  
        } catch(e) {
            console.log(e);
        }
    }
}