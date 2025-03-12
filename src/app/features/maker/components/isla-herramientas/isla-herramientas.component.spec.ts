import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslaHerramientasComponent } from './isla-herramientas.component';

describe('IslaHerramientasComponent', () => {
  let component: IslaHerramientasComponent;
  let fixture: ComponentFixture<IslaHerramientasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IslaHerramientasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IslaHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
