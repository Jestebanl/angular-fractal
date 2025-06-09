import { CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, Input, NgZone } from '@angular/core';

@Component({
  selector: 'app-toast-libreria',
  imports: [CommonModule,DragDropModule ],
  templateUrl: './toast-libreria.component.html',
  styles: `
   :host {
      position: absolute;
      z-index: 40;
    }
    .toast-container {
      transition: transform 0.2s ease-out;
      cursor: move;
    }
  `
})
export class ToastLibreriaComponent {
  @Input() backgroundColor: string = 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800';
  @Input() iconBackgroundColor: string = 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
  @Input() iconColor: string = 'text-green-500';
  @Input() iconPath: string = 'M5 13l4 4L19 7';
  @Input() iconDescription: string = 'UI component icon';
  @Input() textColor: string = 'text-gray-500 dark:text-gray-200';
  @Input() message: string = 'Ejemplo de componente de ui';
  @Input() cdkDragBoundary: any;
  @Input() class: string = 'flex items-center w-full max-w-xs p-4 rounded-lg shadow-sm cursor-grab';

  position: { [key: string]: string } = { left: '0px', top: '0px' };

  constructor(private el: ElementRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.position = {
      left: this.el.nativeElement.style.left || '0px',
      top: this.el.nativeElement.style.top || '0px'
    };
  }

  onDragStarted(event: CdkDragStart): void {
    this.ngZone.run(() => {
      this.class = 'flex items-center w-full max-w-xs p-4 rounded-lg shadow-sm cursor-grabbing';
    });
  }

  onDragEnded(event: CdkDragEnd): void {
    this.ngZone.run(() => {
      const { x, y } = event.source.getFreeDragPosition();
      this.position = { left: `${x}px`, top: `${y}px` };
      this.class = 'flex items-center w-full max-w-xs p-4 rounded-lg shadow-sm cursor-grab';
    });
  }
}
