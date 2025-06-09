import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SelectedComponentsService } from '../../../../shared/services/selected-components.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-componentes',
  imports: [NgFor, NgIf],
  templateUrl: './lista-componentes.component.html',
  styles: ``
})
export class ListaComponentesComponent implements OnInit, OnDestroy {
  selectedComponents: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private selectedComponentsService: SelectedComponentsService) {}

  ngOnInit(): void {
    this.subscription = this.selectedComponentsService.getSelectedComponents().subscribe(
      components => {
        this.selectedComponents = components;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeComponent(selectionId: number): void {
    this.selectedComponentsService.removeComponent(selectionId);
  }

  clearAllComponents(): void {
    this.selectedComponentsService.clearComponents();
  }
}
