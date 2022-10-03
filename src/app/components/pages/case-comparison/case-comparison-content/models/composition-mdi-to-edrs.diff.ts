import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class CompositionMdiToEdrsDiff {    
    author: DiffValue;
    date: DiffValue;
    extension: DiffValue;
    id: DiffValue;
    identifier: DiffValue;
    meta: DiffValue;
    resourceType: DiffValue;
    section: DiffValue;
    status: DiffValue;
    subject: DiffValue;
    type: DiffValue;

    state: string;

    constructor()
    {
        this.state = 'invalid';
        this.author = new DiffValue();
        this.date = new DiffValue();
        this.extension = new DiffValue();
        this.id = new DiffValue();
        this.identifier = new DiffValue();
        this.meta = new DiffValue();
        this.resourceType = new DiffValue();
        this.section = new DiffValue();
        this.status = new DiffValue();
        this.subject = new DiffValue();
        this.type = new DiffValue();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.author.actual = JSON.stringify( actual.author, null, 4 );
            this.author.expected = JSON.stringify( expected.author, null, 4 );
            [this.author.state,this.author.difference] = DiffValue.doDiff( Diff.diffChars( this.author.expected, this.author.actual ));  

            this.date.actual = JSON.stringify( actual.date, null, 4 );
            this.date.expected = JSON.stringify( expected.date, null, 4 );
            [this.date.state,this.date.difference] = DiffValue.doDiff( Diff.diffChars( this.date.expected, this.date.actual ));  

            this.extension.actual = JSON.stringify( actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( expected.extension, null, 4 );
            [this.extension.state,this.extension.difference] = DiffValue.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.identifier.actual = JSON.stringify( actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expected.identifier, null, 4 );
            [this.identifier.state,this.identifier.difference] = DiffValue.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffValue.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.section.actual = JSON.stringify( actual.section, null, 4 );
            this.section.expected = JSON.stringify( expected.section, null, 4 );
            [this.section.state,this.section.difference] = DiffValue.doDiff( Diff.diffChars( this.section.actual, this.section.expected ));  

            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffValue.doDiff( Diff.diffChars( this.status.actual, this.status.expected ));  

            this.subject.actual = JSON.stringify( actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( expected.subject, null, 4 );
            [this.subject.state,this.subject.difference] = DiffValue.doDiff( Diff.diffChars( this.subject.actual, this.subject.expected ));  

            this.type.actual = JSON.stringify( actual.type, null, 4 );
            this.type.expected = JSON.stringify( expected.type, null, 4 );
            [this.type.state,this.type.difference] = DiffValue.doDiff( Diff.diffChars( this.type.actual, this.type.expected ));  

            let state = 
                this.author.state === 'valid' &&
                this.date.state === 'valid' &&
                this.extension.state === 'valid' &&
                this.id.state === 'valid' &&
                this.identifier.state === 'valid' &&
                this.meta.state === 'valid' &&
                this.resourceType.state === 'valid' &&
                this.section.state === 'valid' &&
                this.status.state === 'valid' &&
                this.subject.state === 'valid' &&
                this.type.state=== 'valid';

            this.state = state ? 'valid' : 'invalid';
        
        } catch(e) {
            console.log(e);
        }
    }
}