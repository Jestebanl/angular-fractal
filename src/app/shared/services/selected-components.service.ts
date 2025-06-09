import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedComponentsService {
  private selectedComponentsSubject = new BehaviorSubject<any[]>([]);
  public selectedComponents$ = this.selectedComponentsSubject.asObservable();
  
  private componentRemovedSubject = new Subject<any>();
  public componentRemoved$ = this.componentRemovedSubject.asObservable();

  constructor() {}

  addComponent(componente: any): void {
    const currentComponents = this.selectedComponentsSubject.value;
    const componenteWithId = {
      ...componente,
      selectionId: Date.now() + Math.random() // Unique ID for this selection
    };
    this.selectedComponentsSubject.next([...currentComponents, componenteWithId]);
  }

  removeComponent(selectionId: number): void {
    const currentComponents = this.selectedComponentsSubject.value;
    const componentToRemove = currentComponents.find(comp => comp.selectionId === selectionId);
    const filteredComponents = currentComponents.filter(comp => comp.selectionId !== selectionId);
    
    this.selectedComponentsSubject.next(filteredComponents);
    
    // Emit the removed component for cleanup purposes
    if (componentToRemove) {
      this.componentRemovedSubject.next(componentToRemove);
    }
  }

  clearComponents(): void {
    const currentComponents = this.selectedComponentsSubject.value;
    this.selectedComponentsSubject.next([]);
    
    // Emit all components for cleanup
    currentComponents.forEach(component => {
      this.componentRemovedSubject.next(component);
    });
  }

  getSelectedComponents(): Observable<any[]> {
    return this.selectedComponents$;
  }
}
