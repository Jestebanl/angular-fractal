import { Component, ViewChild, ElementRef, inject, ComponentFactoryResolver, ViewContainerRef, Renderer2, NgZone } from '@angular/core';
import { IslaHerramientasComponent, DrawingTool } from "../components/isla-herramientas/isla-herramientas.component";
import { ToastLibreriaComponent } from "../components/toast-libreria/toast-libreria.component";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthStateService } from '../../../shared/services/auth-state.service';
import { Router } from '@angular/router';
import { ComponenteService } from '../../../shared/services/componente.service';
import { CommonModule } from '@angular/common';

interface DrawingElement {
  type: 'rectangle' | 'arrow';
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  fill?: string;
  strokeWidth: number;
  opacity?: number;
  rx?: number; // For rounded corners
  dashArray?: string; // For dashed lines
  selected?: boolean; // Selection state
  shadow?: boolean; // Add shadow effect
}

@Component({
  selector: 'app-artboard',
  standalone: true,
  imports: [IslaHerramientasComponent, DragDropModule, CommonModule],
  templateUrl: './artboard.component.html',
  styleUrl: './artboard.component.css'
})
export class ArtboardComponent {
  cdkDrag!: boolean;
  @ViewChild('boundaryElement', { static: true }) boundaryElement!: ElementRef;

  toastPosition = { x: 0, y: 0 };

  // Drawing tools state
  currentTool: DrawingTool = 'pointer';
  isDrawing = false;
  drawingElements: DrawingElement[] = [];
  startPoint = { x: 0, y: 0 };
  currentElement: DrawingElement | null = null;

  @ViewChild('toastContainer', { read: ViewContainerRef, static: true }) toastContainer!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componenteService: ComponenteService,
    private renderer: Renderer2,
    private _authState: AuthStateService,
    private _router: Router,
    private ngZone: NgZone
  ) { }

  // Color schemes for light/dark mode
  colorScheme = {
    light: {
      rectangle: {
        stroke: '#6366f1', // Indigo
        fill: 'rgba(99, 102, 241, 0.08)',
        selectedStroke: '#4f46e5'
      },
      arrow: {
        stroke: '#8b5cf6', // Purple
        selectedStroke: '#7c3aed'
      }
    },
    dark: {
      rectangle: {
        stroke: '#818cf8', // Lighter indigo for dark mode
        fill: 'rgba(129, 140, 248, 0.15)',
        selectedStroke: '#a5b4fc'
      },
      arrow: {
        stroke: '#a78bfa', // Lighter purple for dark mode
        selectedStroke: '#c4b5fd'
      }
    }
  };

  // Check if we're in dark mode
  get isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Get current color scheme based on mode
  get currentColorScheme() {
    return this.isDarkMode ? this.colorScheme.dark : this.colorScheme.light;
  }

  handleToolSelected(tool: DrawingTool): void {
    this.currentTool = tool;

    // Deselect all elements when changing tools
    this.drawingElements.forEach(el => el.selected = false);
  }

  // Mouse event handlers for drawing
  onMouseDown(event: MouseEvent): void {
    if (this.currentTool !== 'pointer') {
      this.isDrawing = true;
      const rect = this.boundaryElement.nativeElement.getBoundingClientRect();
      this.startPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      const elementId = `drawing-${Date.now()}`;
      const colors = this.currentColorScheme;

      // Initialize the new element based on tool type
      if (this.currentTool === 'rectangle') {
        this.currentElement = {
          type: 'rectangle',
          id: elementId,
          x1: this.startPoint.x,
          y1: this.startPoint.y,
          x2: this.startPoint.x,
          y2: this.startPoint.y,
          stroke: colors.rectangle.stroke,
          fill: colors.rectangle.fill,
          strokeWidth: 1.5,
          rx: 4, // Rounded corners
          opacity: 0.9,
          shadow: true
        };
      } else { // Arrow
        this.currentElement = {
          type: 'arrow',
          id: elementId,
          x1: this.startPoint.x,
          y1: this.startPoint.y,
          x2: this.startPoint.x,
          y2: this.startPoint.y,
          stroke: colors.arrow.stroke,
          strokeWidth: 2,
          opacity: 0.95,
          shadow: true
        };
      }

      this.drawingElements.push(this.currentElement);
    } else {
      // Handle selection when in pointer mode
      const rect = this.boundaryElement.nativeElement.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Deselect all first
      this.drawingElements.forEach(el => el.selected = false);

      // Find and select clicked element (iterate in reverse to get top-most element first)
      for (let i = this.drawingElements.length - 1; i >= 0; i--) {
        const el = this.drawingElements[i];
        if (this.isPointInElement(clickX, clickY, el)) {
          el.selected = true;
          break; // Select only the top-most element
        }
      }
    }
  }

  // Check if a point is inside an element
  isPointInElement(x: number, y: number, el: DrawingElement): boolean {
    if (el.type === 'rectangle') {
      const minX = Math.min(el.x1, el.x2);
      const maxX = Math.max(el.x1, el.x2);
      const minY = Math.min(el.y1, el.y2);
      const maxY = Math.max(el.y1, el.y2);

      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    } else if (el.type === 'arrow') {
      // Simple proximity check for arrows
      const tolerance = 8;
      const dx = el.x2 - el.x1;
      const dy = el.y2 - el.y1;
      const length = Math.sqrt(dx * dx + dy * dy);

      if (length === 0) return false;

      const dotProduct = ((x - el.x1) * dx + (y - el.y1) * dy) / length;
      const projX = el.x1 + (dotProduct * dx) / length;
      const projY = el.y1 + (dotProduct * dy) / length;

      const distToLine = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));
      const withinLineSegment = dotProduct >= 0 && dotProduct <= length;

      return withinLineSegment && distToLine <= tolerance;
    }

    return false;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDrawing && this.currentElement) {
      const rect = this.boundaryElement.nativeElement.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      this.currentElement.x2 = currentX;
      this.currentElement.y2 = currentY;
    }
  }

  onMouseUp(): void {
    this.isDrawing = false;
    this.currentElement = null;
  }

  // Method to calculate rectangle path
  getRectanglePath(el: DrawingElement): string {
    const minX = Math.min(el.x1, el.x2);
    const minY = Math.min(el.y1, el.y2);
    const width = Math.abs(el.x2 - el.x1);
    const height = Math.abs(el.y2 - el.y1);
    const rx = el.rx || 0;

    // Create rounded rectangle path
    return `M${minX + rx},${minY} 
            h${width - 2 * rx} 
            a${rx},${rx} 0 0 1 ${rx},${rx} 
            v${height - 2 * rx} 
            a${rx},${rx} 0 0 1 -${rx},${rx} 
            h${-width + 2 * rx} 
            a${rx},${rx} 0 0 1 -${rx},-${rx} 
            v${-height + 2 * rx} 
            a${rx},${rx} 0 0 1 ${rx},-${rx}`;
  }

  // Method to calculate arrow path with a smoother look
  getArrowPath(el: DrawingElement): string {
    const dx = el.x2 - el.x1;
    const dy = el.y2 - el.y1;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    // Don't draw arrow heads for very short arrows
    if (length < 15) {
      return `M${el.x1},${el.y1} L${el.x2},${el.y2}`;
    }

    // Adjust arrow head size based on arrow length
    const headLength = Math.min(15, Math.max(10, length / 5));
    const headAngle = Math.PI / 6; // 30 degrees

    // Calculate arrow head coordinates
    const head1X = el.x2 - headLength * Math.cos(angle - headAngle);
    const head1Y = el.y2 - headLength * Math.sin(angle - headAngle);
    const head2X = el.x2 - headLength * Math.cos(angle + headAngle);
    const head2Y = el.y2 - headLength * Math.sin(angle + headAngle);

    return `M${el.x1},${el.y1} L${el.x2},${el.y2} M${head1X},${head1Y} L${el.x2},${el.y2} L${head2X},${head2Y}`;
  }

  insertarComponente(componente: any) {
    if (componente.toastReferenciado) {
      this.componenteService.getComponenteConToast(componente).subscribe(
        (data) => {
          // Use the component's name for the message
          const toastDataWithMessage = {
            ...data.toast,
            message: data.componente.nombre // Use component's name as message
          };
          this.crearToastDinamico(toastDataWithMessage);
        },
        (error) => {
          console.error('Error al obtener datos del componente y toast:', error);
        }
      );
    }
  }

  private crearToastDinamico(toastData: any) {
    this.ngZone.run(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastLibreriaComponent);
      const componentRef = this.toastContainer.createComponent(componentFactory);

      Object.keys(toastData).forEach(key => {
        (componentRef.instance as any)[key] = toastData[key];
      });

      componentRef.instance.cdkDragBoundary = this.boundaryElement.nativeElement;

      const element = componentRef.location.nativeElement;
      this.renderer.setStyle(element, 'position', 'absolute');
      this.renderer.setStyle(element, 'left', '20px');
      this.renderer.setStyle(element, 'top', '20px');

      componentRef.changeDetectorRef.detectChanges();
    });
  }

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/login');
  }

  onDragEnded(event: CdkDragEnd) {
    // Este método se maneja ahora en el componente ToastLibreriaComponent
  }
}
