import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaComponenteComponent } from './ventana-componente.component';

describe('VentanaComponenteComponent', () => {
  let component: VentanaComponenteComponent;
  let fixture: ComponentFixture<VentanaComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaComponenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
