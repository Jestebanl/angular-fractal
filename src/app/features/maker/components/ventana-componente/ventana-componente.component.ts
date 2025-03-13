import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ventana-componente',
  imports: [],
  templateUrl: './ventana-componente.component.html',
  styles: ``
})
export class VentanaComponenteComponent {
  @Input() componente: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() insertar = new EventEmitter<any>();

  cerrarPopup() {
    this.cerrar.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cerrarPopup();
    }
  }

  insertarComponente() {
    this.insertar.emit(this.componente);
    this.cerrarPopup();
  }
}
