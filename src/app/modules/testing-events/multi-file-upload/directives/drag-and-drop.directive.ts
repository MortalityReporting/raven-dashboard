import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dragAndDrop]'
})
export class DragAndDropDirective {

  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.opacity') private workspaceOpacity = '1';

  // Dragover listener, when files are dragged over our host element
  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspaceOpacity = '0.7';
  }

  // Dragleave listener, when files are dragged away from our host element
  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspaceOpacity = '1';
  }

  //Drop listener, when files are dropped on our host element
  @HostListener('drop', ['$event']) public ondrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspaceOpacity = '1';
    let files = event.dataTransfer!.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }

}
