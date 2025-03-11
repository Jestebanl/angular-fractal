import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aside-bar',
  imports: [NgIf,NgFor,NgClass],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent implements OnInit {
  isDarkMode: boolean = false;
  categories = [
    {
      name: 'Componentes de UI',
      isOpen: false,
      components: ['Botón', 'Formulario', 'Tabla', 'Modal']
    },
    {
      name: 'Services',
      isOpen: false,
      components: ['AuthService', 'DataService', 'ApiService']
    },
    {
      name: 'Guards',
      isOpen: false,
      components: ['AuthGuard', 'RoleGuard', 'CanDeactivateGuard']
    },
    {
      name: 'Modelos',
      isOpen: false,
      components: ['Usuario', 'Producto', 'Pedido']
    }
  ];
  ngOnInit() {
    this.loadDarkModePreference();
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
}