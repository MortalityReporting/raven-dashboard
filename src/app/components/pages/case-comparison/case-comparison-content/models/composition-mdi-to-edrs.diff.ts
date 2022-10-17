import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class CompositionMdiToEdrsDiff {    
    author: DiffType;
    date: DiffType;
    extension: DiffType;
    id: DiffType;
    identifier: DiffType;
    meta: DiffType;
    resourceType: DiffType;
    section: DiffType;
    status: DiffType;
    subject: DiffType;
    type: DiffType;

    style: string;
    
    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;
        this.style = 'invalid';
        this.author = new DiffType();
        this.date = new DiffType();
        this.extension = new DiffType();
        this.id = new DiffType();
        this.identifier = new DiffType();
        this.meta = new DiffType();
        this.resourceType = new DiffType();
        this.section = new DiffType();
        this.status = new DiffType();
        this.subject = new DiffType();
        this.type = new DiffType();

        this.doDiff();
    }

    doDiff()
    {    
        try {      
            this.author.actual = JSON.stringify( this.actual.author, null, 4 );
            this.author.expected = JSON.stringify( this.expected.author, null, 4 );
            [this.author.style,this.author.difference] = DiffType.doDiff( Diff.diffChars( this.author.expected, this.author.actual ));  

            this.date.actual = JSON.stringify( this.actual.date, null, 4 );
            this.date.expected = JSON.stringify( this.expected.date, null, 4 );
            [this.date.style,this.date.difference] = DiffType.doDiff( Diff.diffChars( this.date.expected, this.date.actual ));  

            this.extension.actual = JSON.stringify( this.actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( this.expected.extension, null, 4 );
            [this.extension.style,this.extension.difference] = DiffType.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  

            this.id.actual = JSON.stringify( this.actual.id, null, 4 );
            this.id.expected = JSON.stringify( this.expected.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.identifier.actual = JSON.stringify( this.actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( this.expected.identifier, null, 4 );
            [this.identifier.style,this.identifier.difference] = DiffType.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  

            this.meta.actual = JSON.stringify( this.actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( this.expected.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.resourceType.actual = JSON.stringify( this.actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( this.expected.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.section.actual = JSON.stringify( this.actual.section, null, 4 );
            this.section.expected = JSON.stringify( this.expected.section, null, 4 );
            [this.section.style,this.section.difference] = DiffType.doDiff( Diff.diffChars( this.section.actual, this.section.expected ));  

            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.actual, this.status.expected ));  

            this.subject.actual = JSON.stringify( this.actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( this.expected.subject, null, 4 );
            [this.subject.style,this.subject.difference] = DiffType.doDiff( Diff.diffChars( this.subject.actual, this.subject.expected ));  

            this.type.actual = JSON.stringify( this.actual.type, null, 4 );
            this.type.expected = JSON.stringify( this.expected.type, null, 4 );
            [this.type.style,this.type.difference] = DiffType.doDiff( Diff.diffChars( this.type.actual, this.type.expected ));  

            let style = 
                this.author.style === 'valid' &&
                this.date.style === 'valid' &&
                this.extension.style === 'valid' &&
                this.id.style === 'valid' &&
                this.identifier.style === 'valid' &&
                this.meta.style === 'valid' &&
                this.resourceType.style === 'valid' &&
                this.section.style === 'valid' &&
                this.status.style === 'valid' &&
                this.subject.style === 'valid' &&
                this.type.style=== 'valid';

            this.style = style ? 'valid' : 'invalid';
        
        } catch(e) {
//            console.log(e);
        }
    }
}