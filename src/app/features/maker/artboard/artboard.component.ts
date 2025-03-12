import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { IslaHerramientasComponent } from "../components/isla-herramientas/isla-herramientas.component";
import { ToastLibreriaComponent } from "../components/toast-libreria/toast-libreria.component";
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { AuthStateService } from '../../../shared/services/auth-state.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-artboard',
  imports: [IslaHerramientasComponent, ToastLibreriaComponent,DragDropModule],
  templateUrl: './artboard.component.html',
  styleUrl: './artboard.component.css'
})
export class ArtboardComponent {
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
}
