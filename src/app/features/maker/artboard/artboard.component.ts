import { Component, ViewChild, ElementRef, inject, ComponentFactoryResolver, ViewContainerRef, Renderer2, NgZone } from '@angular/core';
import { IslaHerramientasComponent } from "../components/isla-herramientas/isla-herramientas.component";
import { ToastLibreriaComponent } from "../components/toast-libreria/toast-libreria.component";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthStateService } from '../../../shared/services/auth-state.service';
import { Router } from '@angular/router';
import { ComponenteService } from '../../../shared/services/componente.service';
@Component({
  selector: 'app-artboard',
  imports: [IslaHerramientasComponent, DragDropModule],
  templateUrl: './artboard.component.html',
  styleUrl: './artboard.component.css'
})
export class ArtboardComponent {
  cdkDrag!: boolean;
  @ViewChild('boundaryElement', { static: true }) boundaryElement!: ElementRef;

  toastPosition = { x: 0, y: 0 };

  @ViewChild('toastContainer', { read: ViewContainerRef, static: true }) toastContainer!: ViewContainerRef;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componenteService: ComponenteService,
    private renderer: Renderer2,
    private _authState: AuthStateService,
    private _router: Router,
    private ngZone: NgZone
  ) {}
  insertarComponente(componente: any) {
    if (componente.toastReferenciado) {
      this.componenteService.getToastReferenciado(componente.toastReferenciado.id).subscribe(
        (toastData) => {
          this.crearToastDinamico(toastData);
        },
        (error) => {
          console.error('Error al obtener datos del toast:', error);
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

      const element = componentRef.location.nativeElement;
      this.renderer.addClass(element, 'absolute');
      this.renderer.setStyle(element, 'position', 'absolute');
      this.renderer.setStyle(element, 'left', '20px');
      this.renderer.setStyle(element, 'top', '20px');

      componentRef.changeDetectorRef.detectChanges();
    });
  }

  onDragEnded(event: CdkDragEnd) {
    // Este método se maneja ahora en el componente ToastLibreriaComponent
  }

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/login');
  }
}
