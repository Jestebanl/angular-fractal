import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedComponentsService {
  private selectedComponentsSubject = new BehaviorSubject<any[]>([]);
  public selectedComponents$ = this.selectedComponentsSubject.asObservable();

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
    const filteredComponents = currentComponents.filter(comp => comp.selectionId !== selectionId);
    this.selectedComponentsSubject.next(filteredComponents);
  }

  clearComponents(): void {
    this.selectedComponentsSubject.next([]);
  }

  getSelectedComponents(): Observable<any[]> {
    return this.selectedComponents$;
  }
}
