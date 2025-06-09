import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaComponentesComponent } from './lista-componentes.component';

describe('ListaComponentesComponent', () => {
  let component: ListaComponentesComponent;
  let fixture: ComponentFixture<ListaComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaComponentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
