import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DrawingTool = 'pointer' | 'rectangle' | 'arrow';

@Component({
  selector: 'app-isla-herramientas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './isla-herramientas.component.html',
  styles: ``
})
export class IslaHerramientasComponent {
  @Output() toolSelected = new EventEmitter<DrawingTool>();
  @Output() deleteSelected = new EventEmitter<void>();
  @Input() hasSelectedElement: boolean = false;
  
  activeTool: DrawingTool = 'pointer';

  selectTool(tool: DrawingTool): void {
    this.activeTool = tool;
    this.toolSelected.emit(tool);
  }

  deleteSelectedElement(): void {
    this.deleteSelected.emit();
  }
}
