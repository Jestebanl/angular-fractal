import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ComponenteService } from '../../../shared/services/componente.service';
import { SelectedComponentsService } from '../../../shared/services/selected-components.service';
import { VentanaComponenteComponent } from "../components/ventana-componente/ventana-componente.component";
import { ListaComponentesComponent } from "../components/lista-componentes/lista-componentes.component";

@Component({
  selector: 'app-aside-bar',
  imports: [NgIf, NgFor, NgClass, VentanaComponenteComponent, ListaComponentesComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent implements OnInit {
  @Output() componenteInsertado = new EventEmitter<any>();
  isDarkMode: boolean = false;
  categories: any[] = [];

  constructor(
    private componenteService: ComponenteService,
    private selectedComponentsService: SelectedComponentsService
  ) {}

  ngOnInit() {
    this.loadDarkModePreference();
    this.loadComponentes();
  }

  loadComponentes() {
    this.componenteService.getComponentes().subscribe(
      componentes => {
        this.categories = this.groupComponentesByCategory(componentes);
      },
      error => {
        console.error('Error al cargar componentes:', error);
      }
    );
  }

  groupComponentesByCategory(componentes: any[]): any[] {
    const groupedComponents = componentes.reduce((acc, componente) => {
      if (!acc[componente.categoria]) {
        acc[componente.categoria] = {
          name: componente.categoria,
          isOpen: false,
          types: {}
        };
      }
      if (!acc[componente.categoria].types[componente.tipo]) {
        acc[componente.categoria].types[componente.tipo] = {
          name: componente.tipo,
          isOpen: false,
          components: []
        };
      }
      acc[componente.categoria].types[componente.tipo].components.push(componente);
      return acc;
    }, {});

    return Object.values(groupedComponents).map((category: any) => ({
      ...category,
      types: Object.values(category.types)
    }));
  }
  
  loadDarkModePreference() {
    const prefersDarkMode = localStorage.getItem('dark-mode') === 'true';
    this.isDarkMode = prefersDarkMode;
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const htmlElement = document.documentElement;
    this.isDarkMode = htmlElement.classList.toggle('dark');
    localStorage.setItem('dark-mode', this.isDarkMode.toString());
  }
  componenteSeleccionado: any | null = null; // Inicializa explícitamente a null

  abrirPopup(componente: any) {
    this.componenteSeleccionado = componente;
  }

  cerrarPopup() {
    this.componenteSeleccionado = null;
  }

  insertarComponente(componente: any) {
    // Add component to selected list
    this.selectedComponentsService.addComponent(componente);
    
    // Emit the component as before
    this.componenteInsertado.emit(componente);
    this.cerrarPopup();
  }
}