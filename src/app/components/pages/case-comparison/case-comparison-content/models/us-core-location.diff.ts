import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class USCoreLocationDiff {    
    address: DiffType;
    id: DiffType;
    meta: DiffType;
    resourceType: DiffType;

    style: string = 'invalid';

    constructor()
    {
        this.style = 'invalid';
        this.address = new DiffType();
        this.id = new DiffType();
        this.meta = new DiffType();
        this.resourceType = new DiffType();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.address.actual = JSON.stringify( actual.address, null, 4 );
            this.address.expected = JSON.stringify( expected.address, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  

            let style = 
                this.address.style === 'valid' &&
                this.id.style === 'valid' &&
                this.meta.style === 'valid' &&
                this.resourceType.style === 'valid'
        
            this.style = style ? 'valid' : 'invalid';

        } catch(e) {
            console.log(e);
        }
    }
}