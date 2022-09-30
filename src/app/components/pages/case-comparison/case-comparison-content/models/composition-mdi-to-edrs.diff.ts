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

    constructor()
    {
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
            [this.author.state,this.author.difference] = DiffValue.doDiff( Diff.diffChars( this.author.actual, this.author.expected ));  

            this.date.actual = JSON.stringify( actual.date, null, 4 );
            this.date.expected = JSON.stringify( expected.date, null, 4 );
            [this.date.state,this.date.difference] = DiffValue.doDiff( Diff.diffChars( this.date.actual, this.date.expected ));  

            this.extension.actual = JSON.stringify( actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( expected.extension, null, 4 );
            [this.extension.state,this.extension.difference] = DiffValue.doDiff( Diff.diffChars( this.extension.actual, this.extension.expected ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.actual, this.id.expected ));  

            this.identifier.actual = JSON.stringify( actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expected.identifier, null, 4 );
            [this.identifier.state,this.identifier.difference] = DiffValue.doDiff( Diff.diffChars( this.identifier.actual, this.identifier.expected ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffValue.doDiff( Diff.diffChars( this.meta.actual, this.meta.expected ));  

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
        } catch(e) {
            console.log(e);
        }
    }
}