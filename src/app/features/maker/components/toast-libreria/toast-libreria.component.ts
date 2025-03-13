import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-libreria',
  imports: [CommonModule],
  templateUrl: './toast-libreria.component.html',
  styles: `
  app-toast-libreria {
    position: absolute;
    z-index: 1000;
  }
  `
})
export class ToastLibreriaComponent {
  @Input() backgroundColor: string = 'text-green-800 bg-green-50 dark:text-green-400 dark:bg-gray-800';
  @Input() iconBackgroundColor: string = 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
  @Input() iconColor: string = 'text-green-500';
  @Input() iconPath: string = 'M5 13l4 4L19 7';
  @Input() iconDescription: string = 'UI component icon';
  @Input() textColor: string = 'text-gray-500 dark:text-gray-400';
  @Input() message: string = 'Ejemplo de componente de ui';
  cdkDrag: boolean;
}
