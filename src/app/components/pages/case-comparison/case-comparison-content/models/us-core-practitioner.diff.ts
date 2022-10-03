import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class USCorePractitionerDiff {    
    address: DiffValue;
    id: DiffValue;
    meta: DiffValue;
    name: DiffValue;
    resourceType: DiffValue;
    telecom: DiffValue;

    state: string;

    constructor()
    {
        this.state = 'invalid';
        this.address = new DiffValue();
        this.id = new DiffValue();
        this.meta = new DiffValue();
        this.name = new DiffValue();
        this.resourceType = new DiffValue();
        this.telecom = new DiffValue();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.address.actual = JSON.stringify( actual.address, null, 4 );
            this.address.expected = JSON.stringify( expected.address, null, 4 );
            [this.address.state,this.address.difference] = DiffValue.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffValue.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.name.actual = JSON.stringify( actual.name, null, 4 );
            this.name.expected = JSON.stringify( expected.name, null, 4 );
            [this.name.state,this.name.difference] = DiffValue.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  

            this.telecom.actual = JSON.stringify( actual.telecom, null, 4 );
            this.telecom.expected = JSON.stringify( expected.telecom, null, 4 );
            [this.telecom.state,this.telecom.difference] = DiffValue.doDiff( Diff.diffChars( this.telecom.expected, this.telecom.actual ));  

            let state = 
                this.address.state === 'valid' &&
                this.id.state === 'valid' &&
                this.meta.state === 'valid' &&
                this.name.state === 'valid' &&
                this.resourceType.state === 'valid' &&
                this.telecom.state === 'valid'
        
            this.state = state ? 'valid' : 'invalid';

        } catch(e) {
            console.log(e);
        }
    }
}