import { Component, ViewChild, ElementRef, inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IslaHerramientasComponent } from "../components/isla-herramientas/isla-herramientas.component";
import { ToastLibreriaComponent } from "../components/toast-libreria/toast-libreria.component";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthStateService } from '../../../shared/services/auth-state.service';
import { Router } from '@angular/router';
import { ComponenteService } from '../../../shared/services/componente.service';
@Component({
  selector: 'app-artboard',
  imports: [IslaHerramientasComponent,DragDropModule],
  templateUrl: './artboard.component.html',
  styleUrl: './artboard.component.css'
})
export class ArtboardComponent {
  cdkDrag!: boolean;
  @ViewChild('boundaryElement', { static: true }) boundaryElement!: ElementRef;

  toastPosition = { x: 0, y: 0 };

  onDragEnded(event: CdkDragEnd) {
    this.toastPosition = event.source.getFreeDragPosition();
  }
  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/login');
  }
  //----------------------------------------
  @ViewChild('toastContainer', { read: ViewContainerRef, static: true }) toastContainer!: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componenteService: ComponenteService
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastLibreriaComponent);
    const componentRef = this.toastContainer.createComponent(componentFactory);
    
    Object.keys(toastData).forEach(key => {
      (componentRef.instance as any)[key] = toastData[key];
    });
  
    componentRef.instance.cdkDrag = true;
  
    componentRef.location.nativeElement.style.position = 'absolute';
    componentRef.location.nativeElement.style.left = '20px';
    componentRef.location.nativeElement.style.top = '20px';
  }
  
}
