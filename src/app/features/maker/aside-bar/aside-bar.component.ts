import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aside-bar',
  imports: [NgIf],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.css'
})
export class AsideBarComponent implements OnInit {
  isDarkMode: boolean = false;

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