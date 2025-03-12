import { Component } from '@angular/core';
import { IslaHerramientasComponent } from "../components/isla-herramientas/isla-herramientas.component";
import { ToastLibreriaComponent } from "../components/toast-libreria/toast-libreria.component";

@Component({
  selector: 'app-artboard',
  imports: [IslaHerramientasComponent, ToastLibreriaComponent],
  templateUrl: './artboard.component.html',
  styleUrl: './artboard.component.css'
})
export class ArtboardComponent {

}
